import { cartFields } from "../shared";

const removeCouponMutation = `
  mutation removeCoupon($cartId: String!) {
    removeCouponFromCart(input: {
      cart_id: $cartId
    }) {
      cart {
        ${cartFields}
      }
    }
  }
`;

export default removeCouponMutation;
