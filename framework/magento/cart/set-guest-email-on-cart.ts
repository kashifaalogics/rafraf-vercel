import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as MagentoCart } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { setGuestEmailOnCartMutation } from "@framework/utils/graphql/cart";

type SetGuestEmailOnCartResponse = {
  setGuestEmailOnCart: {
    cart: MagentoCart;
  };
};

type SetGuestEmailOnCartInput = {
  cartId: string;
  email: string;
};

const setGuestEmailOnCart = async (
  apiConfig: ApiConfig,
  variables: SetGuestEmailOnCartInput
): Promise<Cart> => {
  try {
    const cart = await apiConfig.fetch<SetGuestEmailOnCartResponse>({
      query: setGuestEmailOnCartMutation,
      token: apiConfig.token,
      variables,
    });
    return normalizeCart(cart.data.setGuestEmailOnCart.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default setGuestEmailOnCart;
