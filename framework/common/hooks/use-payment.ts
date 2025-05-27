import { createPaymentCreditCard } from "@framework/payment";
import { singletonHook } from "react-singleton-hook";

export interface UsePaymentResult {
  createCreditCardPayment: typeof createPaymentCreditCard;
}

const initialResult: UsePaymentResult = {
  createCreditCardPayment: async (args) => "",
};

const usePayment = (): UsePaymentResult => {
  return {
    createCreditCardPayment: createPaymentCreditCard,
  };
};

export default singletonHook(initialResult, usePayment);
