import { cartFields } from "../shared";

const setShippingMethodOnCartMutation = `
  mutation setShippingAddressOnCart(
    $cartId: String!
    $address: CartAddressInput
  ) {
    setShippingAddressesOnCart(
      input: { cart_id: $cartId, shipping_addresses: [{ address: $address }] }
    ) {
      cart {
        ${cartFields}
      }
    }
    setBillingAddressOnCart(input: {
      cart_id: $cartId,
      billing_address: {
        address: $address
      }
    }) {
      cart {
        id
      }
    }
  }
`;

export default setShippingMethodOnCartMutation;
