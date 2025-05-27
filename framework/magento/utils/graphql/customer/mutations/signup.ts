const signUpMutation = `
mutation signUp(
  $firstname: String!
  $lastname: String!
  $mobile_number: String!
  $email: String!
  $password: String!
) {
  createCustomerV2(
    input: {
      password: $password
      firstname: $firstname
      lastname: $lastname
      email: $email
      mobile_number: $mobile_number
    }
  ) {
    customer {
      lastname
    }
  }
}
`;

export default signUpMutation;
