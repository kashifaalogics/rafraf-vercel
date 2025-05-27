import { Money } from "@framework/schema";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegistrationCredentials {
  firstname: string;
  lastname: string;
  mobile_number: string;
  email: string;
  password: string;
}

export interface CustomerInfo {
  firstname: string;
  lastname: string;
  mobile_number: string;
  email: string;
}

export interface Customer {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  mobile_number?: string;
  orders?: Order[];
}

export interface OrderItem {
  productName: string;
  productSku: string;
  productUrlKey: string;
}

export interface Order {
 status: string;
 date: string;
 items: OrderItem[];
 total: Money;
 orderNumber: string;
}
