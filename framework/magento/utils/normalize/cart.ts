import { Cart, CartItem } from "@common/types/cart";
import { CurrencyEnum } from "@common/types/currency";
import { ShippingAddress, ShippingMethod } from "@common/types/shipping";
import {
  AvailableShippingMethod,
  Cart as MagentoCart,
  CartItemInterface as MagentoCartItem,
  SelectedShippingMethod,
  ShippingCartAddress,
} from "@framework/schema";
import { normalizeProduct } from ".";
import { normalizeMoney } from "./money";

export const normalizeCartItem = (
  magentoCartItem: MagentoCartItem
): CartItem => {
  let item: CartItem = {
    product: normalizeProduct(magentoCartItem.product),
    quantity: magentoCartItem.quantity,
  };

  if (magentoCartItem.id) {
    item.id = magentoCartItem.id;
  }

  return item;
};

export const normalizeShippingMethod = (
  method: AvailableShippingMethod | SelectedShippingMethod | null
): ShippingMethod => {
  if (!method) return {};
  return {
    carrierCode: method.carrier_code,
    carrierTitle: method.carrier_title,
    methodCode: method.method_code ?? "",
    methodTitle: method.method_title ?? "",
    amount: {
      currencyCode: method?.amount?.currency || CurrencyEnum.Sar,
      value: method?.amount?.value ? Number(method?.amount?.value) : 0,
    },
  };
};

export const normalizeShippingAddress = (
  address: ShippingCartAddress
): ShippingAddress => {

  return {
    availableShippingMethods: address.available_shipping_methods
      ?.filter((a) => Boolean(a))
      .map((a) => normalizeShippingMethod(a!)),
    city: address.city,
    country: address.country,
    company:
      address.company && address.company !== "null" ? address.company : "",
    firstname:
      address.firstname && address.firstname !== "null"
        ? address.firstname
        : "",
    lastname:
      address.lastname && address.lastname !== "null" ? address.lastname : "",
    postcode:
      address.postcode && address.postcode !== "null" ? address.postcode : "",
    street:
      address.street && address.street.length
        ? address.street.filter((s) => s !== "null").join(", ")
        : "",
    telephone:
      address.telephone && address.telephone !== "null"
        ? address.telephone
        : "",
    selectedShippingMethod: normalizeShippingMethod(
      address.selected_shipping_method || null
    ),
  };
};

export const normalizeCart = (magentoCart: MagentoCart): Cart => {
  let returned: Cart = {};

  if (magentoCart.id) {
    returned.id = magentoCart.id;
  }

  if (magentoCart.email) {
    returned.email = magentoCart.email;
  }

  if (magentoCart.items) {
    returned.items = magentoCart.items.reduce<CartItem[]>((items, item) => {
      if (item) {
        items.push(normalizeCartItem(item));
      }
      return items;
    }, []);
  }

  if (magentoCart.total_quantity) {
    returned.totalCount = magentoCart.total_quantity;
  }

  if (magentoCart.selected_payment_method) {
    returned.selectedPaymentMethods = {
      code: magentoCart.selected_payment_method.code,
      title: magentoCart.selected_payment_method.title,
      purchaseOrderNumber:
        magentoCart.selected_payment_method.purchase_order_number || undefined,
    };
  }

  if (
    magentoCart.available_payment_methods &&
    magentoCart.available_payment_methods.length
  ) {
    returned.availablePaymentMethods =
      magentoCart.available_payment_methods.map((m) => ({
        code: m?.code || "",
        title: m?.title || "",
      }));
  }

  if (magentoCart.prices?.subtotal_excluding_tax) {
    if (!returned.prices) {
      returned.prices = {};
    }
    returned.prices.subtotalExcludingTax = normalizeMoney(
      magentoCart.prices?.subtotal_excluding_tax
    );
  }

  if (magentoCart.prices?.subtotal_including_tax) {
    if (!returned.prices) {
      returned.prices = {};
    }
    returned.prices.subtotalIncludingTax = normalizeMoney(
      magentoCart.prices?.subtotal_including_tax
    );
  }

  if (magentoCart.prices?.subtotal_with_discount_excluding_tax) {
    if (!returned.prices) {
      returned.prices = {};
    }
    returned.prices.subtotalWithDiscountExcludingTax = normalizeMoney(
      magentoCart.prices?.subtotal_with_discount_excluding_tax
    );
  }
  
  if (magentoCart.prices?.discounts && magentoCart.prices?.discounts[0] && magentoCart.prices?.discounts[0]?.amount) {
    if (!returned.prices) {
      returned.prices = {};
    }
    if (!returned.prices.discount) {
      returned.prices.discount = {};
    }

    if (magentoCart.prices.discounts[0].label) {
      returned.prices.discount.label =
        magentoCart.prices.discounts[0].label[0] || undefined;
    }

    returned.prices.discount.amount = normalizeMoney(
      magentoCart.prices?.discounts[0].amount
    );
  }

  if (magentoCart.prices?.grand_total) {
    if (!returned.prices) {
      returned.prices = {};
    }
    returned.prices.grandTotal = normalizeMoney(
      magentoCart.prices?.grand_total
    );
  }

  if (magentoCart.applied_coupons) {
    if (!returned.appliedCoupons) {
      returned.appliedCoupons = [];
    }
    magentoCart.applied_coupons.forEach((c) =>
      returned.appliedCoupons?.push({ code: c?.code || "" })
    );
  }

  if (magentoCart.shipping_addresses) {
    if (!returned.shippingAddresses) {
      returned.shippingAddresses = [];
    }
    magentoCart.shipping_addresses.filter(Boolean).forEach((a) => {
      returned.shippingAddresses?.push(normalizeShippingAddress(a!));
    });
  }

  return returned;
};
