import { getShippingPrice, useAuth, useCartItems } from "@common/hooks";
import { A, H4, Subtitle } from "@components/typography";
import { Image, Loading } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import { FunctionComponent, useCallback } from "react";

interface Props {
  cart: any;
  loading: boolean;
}

const OrderSummary: FunctionComponent<Props> = ({ cart, loading }: Props) => {
  const { t } = useTranslation();
  const { address, setShippingAddressOnCart, setShippingMethodOnCart } =
    useCartItems();
  const { loggedIn } = useAuth();
  // Define shippingAmount based on user login status
  let shippingAmount: string | undefined = loggedIn ? "0" : undefined;

  if (!loggedIn) {
    shippingAmount = address?.availableShippingMethods?.[1]
      ? address?.availableShippingMethods?.[1].amount?.value.toFixed(2)
      : address?.availableShippingMethods?.[0].amount?.value.toFixed(2);
  }

  const handleShippingMethodUpdate = useCallback(
    (carrierCode: string, methodCode: string) => {
      if (!methodCode || !carrierCode) return;
      setShippingMethodOnCart({
        methodCode,
        carrierCode,
      });
    },
    [setShippingMethodOnCart]
  );

  return (
    <div>
      {cart && !loading ? (
        <>
          <div className="flex justify-between items-baseline p-8 pb-0">
            <H4>{t("checkout:orderSummary.title")}</H4>
            <div className="text-sm">
              {t("checkout:orderSummary.count")}: {cart?.cart?.total_quantity}
            </div>
          </div>

          <div className="flex flex-col gap-6 my-4 px-8">
            {
              cart?.cart? cart.cart.items?.map((ci: any) => (
                <div key={ci.product.sku} className="flex gap-8">
                  <div
                    className="relative"
                    style={{ width: "135px", height: "135px" }}
                  >
                    <Image
                      src={`https://s3.me-south-1.amazonaws.com/images.rafraf.com/${ci.product.image.url}`}
                      layout="fill"
                      objectFit="scale-down"
                    />
                  </div>

                  <div className="flex flex-col justify-around mb-4">
                    <A target="_blank" href={ci.product.url_key}>
                      {ci.product.name}
                    </A>
                    <div>
                      {t("checkout:orderSummary.quantity")}: {ci.quantity}
                    </div>
                    <div className="font-bold">
                      {ci.product.price_range.maximum_price.final_price?.value.toFixed(
                        2
                      ) || ""}{" "}
                      {ci.product.price_range.maximum_price?.final_price
                        .currency || ""}
                    </div>
                  </div>
                </div>
              ))

              : t("checkout:orderSummary.noCart")
          }
          </div>
          <div className="border-t-2 py-3 px-8 text-sm flex justify-between">
            <div>{t("checkout:orderSummary.shipping")}: </div>
            <div>              
              {address?.selectedShippingMethod?.amount? 
                address?.selectedShippingMethod?.amount?.value: " "}{" "}

              {address?.selectedShippingMethod?.amount? 
                address?.selectedShippingMethod?.amount?.currencyCode: " "}
            </div>
          </div>
          <div className="border-t-2 py-6 px-8 text-lg flex justify-between">
            <div>{t("checkout:orderSummary.grandTotal")}: </div>
            <div className="font-bold">
              {(
                (cart?.cart?.prices?.grand_total?.value || 0)
              ).toFixed(2)}{" "}
              {cart?.cart?.prices?.grand_total?.currency || "SAR"}
              <Subtitle className="text-darkgrey">
                {t("checkout:orderSummary.vatInclusive")}
              </Subtitle>
            </div>
          </div>
        </>
      ) : <Loading />}
    </div>
  );
};

export default OrderSummary;
