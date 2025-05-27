import { ApiConfig } from "@common/types/api";
import { requestResetPasswordMutation } from "@framework/utils/graphql/customer";

type RequestResetPasswordResponse = {
  requestPasswordResetEmail: boolean;
};

type RequestResetPasswordInput = {
  email: string;
};

const requestResetPassword = async (
  apiConfig: ApiConfig,
  variables: RequestResetPasswordInput
): Promise<boolean> => {
  try {
    const customer = await apiConfig.fetch<RequestResetPasswordResponse>({
      query: requestResetPasswordMutation,
      token: apiConfig.token,
      variables,
    });
    return customer.data.requestPasswordResetEmail;

  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return true
  }

};

export default requestResetPassword;
