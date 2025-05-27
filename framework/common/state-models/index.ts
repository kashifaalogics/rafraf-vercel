import { Models } from "@rematch/core";
import { car } from "./car";
import { customer } from "./customer";
import { cart } from "./cart";
import { productListing } from "./product-listing";

export interface RootModel extends Models<RootModel> {
  car: typeof car;
  customer: typeof customer;
  cart: typeof cart;
  productListing: typeof productListing;
}

export const models: RootModel = {
  car,
  cart,
  customer,
  productListing,
};
