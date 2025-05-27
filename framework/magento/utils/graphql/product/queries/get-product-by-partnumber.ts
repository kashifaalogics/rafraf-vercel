import { productItemFields } from "../shared";

const getProductByPartnumberQuery = `
  query getProductByPartnumber($sku: String!) {
    products(filter: { sku: { eq: $sku } }) {
      items {
        oem
        part_manufacturer_store
        categories {
          id
          name
          level
          path
        }
        meta_title
        meta_keyword
        meta_description
        ${productItemFields}
      }
    }
  }
`;

export default getProductByPartnumberQuery;
