import { ApiConfig } from "@common/types/api";
import { Cart } from "@common/types/cart";
import { Cart as MagentoCart } from "@framework/schema";
import { normalizeCart } from "@framework/utils";
import { applyCouponMutation } from "@framework/utils/graphql/cart";
import TagManager from "react-gtm-module";

type ApplyCouponOnCartResponse = {
  applyCouponToCart: {
    cart: MagentoCart;
  };
};

type ApplyCouponInput = {
  code: string;
  cartId: string;
};

const applyCoupon = async (
  apiConfig: ApiConfig,
  variables: ApplyCouponInput
): Promise<Cart> => {
  try {
    const cart = await apiConfig.fetch<ApplyCouponOnCartResponse>({
      query: applyCouponMutation,
      token: apiConfig.token,
      variables,
    });
    TagManager.dataLayer({
      dataLayer: {
        event: "coupon_redemption",
        code: variables.code,
        redemption_result: cart.data.applyCouponToCart ? "Coupon Success" : "Coupon Failed: the coupon is expired or does not exist",
      }
    });
    return normalizeCart(cart.data.applyCouponToCart.cart);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default applyCoupon;
