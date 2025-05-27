import React, { useEffect, useState } from "react";
import { useCartItems } from "@common/hooks";
import { Label } from "@components/typography";
import useLangDirection from "@utils/language/useLangDirection";
import paymentLabel from "constants/payment-labels";
import { API_URL } from "@framework/const";

interface Props {
  cartV2: any;
}

function AvaliblePaymentMethods({ cartV2 }: Props) {
  const { cart, setPaymentMethodOnCart } = useCartItems();
  const { rtl } = useLangDirection();
  const [availablePaymentMethods, setAvailablePaymentMethods]: any = useState();

  useEffect(() => {
    if (!cartV2) return;
    const methods = cartV2.cart.available_payment_methods;
    const filteredMethods = methods.filter(
      (method: any) =>
        method.code !== "checkmo" && method.code !== "banktransfer"
    );
    setAvailablePaymentMethods(filteredMethods);
  }, [cartV2]);
  return (
    <div className="flex flex-col gap-3" dir={rtl ? "rtl" : "ltr"}>
      {availablePaymentMethods
        ? availablePaymentMethods.map((p: any) => (
            <div
              className="flex md:flex-row flex-col gap-4 justify-between mx-3 md:mx-9"
              key={p.code}
            >
              <Label className="text-base flex align-baseline font-normal">
                <input
                  type="radio"
                  name="paymentMethod"
                  className={rtl ? "ml-4" : "mr-4"}
                  onChange={() => setPaymentMethodOnCart(p.code)}
                />
                <div className="flex align-baseline">
                  <p className="my-auto">{paymentLabel(rtl, p.code)}</p>{" "}
                </div>{" "}
                {p.code === "moyasar_apple_pay" ? (
                  <img
                    src="../images/brands/apple-pay.svg"
                    className="h-6 md:h-4 px-4"
                    alt=""
                  />
                ) : (
                  ""
                )}
              </Label>

              {p.title === "Credit Card: Mada, Visa, MasterCard" ? (
                <div className="flex gap-3">
                  <img
                    src="../images/brands/master-card.svg"
                    alt=""
                    className="w-12"
                  />
                  <img
                    src="../images/brands/visa.svg"
                    alt=""
                    className="w-12"
                  />
                  <img
                    src="../images/brands/mada.svg"
                    alt=""
                    className="w-12"
                  />
                </div>
              ) : p.title === "Apple Pay" ? (
                <></>
              ) : (
                ""
              )}
            </div>
          ))
        : null}
    </div>
  );
}

export default AvaliblePaymentMethods;
