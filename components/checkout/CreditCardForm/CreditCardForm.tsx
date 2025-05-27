import { useAuth, useCartItems, usePayment } from "@common/hooks";
import {
  isValidCreditCardNumber,
  isValidCvv,
  isValidMonth,
  isValidYear,
} from "@common/utils/validation";
import { Button, Input } from "@components/ui";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import {
  FormEvent,
  FunctionComponent,
  useEffect,
  useState,
  useRef,
} from "react";
import { Label } from "@components/typography";
import { SelectShippingMethod } from "..";
import { CreditCardFormValidation } from "@common/utils/validation";
import { Product } from "@common/types/product";
import produce from "immer";
import TagManager from "react-gtm-module";
interface Props {
  onWishListed?: (p: Product) => void;
  onBuyNow?: (p: Product) => void;
  onAddToCart?: (p: Product) => void;
  submittionDisabled?: boolean;
  city: string;
  firstname: string;
  lastname: string;
  street: string;
  telephone: string;
  validShippingForm: boolean;
  guestEmail: string;
}

const CreditCardForm: FunctionComponent<Props> = ({
  submittionDisabled = false,
  city,
  firstname,
  lastname,
  street,
  telephone,
  validShippingForm,
  guestEmail,
}) => {
  const { t } = useTranslation();
  const { locale, ...router } = useRouter();
  const {
    cart,
    cartItems,
    address,
    setShippingAddressOnCart,
    setGuestEmailOnCart,
  } = useCartItems();
  const { createCreditCardPayment } = usePayment();
  const { loggedIn, token } = useAuth();
  const { openModal } = useUI();

  const [name, setName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [styledCardNumber, setStyledCardNumber] = useState("");
  const [cvv, setCvv] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [loading, setLoading] = useState(false);

  const validCreditCardForm = CreditCardFormValidation({
    name: name,
    cardNumber: cardNumber,
    cvv: cvv,
    month: month,
    year: year,
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validCreditCardForm || !validShippingForm) return;
    const promises = [];
    const p1 = setShippingAddressOnCart({
      city,
      country_code: "SA",
      firstname,
      lastname,
      street,
      telephone,
    });
    promises.push(p1);
    if (!loggedIn) {
      const p2 = setGuestEmailOnCart(guestEmail);
      promises.push(p2);
    }
    const _ = await Promise.all(promises);

    if (!address?.selectedShippingMethod) {
      openModal(<SelectShippingMethod />);
    }

    const amount = cart.prices?.grandTotal?.value;
    const cartId = cart.id;
    if (!amount || !cartId) return;

    try {
      setLoading(true);
      TagManager.dataLayer({
        dataLayer: {
          event: "add_payment_info",
          payment_type: "credit_card",
          cart_id: cartId,
          amount: amount
        },
      });
      const transaction_url = await createCreditCardPayment({
        amount,
        cartId,
        cvc: cvv,
        loggedIn,
        month,
        name,
        number: cardNumber,
        year: "20".concat(year),
        token: token || undefined,
      });
      window.location.href = transaction_url;
    } catch (e) {
      TagManager.dataLayer({
        dataLayer: {
          event: "payment_failed",
          method: "Credit Card",
          status: "حدث خطأ أثناء الدفع، يرجى التاكد من رقم البطاقه",
          amount: amount,
          currency: "SAR",
          item_id: cart.items?.[0].product.id,
          coupon: cart.appliedCoupons,
        },
      });
      openModal(
        <div className="p-3 text-lg text-red">
          {locale === "ar"
            ? `حدث خطأ أثناء الدفع، يرجى التاكد من رقم البطاقه`
            : `some error occured during payment, please make sure you're using a valid card`}
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  const handelStyledCardNumber = (value: string) => {
    return value.replace(/(\d{4}(?!\s))/g, "$1 ").trim();
  };

  useEffect(() => {
    setStyledCardNumber(handelStyledCardNumber(cardNumber));
  }, [cardNumber]);

  // Send the purchase event to Google Analytics 4
  // const handlePurchaseClick = () => {
  //   gtag("event", "purchase", {
  //     transaction_id: router.query.orderId,
  //     value: cart.prices?.grandTotal?.value.toFixed(2),
  //     tax: (
  //       (cart.prices?.subtotalIncludingTax?.value || 0) -
  //       (cart.prices?.subtotalExcludingTax?.value || 0)
  //     ).toFixed(2),
  //     shipping: address?.selectedShippingMethod?.amount?.value.toFixed(0),
  //     currency: "SAR",
  //     item_id: cart.items?.[0].product.id,
  //     coupon: cart.appliedCoupons,
  //     items: [
  //       {
  //         item_id: cart.items?.[0].product.sku,
  //         item_name: cart.items?.[0].product.name,
  //         value: cart.prices?.grandTotal?.value.toFixed(2),
  //         tax: (
  //           (cart.prices?.subtotalIncludingTax?.value || 0) -
  //           (cart.prices?.subtotalExcludingTax?.value || 0)
  //         ).toFixed(2),
  //         shipping: address?.selectedShippingMethod?.amount?.value.toFixed(2),
  //         currency: "SAR",
  //         coupon: cart.appliedCoupons,
  //         price: cart.prices?.grandTotal?.value.toFixed(0),
  //         quantity: 1,
  //       },
  //     ],
  //   });
  // };

  return (
    <form
      className="grid grid-cols-4 mx-3 md:mx-9 gap-4"
      onSubmit={handleSubmit}
    >
      <Input
        label={t("checkout:crediCardForm.name")}
        id="creditCardName"
        type="text"
        name="creditCardName"
        placeholder={t("checkout:crediCardForm.name")}
        onValueChange={(v) => setName(v.value.toLocaleUpperCase())}
        containerClass="col-span-4"
      />
      <Input
        label={t("checkout:crediCardForm.cardNumber")}
        id="creditCardNumber"
        type="text"
        name="creditCardNumber"
        placeholder={"**** **** **** ****"}
        dir="ltr"
        onValueChange={(v) => setCardNumber(v.value)}
        validationFunction={isValidCreditCardNumber}
        errorMessage={t("checkout:crediCardForm.cardNumberError")}
        containerClass="col-span-4"
      />
      <div
        className={`flex ${
          locale === "ar" ? "" : "flex-row-reverse"
        }  col-span-2`}
      >
        <Input
          label={t("checkout:crediCardForm.year")}
          id="creditCardYear"
          type="text"
          name="creditCardYear"
          placeholder={"YY"}
          onValueChange={(v) => setYear(v.value)}
          validationFunction={isValidYear}
          errorMessage={t("checkout:crediCardForm.yearError")}
          className={`w-full border-t-2  border-b-2 rounded-r border-r-2 px-0 py-3 text-center outline-none border-darkgrey
            }`}
        />

        <div className="input-wrapper">
          <Label className="my-2 text-white" htmlFor="seperator">
            .
          </Label>
          <input
            autoFocus
            type="text"
            id="seperator"
            name="seperator"
            placeholder="/"
            disabled={true}
            className={`w-full border-t-2 border-b-2 border-darkgrey outline-none px-0 py-3 text-center bg-white
            }`}
          />
        </div>

        <Input
          label={t("checkout:crediCardForm.month")}
          id="creditCardMonth"
          type="text"
          name="creditCardMonth"
          placeholder={"MM"}
          onValueChange={(v) => setMonth(v.value)}
          validationFunction={isValidMonth}
          errorMessage={t("checkout:crediCardForm.monthError")}
          className={`w-full border-t-2  border-b-2 rounded-l border-l-2  px-0 py-3 text-center outline-none border-darkgrey
          }`}
        />
      </div>
      <Input
        label={t("checkout:crediCardForm.cvv")}
        id="creditCardCVV"
        type="text"
        name="creditCardCVV"
        placeholder={t("checkout:crediCardForm.cvv")}
        onValueChange={(v) => setCvv(v.value)}
        validationFunction={isValidCvv}
        errorMessage={t("checkout:crediCardForm.cvvError")}
        containerClass="col-span-2"
      />

      <Button
        // Create payment
        style={{ backgroundColor: "#1D4ED8" }}
        className="col-span-4 w-full py-4"
        type="submit"
        disabled={!validCreditCardForm}
        // onClick={handlePurchaseClick}
        // onClick={()=> recordAPI({behaviour: "pay", source: "checkout"})}
      >
        {locale === "ar" ? "إتمام الدفع" : "pay"}
      </Button>
    </form>
  );
};

export default CreditCardForm;
