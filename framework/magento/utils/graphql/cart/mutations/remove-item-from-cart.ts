const removeItemFromCartMutation = `
  mutation removeItemFromCart($cartId: String!, $cartItemId: Int!) {
    removeItemFromCart(input: { cart_id: $cartId, cart_item_id: $cartItemId }) {
      cart {
        items {
          id
          product {
            sku
            id
          }
          quantity
        }
      }
    }
  }  
`;

export default removeItemFromCartMutation;
