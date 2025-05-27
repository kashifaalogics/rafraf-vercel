const resetPasswordMutation = `
  mutation resetPassword($email: String!, $token: String!, $newPassword: String!) {
    resetPassword(
      email: $email,
      resetPasswordToken: $token,
      newPassword: $newPassword
    )
  }
`;

export default resetPasswordMutation;
