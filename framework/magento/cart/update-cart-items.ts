import { ApiConfig } from "@common/types/api";
import { Cart, CartItem } from "@common/types/cart";
import {
  Cart as CartMagento,
  CartItemUpdateInput as CartItemUpdateInputMagento,
} from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { updateCartItemsMutation } from "@framework/utils/graphql/cart";

type UpdateCartItemsOption = {
  cartId: string;
  cartItems: CartItem[];
};

type UpdateCartItemsMutationOption = {
  cartId: string;
  cartItems: CartItemUpdateInputMagento[];
};

type UpdateCartItemsMagentoResponse = {
  updateCartItems: {
    cart: CartMagento;
  };
};

const updateCartItems = async (
  apiConfig: ApiConfig,
  variables: UpdateCartItemsOption
): Promise<Cart> => {
  const vars: UpdateCartItemsMutationOption = {
    cartId: variables.cartId,
    cartItems: variables.cartItems.map((i) => ({
      cart_item_id: Number(i.id),
      quantity: i.quantity,
    })),
  };

  try {
    const cart = await apiConfig.fetch<UpdateCartItemsMagentoResponse>({
      query: updateCartItemsMutation,
      variables: vars,
      token: apiConfig.token,
    });
  
    return normalizeCart(cart.data.updateCartItems.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default updateCartItems;
