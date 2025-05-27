import { ApiConfig } from "@common/types/api";
import { resetPasswordMutation } from "@framework/utils/graphql/customer";

type ResetPasswordResponse = {
  resetPassword: boolean;
};

type ResetPasswordInput = {
  email: string;
  token: string;
  newPassword: string;
};

const resetPassword = async (
  apiConfig: ApiConfig,
  variables: ResetPasswordInput
): Promise<boolean> => {
  try {
    const customer = await apiConfig.fetch<ResetPasswordResponse>({
      query: resetPasswordMutation,
      token: apiConfig.token,
      variables,
    });
    return customer.data.resetPassword;

  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return true
  }

};

export default resetPassword;
