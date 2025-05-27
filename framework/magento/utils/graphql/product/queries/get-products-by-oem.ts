import { productItemFields } from "../shared";

const getProductsByOemQuery = `
  query getProductsByOem($oem: String!) {
    products(filter: { oem: { eq: $oem } }) {
      items {
        oem
        part_manufacturer_store
        ${productItemFields}
      }
    }
  }
`;

export default getProductsByOemQuery;
