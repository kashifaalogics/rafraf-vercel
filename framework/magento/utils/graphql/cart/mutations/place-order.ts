const placeOrderMutation = `
  mutation placeOrder($cartId: String!) {
    placeOrder(input: {cart_id: $cartId}) {
      order {
        order_number
      }
    }
  }
`;

export default placeOrderMutation;
