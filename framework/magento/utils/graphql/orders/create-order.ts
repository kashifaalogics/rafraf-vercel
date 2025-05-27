
const createOrder = `
mutation createOrder($cart_id: String!) {
    placeOrder(
      input: {
        cart_id: $cart_id
      }
    ) {
      order {
        order_number
      }
    }
  }
  
`;

export default createOrder;
