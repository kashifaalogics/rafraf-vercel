import { Money } from "./payment";

export interface ShippingMethod {
  carrierCode?: string;
  carrierTitle?: string;
  methodCode?: string;
  methodTitle?: string;
  amount?: Money;
}

export interface ShippingAddress {
  firstname?: string;
  lastname?: string;
  company?: string;
  street?: string;
  city?: string;
  region?: {
    code?: string;
    label?: string;
  };
  postcode?: string;
  telephone?: string;
  country?: {
    code?: string;
    label?: string;
  };
  availableShippingMethods?: ShippingMethod[];
  selectedShippingMethod?: ShippingMethod;
}
