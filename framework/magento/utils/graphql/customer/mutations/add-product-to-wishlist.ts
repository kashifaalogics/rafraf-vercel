const addProductToWishlistMutation = `
  mutation addProductToWishlist($sku: String!, $quantity: Float = 1) {
    addProductsToWishlist(wishlistId: 0, wishlistItems: [{
      sku: $sku,
      quantity: $quantity,
    }]) {
      wishlist {
        items {
          product {
            sku
          }
        }
      }
    }
  }
`;

export default addProductToWishlistMutation;
