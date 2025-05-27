import { LoginCredentials } from "@common/types/account";
import { ApiConfig } from "@common/types/api";
import { loginMutation } from "@framework/utils/graphql/customer";
import TagManager from "react-gtm-module";

type LoginResponse = {
  generateCustomerToken: {
    token: string;
  };
};

const login = async (
  apiConfig: ApiConfig,
  variables: LoginCredentials
): Promise<{ token: string }> => {
  try {
    const cart = await apiConfig.fetch<LoginResponse>({
      query: loginMutation,
      variables,
      token: apiConfig.token,
    });
    if(!cart.data.generateCustomerToken) {
      TagManager.dataLayer({
        dataLayer: {
          event: "login",
          method: "Email",
          email: variables.email,
          first_name: "",
          last_name: "",
          phone: "",
          status: "Login Failed",
        },
      });
    }
    return cart.data.generateCustomerToken;

  }
  catch(e) {
    console.log('error in assigning login token')
    console.log(e)

    return {token: ''}
  }

};

export default login;
