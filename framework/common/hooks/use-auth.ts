import { Dispatch, RootState } from "@common/store";
import {
  LoginCredentials,
  RegistrationCredentials,
} from "@common/types/account";
import { useDispatch, useSelector } from "react-redux";
import { useApiConfig } from ".";
import { singletonHook } from "react-singleton-hook";
import { getSavedState } from "@common/state-utils";
import { CustomerState } from "@common/state-models/customer";
import { useRouter } from "next/router";
import { useState } from "react";

export interface UseAuthResult {
  loggedIn: boolean;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loggingIn: boolean;
  logout: () => Promise<void>;
  loggingOut: boolean;
  signup: (credentials: RegistrationCredentials) => Promise<void>;
  signingUp: boolean;
  requestResetPassword: (email: string) => Promise<void>;
  requestingResetPassword: boolean;
  resetPassword: ({
    email,
    token,
    newPassword,
  }: {
    email: string;
    token: string;
    newPassword: string;
  }) => Promise<void>;
  resettingPassword: boolean;
  showDiscount: boolean;
}

const getSavedCustomerState = getSavedState<CustomerState>("CUSTOMER_STATE");
const savedCustomerState = getSavedCustomerState();

const initialResult: UseAuthResult & { showDiscount: boolean } = {
  loggedIn: savedCustomerState?.loggedIn || false,
  token: savedCustomerState?.token || null,
  login: async (credentials: LoginCredentials) => {},
  loggingIn: false,
  logout: async () => {},
  loggingOut: false,
  signup: async (args) => {},
  signingUp: false,
  requestResetPassword: async (args) => {},
  requestingResetPassword: false,
  resetPassword: async (args) => {},
  resettingPassword: false,
  showDiscount: false, 
};

const useAuth = (): UseAuthResult => {
  const apiConfig = useApiConfig();
  const router = useRouter();
  const { loggedIn, token } = useSelector((state: RootState) => state.customer);
  const {
    login: loggingIn,
    logout: loggingOut,
    signup: signingUp,
    requestResetPassword: requestingResetPassword,
    resetPassword: resettingPassword,
  } = useSelector((state: RootState) => state.loading.effects.customer);
  const dispatch = useDispatch<Dispatch>();
  const { cart } = useDispatch<Dispatch>();
  const {
    login: loginEffect,
    logout: logoutEffect,
    signup: signupEffect,
    requestResetPassword: requestResetPasswordEffect,
    resetPassword: resetPasswordEffect,
  } = dispatch.customer;

  const wishlistState = useSelector((rootState: RootState) => rootState.wishlist);
  const [showDiscount, setShowDiscount] = useState(false); //added a useState for showing discount element

  const login = async (credentials: LoginCredentials) => {
    await loginEffect({ apiConfig, credentials });
    setShowDiscount(true);
  };

  const logout = async () => {
    await logoutEffect(apiConfig);
    cart.reset();
    localStorage.clear();
    router.push("/");
    // router.reload()
  };

  const signup = async (credentials: RegistrationCredentials) => {
    await signupEffect({ apiConfig, credentials });
    setShowDiscount(true);
  };

  const requestResetPassword = async (email: string) => {
    return await requestResetPasswordEffect({ apiConfig, email });
  };

  const resetPassword = async ({
    email,
    token,
    newPassword,
  }: {
    email: string;
    token: string;
    newPassword: string;
  }) => {
    return await resetPasswordEffect({ apiConfig, email, token, newPassword });
  };

  return {
    loggedIn,
    token,
    login,
    loggingIn,
    logout,
    loggingOut,
    signup,
    signingUp,
    requestResetPassword,
    requestingResetPassword,
    resetPassword,
    resettingPassword,
    showDiscount,
  };
};

export default singletonHook(initialResult, useAuth);
