import { CurrencyEnum } from "@common/types/currency";
import { Money } from "@common/types/payment";
import { Money as MagentoMoney } from "@framework/schema";

export const normalizeMoney = (money: MagentoMoney): Money => {
  return {
    value: +(money.value || 0).toFixed(2),
    currencyCode: money.currency || CurrencyEnum.Sar,
  };
};
