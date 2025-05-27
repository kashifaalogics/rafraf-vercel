const getCategoryByPath = `
  query getCategoryIdByPath($path: String!) {
    categories(filters: { url_path: { eq: $path } } ) {
      items {
        name
        id
        canonical_url
        url_path
        meta_title
        meta_keywords
        meta_description
        level
        include_in_menu
      }
    }
  }
`;

export default getCategoryByPath;
