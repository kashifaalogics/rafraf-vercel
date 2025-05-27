import { CurrencyEnum } from "./currency";

export interface Money {
  value: number;
  currencyCode: CurrencyEnum;
}

export interface PaymentMethod {
  code: string;
  title: string;
  purchaseOrderNumber?: string;
}
