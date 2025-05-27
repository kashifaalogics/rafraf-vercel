import { Address } from "@common/types/address";
import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as MagentoCart, CartAddressInput } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { setShippingAddressesOnCartMutation } from "@framework/utils/graphql/cart";

type SetShippingAddressCartResponse = {
  setShippingAddressesOnCart: {
    cart: MagentoCart;
  };
};

type SetShippingAddressOnCartInput = {
  cartId: string;
  address: Address & {
    save_in_address_book?: boolean;
  };
};

const setShippingAddressOnCart = async (
  apiConfig: ApiConfig,
  variables: SetShippingAddressOnCartInput
): Promise<Cart> => {
  try {
    const cart = await apiConfig.fetch<SetShippingAddressCartResponse>({
      query: setShippingAddressesOnCartMutation,
      token: apiConfig.token || localStorage.getItem("TOKEN"),
      variables: {
        save_in_address_book: true,
        ...variables,
      },
    });
    return normalizeCart(cart.data.setShippingAddressesOnCart.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default setShippingAddressOnCart;
