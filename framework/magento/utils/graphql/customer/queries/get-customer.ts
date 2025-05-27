import { customerFields } from "../shared";

const getCustomerQuery = `
  query getCustomerData {
    customer {
      ${customerFields}
    }
  }
`;

export default getCustomerQuery;
