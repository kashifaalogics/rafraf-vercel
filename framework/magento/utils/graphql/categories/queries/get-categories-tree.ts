const getCategoriesTreeQuery = `
  query getCategories($parent: String) {
    categories(filters: { ids: { eq: $parent } }) {
      items {
        name
        id
        canonical_url
        url_path
        children {
          name
          id
          canonical_url
          url_path
          children {
            name
            id
            canonical_url
            url_path
          }
        }
      }
    }
  }
`;

export default getCategoriesTreeQuery;
