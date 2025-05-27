import { cartFields } from "../shared";

const applyCouponMutation = `
  mutation applyCoupon($cartId: String!, $code: String!) {
    applyCouponToCart(input: {
      cart_id: $cartId,
      coupon_code: $code
    }) {
      cart {
        ${cartFields}
      }
    }
  }
`;

export default applyCouponMutation;
