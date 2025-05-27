import { useCartItems } from "@common/hooks";
import { rafrafToast } from "@common/utils/feedback";
import { Label } from "@components/typography";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import { FunctionComponent, useCallback } from "react";
import {
  useEffect,
  useState,
} from "react";
interface Props {}

const SelectShippingMethod: FunctionComponent<Props> = (props) => {
  const jeddahFreeShipping = false

  const { t } = useTranslation();
  const [ freeshipping, setFreeshipping ] = useState(false);
  const { cart } = useCartItems();
  const {
    address: shippingAddress,
    setShippingMethodOnCart,
    setShippingMethodOnCartLoading,
  } = useCartItems();
  const { closeModal } = useUI();
  const handleShippingMethodUpdate = useCallback(
    async (carrierCode: string, methodCode: string) => {
      if (!methodCode || !carrierCode) return;
      await setShippingMethodOnCart({
        methodCode,
        carrierCode,
      });
      closeModal();
      rafrafToast(t("common:saved"));
    },
    [setShippingMethodOnCart]
  );

  return (
    <div className="flex flex-col my-4">
      {shippingAddress?.availableShippingMethods
        ?.filter((m) =>
          (m.methodCode !== "freeshipping") ||
          (shippingAddress.city === "Jeddah" && m.methodCode === "freeshipping" && jeddahFreeShipping)
            ? true
            : false
        )
        ?.map((m) => (
          <Label
            className="text-base my-2"
            key={(m.carrierCode || "") + (m.methodCode || "")}
          >
            <input
              type="radio"
              name="selectedShippingMethod"
              disabled={setShippingMethodOnCartLoading}
              className="mx-2"
              onChange={(e) => {
                if (e.target.value === "on") {
                  handleShippingMethodUpdate(
                    m.carrierCode || "",
                    m.methodCode || ""
                  );
                }
              }}
            />
            {m.methodTitle} {m.carrierTitle} ({m.amount?.value.toFixed(2)}{" "}
            {m.amount?.currencyCode})
          </Label>
        ))}
    </div>
  );
};

export default SelectShippingMethod;
