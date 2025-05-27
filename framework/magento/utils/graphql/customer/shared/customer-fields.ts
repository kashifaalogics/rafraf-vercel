const customerFields = `
      firstname
      lastname
      mobile_number
      email
      orders {
        items {
          status
          number
          order_date
          items {
            product_name
            product_sku
            product_url_key
          }
          total {
            grand_total {
              currency
              value
            }
          }
        }
      }
      addresses {
        city
        firstname
        lastname
        telephone
        street
        default_shipping
      }
`;

export default customerFields;
