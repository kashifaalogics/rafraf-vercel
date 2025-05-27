import { productItemFields } from "../../product/shared";

const cartFields = `
      email
      id
      shipping_addresses {
        country {
          code
        }
        city
        postcode
        firstname
        lastname
        telephone
        street
        available_shipping_methods {
          amount {
            currency
            value
          }
          carrier_code
          carrier_title
          method_code
          method_title
          price_excl_tax {
            currency
            value
          }
          price_incl_tax {
            currency
            value
          }
        }
        selected_shipping_method {
          amount {
            currency
            value
          }
          carrier_code
          carrier_title
          method_code
          method_title
        }
      }
      prices {
        subtotal_with_discount_excluding_tax {
          value
        }
        subtotal_including_tax {
          value
        }
        subtotal_excluding_tax {
          value
        }
        discounts {
          amount {
            currency
            value
          }
        }
        grand_total {
          currency
          value
        }
      }
      total_quantity
      available_payment_methods {
        code
        title
      }
      selected_payment_method {
        code
        title
        purchase_order_number
      }
      items {
        id
        quantity
        product {
          ${productItemFields}
        }
      }
      applied_coupons {
        code
      }
`;

export default cartFields;
