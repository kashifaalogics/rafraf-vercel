import { ApiConfig } from "@common/types/api";
import { createOrderQuery } from "@framework/utils/graphql/orders";

const createOrder = async (apiConfig: ApiConfig, variables: any): Promise<any> => {
  try {
    console.log("creating order");
    const order: any = await apiConfig.fetch({
      query: createOrderQuery,
      locale: apiConfig.locale,
      variables,
      token: apiConfig.token,
    });

    const orderNumber = order?.data?.placeOrder?.order?.order_number;

    if (!orderNumber) {
      console.error("Order number not found in the response:", order);
      return null;
    }

    console.log("Order number:", orderNumber);
    return orderNumber;
    
  } catch (e) {
    console.log('ERROR 500');
    console.log(e);

    return null; 
  }
};
  
  export default createOrder;