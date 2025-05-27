import { Product } from "./product";

export interface WishlistItem {
  product: Product;
}

export interface Wishlist {
  items: WishlistItem[];
}
