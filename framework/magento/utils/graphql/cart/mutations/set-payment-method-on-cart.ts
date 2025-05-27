import { cartFields } from "../shared";

const setPaymentMethodOnCartMutation = `
  mutation setPaymentMethod($cartId: String!, $paymentMethod: String!) {
    setPaymentMethodOnCart(input: {
      cart_id: $cartId,
      payment_method: {
        code: $paymentMethod
      }
    }) {
      cart {
        ${cartFields}
      }
    }
  }
`;

export default setPaymentMethodOnCartMutation;
