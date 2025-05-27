const checkCustomerEmailQuery = `
query checkCustomerEmail($email: String!) {
    isEmailAvailable(email: $email)
    {
      is_email_available
    }
  }
`;
export default checkCustomerEmailQuery;
