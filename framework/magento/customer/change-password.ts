import { Customer } from "@common/types/account";
import { ApiConfig } from "@common/types/api";
import { Customer as MagentoCustomer } from "@framework/schema";
import { normalizeCustomer } from "@framework/utils";
import { changePasswordMutation } from "@framework/utils/graphql/customer";

type ChangePasswordResponse = {
  changeCustomerPassword: MagentoCustomer;
};

type ChangePasswordInput = {
  currentPassword: string;
  newPassword: string;
};

const changePassword = async (
  apiConfig: ApiConfig,
  variables: ChangePasswordInput
): Promise<Customer> => {
  try {
    const customer = await apiConfig.fetch<ChangePasswordResponse>({
      query: changePasswordMutation,
      token: apiConfig.token,
      variables,
    });
    return normalizeCustomer(customer.data.changeCustomerPassword);

  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default changePassword;
