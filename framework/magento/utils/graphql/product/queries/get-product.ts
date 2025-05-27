import { productItemFields } from "../shared";

const getProductQuery = `
  query getProductBySlug($slug: String!) {
    products(filter: { url_key: { eq: $slug } }) {
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

export default getProductQuery;
