const updateCartItemsMutation = `
  mutation updateCartItems($cartId: String!, $cartItems: [CartItemUpdateInput]!) {
    updateCartItems(input: { cart_id: $cartId, cart_items: $cartItems }) {
      cart {
        id
        items {
          id
          quantity
          product {
            id
            sku
          }
        }
      }
    }
  }
  
`;

export default updateCartItemsMutation;
