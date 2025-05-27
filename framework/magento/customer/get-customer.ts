import { Customer } from "@common/types/account";
import { ApiConfig } from "@common/types/api";
import { Customer as MagentoCustomer } from "@framework/schema";
import { normalizeCustomer } from "@framework/utils";
import { getCustomerQuery } from "@framework/utils/graphql/customer";

type GetCustomerResponse = {
  customer: MagentoCustomer;
};

const getCustomer = async (
  apiConfig: ApiConfig
): Promise<Customer> => {
  try {
    const customer = await apiConfig.fetch<GetCustomerResponse>({
      query: getCustomerQuery,
      token: apiConfig.token,
    });
    return normalizeCustomer(customer.data.customer);

  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default getCustomer;
