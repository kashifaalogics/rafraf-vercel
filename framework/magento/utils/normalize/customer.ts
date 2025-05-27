import { Customer, Order } from "@common/types/account";
import { Wishlist, WishlistItem } from "@common/types/wishlist";
import {
  Customer as MagentoCustomer,
  CustomerOrder as MagentoCustomerOrder,
  Wishlist as MagentoWishlist,
} from "@framework/schema";
import { normalizeProduct } from ".";

export const normalizeOrder = (magentoOrder: MagentoCustomerOrder): Order => {
  return {
    orderNumber: magentoOrder.number,
    date: magentoOrder.order_date,
    status: magentoOrder.status,
    total: {
      value: magentoOrder.total?.grand_total.value,
      currency: magentoOrder.total?.grand_total.currency,
    },
    items:
      magentoOrder.items?.map((moi) => ({
        productName: moi?.product_name || "",
        productSku: moi?.product_sku || "",
        productUrlKey: moi?.product_url_key || "",
      })) || [],
  };
};

export const normalizeCustomer = (
  magentoCustomer: MagentoCustomer
): Customer => {
  return {
    firstname: magentoCustomer.firstname || "",
    lastname: magentoCustomer.lastname || "",
    email: magentoCustomer.email || "",
    mobile_number: magentoCustomer.mobile_number || "",
    orders: magentoCustomer.orders?.items.reduce<Order[]>((acc, o) => {
      if (o) {
        acc.push(normalizeOrder(o));
      }
      return acc;
    }, []),
  };
};

export const normalizeWishlist = (
  magentoWishlist: MagentoWishlist
): Wishlist => {
  return {
    items:
      magentoWishlist.items?.reduce<WishlistItem[]>((acc, it) => {
        if (it && it.product) {
          acc.push({
            product: normalizeProduct(it.product),
          });
        }

        return acc;
      }, []) || [],
  };
};
