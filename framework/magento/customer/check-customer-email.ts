import { Customer } from "@common/types/account";
import { ApiConfig } from "@common/types/api";
import { Customer as MagentoCustomer } from "@framework/schema";
import { checkCustomerEmailQuery } from "@framework/utils/graphql/customer";

export interface EmailOptions {
    email: String;
  }
  
const checkCustomerEmail = async (
  apiConfig: ApiConfig,
  variables: EmailOptions,

): Promise<any> => {
  try {
    const data = await apiConfig.fetch({
      query: checkCustomerEmailQuery,
      token: apiConfig.token,
      variables,
    });
    return data;
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default checkCustomerEmail;
