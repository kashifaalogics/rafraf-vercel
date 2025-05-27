const loginMutation = `
  mutation login($email: String!, $password: String!) {
    generateCustomerToken(email: $email, password: $password) {
      token
    }
  }
`;

export default loginMutation;
