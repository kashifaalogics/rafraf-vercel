import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as CartMagento } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { removeItemFromCartMutation } from "@framework/utils/graphql/cart";

type RemoveItemFromCartOption = {
  cartId: string;
  cartItemId: number;
};

type AddToCartMagentoResponse = {
  removeItemFromCart: {
    cart: CartMagento;
  };
};

const removeItemFromCart = async (
  apiConfig: ApiConfig,
  variables: RemoveItemFromCartOption
): Promise<Cart> => {
  try {
    const cart = await apiConfig.fetch<AddToCartMagentoResponse>({
      query: removeItemFromCartMutation,
      variables,
      token: apiConfig.token,
    });
  
    return normalizeCart(cart.data.removeItemFromCart.cart);

  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default removeItemFromCart;
