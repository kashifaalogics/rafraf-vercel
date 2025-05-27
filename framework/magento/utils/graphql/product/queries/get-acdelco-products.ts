const getAcdelcoQuery = `
  query {
    products(filter:  {part_manufacturer_store: {eq: "864667"}},
            pageSize: 22) {
      items {
        url_key
        image {
          url
        }
        price_range {
          maximum_price {
            discount {
              amount_off
              percent_off
            }
            regular_price {
              currency
              value
            }
          }
        }
        id
        name
        sku
        __typename
      }
    }
    }
          `
    ;

export default getAcdelcoQuery;
