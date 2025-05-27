const getCategoriesQuery = `query getCategories($parent: String!) {
  categories(filters: {ids: {eq: $parent}}) {
    items {
      name
      id
      children {
        name
        id
        level
        include_in_menu
        canonical_url
        url_path
        meta_title
        meta_keywords
        meta_description
      }
    }
  }
}`;

export default getCategoriesQuery;
