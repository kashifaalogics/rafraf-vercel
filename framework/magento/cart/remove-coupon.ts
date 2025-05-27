import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as MagentoCart } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { removeCouponMutation } from "@framework/utils/graphql/cart";

type RemoveCouponOnCartResponse = {
  removeCouponFromCart: {
    cart: MagentoCart;
  }
};

type RemoveCouponMutation = {
  cartId: string;
};

const removeCoupon = async (
  apiConfig: ApiConfig,
  variables: RemoveCouponMutation
): Promise<Cart> => {
  try {
    const cart = await apiConfig.fetch<RemoveCouponOnCartResponse>({
      query: removeCouponMutation,
      token: apiConfig.token,
      variables,
    });
    return normalizeCart(cart.data.removeCouponFromCart.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default removeCoupon;
