const productItemFields = `
      stock_status
      id
      sku
      name
      part_manufacturer_store
      description {
        html
      }
      url_key
      image {
        label
        url
      }
      part_type_new
      price_range {
        maximum_price {
          final_price {
            currency
            value
          }
          discount {
            amount_off
          }
          fixed_product_taxes {
            amount {
              currency
              value
            }
            label
          }
          regular_price {
            currency
            value
          }
        }
        minimum_price {
          final_price {
            currency
            value
          }
          discount {
            amount_off
          }
          fixed_product_taxes {
            amount {
              currency
              value
            }
            label
          }
          regular_price {
            currency
            value
          }
        }
      }
      related_products {
        id
        name
        sku
        url_key
        __typename
      }  
      ... on ConfigurableProduct {
        variants {
          attributes {
            code
            uid
            value_index
            label
          }
        }
      }
      

`;

export default productItemFields;
