const requestResetPasswordMutation = `
  mutation requestResetPassword($email: String!) {
    requestPasswordResetEmail(
      email: $email
    )
  }
`;

export default requestResetPasswordMutation;
