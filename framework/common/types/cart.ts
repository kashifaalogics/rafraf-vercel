import { Money, PaymentMethod } from "./payment";
import { Product } from "./product";
import { ShippingAddress, ShippingMethod } from "./shipping";

export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
}

export interface Cart {
  id?: string;
  email?: string;
  prices?: {
    subtotalWithDiscountExcludingTax?: Money;
    subtotalIncludingTax?: Money;
    subtotalExcludingTax?: Money;
    discount?: {
      amount?: Money;
      label?: string;
    }
    grandTotal?: Money;
  };
  total_quantity?: number;
  items?: CartItem[];
  totalCount?: number;
  availablePaymentMethods?: PaymentMethod[];
  selectedPaymentMethods?: PaymentMethod;
  shippingAddresses?: ShippingAddress[];
  appliedCoupons?: { code?: string }[];

}
