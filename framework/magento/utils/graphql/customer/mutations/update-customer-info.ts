import { customerFields } from "../shared";

const updateCustomerInfoMutation = `
  mutation updateCustomerInfo($firstname: String!, $lastname: String!, $email: String! ,$mobile_number:String!) {
    updateCustomer(input: {
      firstname: $firstname,
      lastname: $lastname,
      email: $email
      mobile_number: $mobile_number
    }) {
      customer {
        ${customerFields}
      }
    }
  }
`;

export default updateCustomerInfoMutation;
