import { ApiConfig } from "@common/types/api";
import { Cart, CartItem } from "@common/types/cart";
import {
  Cart as CartMagento,
  CartItemInput as CartItemInputMagento,
} from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { addItemsToCartMutation } from "@framework/utils/graphql/cart";
import TagManager from "react-gtm-module";

type AddToCartOption = {
  cartId: string;
  cartItems: CartItem[];
};

type AddToCartOptionMagento = {
  cartId: string;
  cartItems: CartItemInputMagento[];
};

type AddToCartMagentoResponse = {
  addProductsToCart: {
    cart: CartMagento;
  };
};

const addItemsToCart = async (
  apiConfig: ApiConfig,
  variables: AddToCartOption
): Promise<Cart> => {
  const vars: AddToCartOptionMagento = {
    cartId: variables.cartId,
    cartItems: variables.cartItems.map((it) => {
      if (!it.product.variants?.length)
        throw new Error("please provide product vendor");

      return {
        quantity: it.quantity,
        sku: it.product.sku,
        entered_options: [
          {
            uid: "176",
            value:
              it.product.variants[0].attributes.find(
                (v) => v.code === "vendor_store"
              )?.value || "",
          },
        ],
        selected_options: [
          it.product.variants[0].attributes.find(
            (v) => v.code === "vendor_store"
          )?.uid || "",
        ],
      };
    }),
  };

  try {
    const cart = await apiConfig.fetch<AddToCartMagentoResponse>({
      query: addItemsToCartMutation,
      variables: vars,
      token: apiConfig.token,
    });

    TagManager.dataLayer({
      dataLayer: {
        event: "add_to_cart",
        cart: cart,
      },
    });
  
    return normalizeCart(cart.data.addProductsToCart.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }
};

export default addItemsToCart;
