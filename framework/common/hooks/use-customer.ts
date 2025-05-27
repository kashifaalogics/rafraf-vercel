import { Dispatch, RootState } from "@common/store";
import { Customer, CustomerInfo } from "@common/types/account";
import { useDispatch, useSelector } from "react-redux";
import { singletonHook } from "react-singleton-hook";
import { useApiConfig } from ".";

export interface UseCustomerResult {
  customer: Customer | null;

  updateCustomerInfoLoading: boolean;
  updateCustomerInfo: (info: CustomerInfo) => Promise<void>;

  changePasswordLoading: boolean;
  changePassword: (creds: {
    newPassword: string;
    currentPassword: string;
  }) => Promise<void>;
}

const initialResult: UseCustomerResult = {
  customer: null,
  updateCustomerInfoLoading: false,
  updateCustomerInfo: async (args) => {},
  changePasswordLoading: false,
  changePassword: async (args) => {},
};

const useCustomer = (): UseCustomerResult => {
  const apiConfig = useApiConfig();
  const { customer } = useSelector((state: RootState) => state.customer);
  const {
    customer: { updateCustomerInfo, changePassword },
  } = useDispatch<Dispatch>();
  const {
    updateCustomerInfo: updateCustomerInfoLoading,
    changePassword: changePasswordLoading,
  } = useSelector((state: RootState) => state.loading.effects.customer);

  return {
    customer,
    updateCustomerInfoLoading,
    updateCustomerInfo: (info: CustomerInfo) =>
      updateCustomerInfo({ apiConfig, info }),
    changePasswordLoading,
    changePassword: ({ currentPassword, newPassword }) =>
      changePassword({ apiConfig, currentPassword, newPassword }),
  };
};

export default singletonHook(initialResult, useCustomer);
