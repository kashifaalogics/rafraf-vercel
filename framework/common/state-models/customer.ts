import { getSavedState, MapToSavable, saveState } from "@common/state-utils";
import { Dispatch, RootState } from "@common/store";
import {
  Customer,
  CustomerInfo,
  LoginCredentials,
  RegistrationCredentials,
} from "@common/types/account";
import { ApiConfig } from "@common/types/api";
import { handleSuccess } from "@common/utils/handlers";
import {
  changePassword,
  getCustomer,
  login,
  logout,
  requestResetPassword,
  resetPassword,
  signup,
  updateCustomerInfo,
} from "@framework/customer";
import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { useStore } from "@common/state";
import TagManager from "react-gtm-module";

export interface CustomerState {
  loggedIn: boolean;
  token: string | null;
  customer: Customer | null;
}

const initalState: CustomerState = {
  loggedIn: false,
  token: null,
  customer: null,
};

const mapToSavable: MapToSavable<CustomerState> = (state: CustomerState) => {
  return {
    loggedIn: state.loggedIn,
    token: state.token,
    customer: state.customer,
  };
};

const saveCustomerState = saveState<CustomerState>(
  "CUSTOMER_STATE",
  initalState,
  mapToSavable
);

const getSavedCustomerState = getSavedState<CustomerState>("CUSTOMER_STATE");

export const customer = createModel<RootModel>()({
  state: getSavedCustomerState() || initalState,

  reducers: {
    reset(state: CustomerState) {
      state.loggedIn = false;
      state.token = null;
      saveCustomerState(state);
    },

    forceLogout(state: CustomerState) {
      state.loggedIn = false;
      state.token = "Reset";
      saveCustomerState(state);
    },

    resetCustomer(state: CustomerState) {
      state.loggedIn = false;
      state.token = null;
      state.customer = null;
      saveCustomerState(state);
    },

    setLoggedInCustomer(state: CustomerState, payload: string) {
      state.token = payload;
      state.loggedIn = true;
      saveCustomerState(state);
    },

    setCustomer(state: CustomerState, payload: Customer) {
      state.customer = payload;
      saveCustomerState(state);
    },
  },

  effects: (dispatch: Dispatch) => {
    const { customer } = dispatch;

    const effects = {
      async login({
        apiConfig,
        credentials,
      }: {
        apiConfig: ApiConfig;
        credentials: LoginCredentials;
      }) {
        try {
          const { token } = await login(apiConfig, credentials);
          customer.setLoggedInCustomer(token);
          // set login to new state
          handleSuccess("login", apiConfig.locale);
          localStorage.setItem("TOKEN", token);
          useStore.getState().setLogin(true);
          const apiConfigWithToken = {
            ...apiConfig,
            token,
          };
          const customerRes = await getCustomer(apiConfigWithToken);

          TagManager.dataLayer({
            dataLayer: {
              event: "login",
              method: "Email",
              email: customerRes.email,
              status: customerRes.email ? "Login Success" : "Login Failed",
              first_name: customerRes.firstname,
              last_name: customerRes.lastname,
              phone: customerRes.mobile_number,
            },
          });

          customer.setCustomer(customerRes);
        } catch (e) {
          console.error("error:", e);
        }
      },

      async logout(apiConfig: ApiConfig) {
        const { result } = await logout(apiConfig);
        handleSuccess("logout", apiConfig.locale);
        customer.reset();
      },

      async signup({
        apiConfig,
        credentials,
      }: {
        apiConfig: ApiConfig;
        credentials: RegistrationCredentials;
      }) {
        try {
          const res = await signup(apiConfig, credentials);
          const { token } = await login(apiConfig, credentials);
          customer.setLoggedInCustomer(token);
          handleSuccess("login", apiConfig.locale);
          localStorage.setItem("TOKEN", token);
          useStore.getState().setLogin(true);
          const apiConfigWithToken = {
            ...apiConfig,
            token,
          };
          const customerRes = await getCustomer(apiConfigWithToken);
          // setCart to new state
          customer.setCustomer(customerRes);
        } catch (e) {}
      },

      async getCustomerData(apiConfig: ApiConfig, ...args: any[]) {
        const [state] = args as [RootState];
        const apiConfigWithToken = apiConfig;
        if (!apiConfig.token) {
          apiConfigWithToken.token = state.customer.token;
        }
        try {
          const customerRes = await getCustomer(apiConfigWithToken);
          // setCart to new state
          customer.setCustomer(customerRes);
        } catch (e) {
          console.log(e);
          customer.forceLogout();
        }
      },

      async updateCustomerInfo(
        { apiConfig, info }: { apiConfig: ApiConfig; info: CustomerInfo },
        ...args: any[]
      ) {
        const [state] = args as [RootState];
        const apiConfigWithToken = apiConfig;
        if (!apiConfig.token) {
          apiConfigWithToken.token = state.customer.token;
        }
        const customerRes = await updateCustomerInfo(apiConfig, info);
        customer.setCustomer(customerRes);
      },

      async changePassword(
        {
          apiConfig,
          currentPassword,
          newPassword,
        }: {
          apiConfig: ApiConfig;
          currentPassword: string;
          newPassword: string;
        },
        ...args: any[]
      ) {
        const [state] = args as [RootState];
        const apiConfigWithToken = apiConfig;
        if (!apiConfig.token) {
          apiConfigWithToken.token = state.customer.token;
        }
        const customerRes = await changePassword(apiConfig, {
          currentPassword,
          newPassword,
        });
        customer.setCustomer(customerRes);
      },

      async requestResetPassword({
        apiConfig,
        email,
      }: {
        apiConfig: ApiConfig;
        email: string;
      }) {
        const requestRes = await requestResetPassword(apiConfig, { email });
        if (!requestRes) {
          throw new Error("some error happened");
        }
      },

      async resetPassword({
        apiConfig,
        email,
        token,
        newPassword,
      }: {
        apiConfig: ApiConfig;
        email: string;
        token: string;
        newPassword: string;
      }) {
        const requestRes = await resetPassword(apiConfig, {
          email,
          token,
          newPassword,
        });
        if (!requestRes) {
          throw new Error("some error happened");
        }
      },
    };

    return effects;
  },
});
