import { ApiConfig } from "@common/types/api";
import { createApplepayOrderQuery } from "@framework/utils/graphql/orders";

const createApplepayOrder = async (apiConfig: ApiConfig, variables: any): Promise<any> => {
    try {
      const order: any = await apiConfig.fetch({
        query: createApplepayOrderQuery,
        locale: apiConfig.locale,
        variables,
        token: apiConfig.token,
      });
      return order.data.addApplePay.message
    }
    catch(e) {
      console.log('ERROR 500')
      console.log(e)
  
      return {}
    }
  
  };
  
  export default createApplepayOrder;