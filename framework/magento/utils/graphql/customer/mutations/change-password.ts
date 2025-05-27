import { customerFields } from "../shared";

const changePasswordMutation = `
  mutation changePassword($currentPassword: String!, $newPassword: String!) {
    changeCustomerPassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      ${customerFields}
    }
  }
  
`;

export default changePasswordMutation;
