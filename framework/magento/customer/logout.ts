import { LoginCredentials } from "@common/types/account";
import { ApiConfig } from "@common/types/api";
import { logoutMutation } from "@framework/utils/graphql/customer";

type LoginResponse = {
  revokeCustomerToken: {
    result: boolean;
  };
};

const logout = async (
  apiConfig: ApiConfig
): Promise<{ result: boolean }> => {
  try {
    const cart = await apiConfig.fetch<LoginResponse>({
      query: logoutMutation,
      token: apiConfig.token,
    });
    return cart.data.revokeCustomerToken;
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {result: true}
  }

};

export default logout;
