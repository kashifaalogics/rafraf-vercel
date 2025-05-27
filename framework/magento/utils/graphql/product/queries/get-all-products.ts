import { productItemFields } from "../shared";

const getAllProductsQuery = `
  query getAllProducts ($search: String, $filter:ProductAttributeFilterInput, $sort: ProductAttributeSortInput, $currentPage: Int) {
    products(
      search: $search,
      filter: $filter,
      sort: $sort,
      currentPage: $currentPage,
      pageSize: 50
    ) {
      page_info {
        current_page
        page_size
        total_pages
      }
      total_count
      items {
        ${productItemFields}
      }
    }
  }
`;

export default getAllProductsQuery;
