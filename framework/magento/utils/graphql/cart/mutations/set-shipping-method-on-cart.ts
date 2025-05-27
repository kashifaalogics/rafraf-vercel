import { cartFields } from "../shared";

const setShippingMethodOnCartMutation = `
  mutation setShippingMethodsOnCart(
    $cartId: String!
    $carrierCode: String!
    $methodCode: String!
  ) {
    setShippingMethodsOnCart(
      input: {
        cart_id: $cartId
        shipping_methods: { carrier_code: $carrierCode, method_code: $methodCode }
      }
    ) {
      cart {
        ${cartFields}
      }
    }
  }
`;

export default setShippingMethodOnCartMutation;
