import { cartFields } from "../shared";

const getCustomerCartQuery = `
  query customerCart {
    customerCart {
      ${cartFields}
    }
  }
`;

export default getCustomerCartQuery;
