
const createApplepayOrder = `
mutation createApplepayOrder($paymentid: String!, $orderid: String!){
    addApplePay( 
      input: {
        paymentid: $paymentid,
        orderid: $orderid,
        status: "yes"
      }
    ){ 
      message 
      }   
  }
`;

export default createApplepayOrder;