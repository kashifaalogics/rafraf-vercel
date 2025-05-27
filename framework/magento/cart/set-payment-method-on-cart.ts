import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as MagentoCart } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { setPaymentMethodOnCartMutation } from "@framework/utils/graphql/cart";

type SetPaymentMethodOnCartResponse = {
  setPaymentMethodOnCart: {
    cart: MagentoCart;
  };
};

type SetPaymentMethodOnCartInput = {
  cartId: string;
  paymentMethod: string;
};

const setShippingAddressOnCart = async (
  apiConfig: ApiConfig,
  variables: SetPaymentMethodOnCartInput
): Promise<Cart> => {
  try {
    const cart = await apiConfig.fetch<SetPaymentMethodOnCartResponse>({
      query: setPaymentMethodOnCartMutation,
      token: apiConfig.token || localStorage.getItem("TOKEN"),
      variables,
    });
    return normalizeCart(cart.data.setPaymentMethodOnCart.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default setShippingAddressOnCart;
