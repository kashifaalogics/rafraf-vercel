const logoutMutation = `
  mutation logout {
    revokeCustomerToken {
      result
    }
  }
`;

export default logoutMutation;
