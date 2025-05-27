import { RegistrationCredentials } from "@common/types/account";
import { ApiConfig } from "@common/types/api";
import { signUpMutation } from "@framework/utils/graphql/customer";
import TagManager from "react-gtm-module";

type RegistrationResponse = {
  createCustomerV2: {
    customer: any;
  };
};

const signup = async (
  apiConfig: ApiConfig,
  variables: RegistrationCredentials
): Promise<{ token: string }> => {
  try {
    const cart = await apiConfig.fetch<RegistrationResponse>({
      query: signUpMutation,
      variables,
      token: apiConfig.token,
    });

    TagManager.dataLayer({
      dataLayer: {
        event: "sign_up",
        email: variables.email,
        method: "Email",
        first_name: variables.firstname,
        last_name: variables.lastname,
        phone: variables.mobile_number,
        status: cart.data.createCustomerV2?.customer ? "Signup Success" : "Signup Failed",
      },
    });
    return cart.data.createCustomerV2.customer;
  } catch (e) {
    console.log("ERROR 500");
    console.log(e);

    return { token: "" };
  }
};

export default signup;
