import { cartFields } from "../shared";

const getCartQuery = `
  query getCart($cartId: String!) {
    cart(cart_id: $cartId) {
      ${cartFields}
    }
  }
`;

export default getCartQuery;
