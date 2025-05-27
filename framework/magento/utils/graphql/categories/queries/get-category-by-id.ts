const getCategoryById = `
  query getCategoryIdByPath($id: String!) {
    categories(filters: { ids: { eq: $id } } ) {
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

export default getCategoryById;
