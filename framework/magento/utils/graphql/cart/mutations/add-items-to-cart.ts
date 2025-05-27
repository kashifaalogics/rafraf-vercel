const addItemsToCartMutation = `
  mutation addProductToCart($cartId: String!, $cartItems: [CartItemInput!]!) {
    addProductsToCart(cartId: $cartId, cartItems: $cartItems) {
      cart {
        applied_coupons {
          code
        }
        available_payment_methods {
          code
          title
        }
        id
        total_quantity
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
        items {
          id
          quantity
          product {
            id
            sku
          }
        }
      }
    }
  }
`;

export default addItemsToCartMutation;
