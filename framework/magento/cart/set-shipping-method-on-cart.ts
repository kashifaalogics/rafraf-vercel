import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as MagentoCart } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { setShippingMethodOnCartMutation } from "@framework/utils/graphql/cart";

type SetShippingMethodCartResponse = {
  setShippingMethodsOnCart: {
    cart: MagentoCart;
  };
};

type SetShippingMethodOnCartInput = {
  cartId: string;
  carrierCode: string;
  methodCode: string;
};

const setShippingMethodOnCart = async (
  apiConfig: ApiConfig,
  variables: SetShippingMethodOnCartInput
): Promise<Cart> => {
  try {
    const cart = await apiConfig.fetch<SetShippingMethodCartResponse>({
      query: setShippingMethodOnCartMutation,
      token: apiConfig.token || localStorage.getItem("TOKEN"),
      variables,
    });
    return normalizeCart(cart.data.setShippingMethodsOnCart.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default setShippingMethodOnCart;
