import { ApiConfig } from "@common/types/api";
import { placeOrderMutation } from "@framework/utils/graphql/cart";

type PlaceOrderResponse = {
  "placeOrder": {
    "order": {
      "order_number": string
    }
  }
};

type PlaceOrderInput = {
  cartId: string;
};

const placeOrder = async (
  apiConfig: ApiConfig,
  variables: PlaceOrderInput
): Promise<string> => {
  try {
    const cart = await apiConfig.fetch<PlaceOrderResponse>({
      query: placeOrderMutation,
      token: apiConfig.token,
      variables,
    });
    return cart.data.placeOrder.order.order_number;
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return ''
  }

};

export default placeOrder;
