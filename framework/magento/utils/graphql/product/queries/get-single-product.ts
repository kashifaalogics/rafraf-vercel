const getSingleProductsQuery = `
  query getAllProducts ($filter:ProductAttributeFilterInput) {
    products(
      filter: $filter,
      pageSize: 1
    ) {
      items {
        sku
      }
    }
  }
`;

export default getSingleProductsQuery;
