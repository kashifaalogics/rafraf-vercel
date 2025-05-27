import { Customer } from "@common/types/account";
import { ApiConfig } from "@common/types/api";
import { Customer as MagentoCustomer } from "@framework/schema";
import { normalizeCustomer } from "@framework/utils";
import { updateCustomerInfoMutation } from "@framework/utils/graphql/customer";

type UpdateCustomerInfoResponse = {
  updateCustomer: {
    customer: MagentoCustomer;
  };
};

type UpdateCustomerInfoInput = {
  firstname: string;
  lastname: string;
  email: string;
};

const updateCustomerInfo = async (
  apiConfig: ApiConfig,
  variables: UpdateCustomerInfoInput
): Promise<Customer> => {
  try {
    const customer = await apiConfig.fetch<UpdateCustomerInfoResponse>({
      query: updateCustomerInfoMutation,
      token: apiConfig.token,
      variables,
    });
    return normalizeCustomer(customer.data.updateCustomer.customer);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default updateCustomerInfo;
