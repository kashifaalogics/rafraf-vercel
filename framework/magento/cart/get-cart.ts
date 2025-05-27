import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as MagentoCart } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { getCartQuery } from "@framework/utils/graphql/cart";

type GetCartResponse = {
  cart: MagentoCart;
};

const getCart = async (
  apiConfig: ApiConfig,
  variables: { cartId: string }
): Promise<Cart> => {

  try {
    const cart = await apiConfig.fetch<GetCartResponse>({
      query: getCartQuery,
      variables,
      token: apiConfig.token,
    });
    return normalizeCart(cart.data.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default getCart;
