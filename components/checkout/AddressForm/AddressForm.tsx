import { useAuth, useCartItems } from "@common/hooks";
import { rafrafToast } from "@common/utils/feedback";
import { isValidEmail, isValidPhone } from "@common/utils/validation";
import { Label } from "@components/typography";
import { Button, Input, Loading, Select } from "@components/ui";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import { Router, useRouter } from "next/router";
import { useSearchEngine, useCustomer } from "@common/hooks";
import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { SelectShippingMethod } from "..";
import { checkCustomerEmail } from "@framework/customer";
import { getConfig } from "@framework/api/config";

interface Props {
  updateFormValidity?: (b: boolean) => void;
}

const AddressForm: FunctionComponent<Props> = ({
  updateFormValidity = () => {},
}) => {
  const jeddahFreeShipping = false;

  const { t } = useTranslation();
  const { locale, ...router } = useRouter();
  const { loggedIn, loggingIn, login } = useAuth();
  const { openModal } = useUI();
  const {
    cart,
    cartItems,
    address,
    countries,
    countryStates,
    setShippingAddressOnCart,
    setShippingAddressesOnCartLoading,
    setGuestEmailOnCart,
    setGuestEmailOnCartLoading,
    setShippingMethodOnCart,
    setShippingMethodOnCartLoading,
    address: shippingAddress,
  } = useCartItems();

  const { recordAnalytic, searchCookie, recordAPI } = useSearchEngine();
  const { customer } = useCustomer();
  const [guestEmail, setGuestEmail] = useState(cart.email || "");
  const [emailExist, setEmailExist] = useState(false);

  const [firstname, setFirstname] = useState(address?.firstname || "");
  const [lastname, setLastname] = useState(address?.lastname || "");
  const [street, setStreet] = useState(address?.street || "");
  const [telephone, setTelephone] = useState(address?.telephone || "");
  const [city, setCity] = useState("");
  const [shippingMethod, setShippingMethod] = useState(false);
  const [validShippingForm, setValidShippingForm] = useState(false);
  const [active, setActive] = useState({ flag: false, count: 0 });
  const [submitBtn, setSubmitBtn] = useState(false);
  const [dirtyBit, setDirtyBit] = useState(false);
  const [wrongInput, setWrongInput] = useState(false);
  const [loginEmail, setLoginEmail] = useState({ value: "", valid: false });
  const [password, setPassword] = useState({ value: "", valid: false });

  useEffect(() => {
    setGuestEmail(cart.email || "");
  }, [cart.email]);

  useEffect(() => {
    if (!isValidEmail(loginEmail.value) || !loginEmail.value) {
      setEmailExist(false);
      return;
    }

    const config = getConfig({ locale: "ar" });
    const checkEmail = async () => {
      const res = await checkCustomerEmail(config, { email: loginEmail.value });
      const data = await res;
      setEmailExist(Boolean(!data.data.isEmailAvailable.is_email_available));
    };
    checkEmail();
  }, [loginEmail]);

  useEffect(() => {
    const isValid =
      Boolean(!emailExist || loggedIn) &&
      Boolean(firstname) &&
      Boolean(lastname) &&
      Boolean(street) &&
      Boolean(telephone) &&
      isValidPhone(telephone) &&
      Boolean(city) &&
      countryStates.map((c) => c.code).includes(city) &&
      ((!loggedIn && Boolean(guestEmail) && isValidEmail(guestEmail)) ||
        loggedIn) &&
      (Boolean(shippingAddress?.availableShippingMethods)
        ? Boolean(shippingAddress?.selectedShippingMethod?.carrierCode)
        : true);
    setValidShippingForm(isValid);
    updateFormValidity(submitBtn && dirtyBit);
  }, [
    emailExist,
    shippingMethod,
    dirtyBit,
    firstname,
    lastname,
    street,
    telephone,
    city,
    guestEmail,
    shippingAddress,
    shippingAddress?.selectedShippingMethod,
    shippingAddress?.selectedShippingMethod?.carrierCode,
  ]);

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validShippingForm) return;
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
    rafrafToast(t("common:saved"));
  };

  const validForm = useMemo<boolean>(
    () =>
      loginEmail.valid &&
      Boolean(loginEmail.value) &&
      password.valid &&
      Boolean(password.value),
    [loginEmail, password]
  );

  const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validForm) return;
    await login({ email: loginEmail.value, password: password.value });
    if (!loggedIn) {
      setWrongInput(true);
    } else {
      setEmailExist(false);
    }
  };

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
  // Send the purchase event to Google Analytics 4
  const handlePurchaseClick = () => {
    gtag("event", "purchase", {
      transaction_id: router.query.orderId,
      value: cart.prices?.grandTotal?.value.toFixed(2),
      tax: (
        (cart.prices?.subtotalIncludingTax?.value || 0) -
        (cart.prices?.subtotalExcludingTax?.value || 0)
      ).toFixed(2),
      shipping: address?.selectedShippingMethod?.amount?.value.toFixed(0),
      currency: "SAR",
      item_id: cart.items?.[0].product.id,
      coupon: cart.appliedCoupons,
      items: [
        {
          item_id: cart.items?.[0].product.sku,
          item_name: cart.items?.[0].product.name,
          value: cart.prices?.grandTotal?.value.toFixed(2),
          tax: (
            (cart.prices?.subtotalIncludingTax?.value || 0) -
            (cart.prices?.subtotalExcludingTax?.value || 0)
          ).toFixed(2),
          shipping: address?.selectedShippingMethod?.amount?.value.toFixed(2),
          currency: "SAR",
          coupon: cart.appliedCoupons,
          price: cart.prices?.grandTotal?.value.toFixed(0),
          quantity: 1,
        },
      ],
    });
  };

  return (
    <>
      {!loggedIn ? (
        <>
          <form onSubmit={submitLogin} className="col-span-2 mx-3 md:mx-9">
            <Input
              label={t("common/account:email")}
              id="guestEmail"
              errorMessage={t("common/account:emailError")}
              type="text"
              name="email"
              placeholder="example@email.com"
              onValueChange={(e) => {
                e.value && setGuestEmail(e.value);
                e.value && setGuestEmailOnCart(e.value);
                setLoginEmail(e);
                setDirtyBit(false);
              }}
              validationFunction={isValidEmail}
              containerClass={`col-span-2 ${!emailExist ? "mb-4" : ""}`}
            />
            {emailExist ? (
              <>
                <Input
                  label={t("checkout:deliveryForm.password")}
                  id="password"
                  type="password"
                  name="password"
                  placeholder="********"
                  onValueChange={(v) => {
                    setPassword(v);
                  }}
                />

                <div className="w-full m-2 col-span-2">
                  <div>
                    <Label className="text-red">
                      {wrongInput
                        ? t("checkout:deliveryForm.passwordCheck")
                        : ""}
                    </Label>
                  </div>
                  <Label>{t("checkout:deliveryForm.existEmailNote")}</Label>
                </div>

                <Button
                  type="submit"
                  color="blue"
                  className="w-full p-4 col-span-2 mb-4"
                  disabled={!validForm}
                  loading={loggingIn}
                >
                  {t("common:signIn")}
                </Button>
              </>
            ) : (
              <div className="col-span-2"></div>
            )}
          </form>
        </>
      ) : (
        <div className="col-span-2"></div>
      )}

      <div className={`col-span-2 ${!loggedIn ? "" : "mt-7"}`}></div>
      <form
        className="grid grid-cols-2 mx-3 md:mx-9 gap-4"
        onSubmit={handleFormSubmit}
      >
        <Input
          label={t("checkout:deliveryForm.firstname")}
          id="deliveryFirstName"
          type="text"
          name="deliveryFirstName"
          placeholder={t("checkout:deliveryForm.firstname")}
          onValueChange={(v) => {
            setFirstname(v.value);
            setDirtyBit(false);
          }}
        />

        <Input
          label={t("checkout:deliveryForm.lastname")}
          id="deliveryLastName"
          type="text"
          name="deliveryLastName"
          placeholder={t("checkout:deliveryForm.lastname")}
          onValueChange={(v) => {
            v.value && setLastname(v.value);
            setDirtyBit(false);
          }}
        />

        <Input
          label={t("checkout:deliveryForm.streetAddress")}
          id="deliveryStreetAddress"
          type="text"
          name="deliveryStreetAddress"
          placeholder={t("checkout:deliveryForm.streetAddress")}
          onValueChange={(v) => {
            v.value && setStreet(v.value);
            setDirtyBit(false);
          }}
          containerClass="col-span-2"
        />

        <Input
          label={t("checkout:deliveryForm.phoneNumber")}
          id="deliveryPhoneNumber"
          type="text"
          name="deliveryPhoneNumber"
          placeholder={t("checkout:deliveryForm.phoneNumber")}
          onValueChange={(v) => {
            v.value && setTelephone(v.value);
            setDirtyBit(false);
          }}
          validationFunction={isValidPhone}
          errorMessage={t("common/account:phoneError")}
        />

        <Select
          label={t("checkout:deliveryForm.city")}
          name="state"
          placeholder={city || ""}
          options={countryStates.map((c) => ({
            label: locale === "ar" ? c.name : c.code,
            value: c.code,
          }))}
          selectRef={null}
          onChange={(v) => {
            setCity(v || "");
            setDirtyBit(false);
            setShippingAddressOnCart({
              city: v || "",
              country_code: "SA",
              firstname: firstname || "firstname_demo",
              lastname: lastname || "lastname_demo",
              postcode: "",
              street: street || "street",
              telephone: telephone || "telephone",
            });
          }}
          disabled={false}
        />
        {setShippingAddressesOnCartLoading || setShippingMethodOnCartLoading ? (
          <div className="flex justify-center items-center my-3">
            <Loading />
          </div>
        ) : city ? (
          <div className="flex flex-col my-4 col-span-2">
            <Label>{t("checkout:deliveryForm.shippingMethod")}</Label>
            {shippingAddress?.availableShippingMethods
              ?.filter((m) =>
                m.methodCode !== "freeshipping" ||
                (shippingAddress.city === "Jeddah" &&
                  m.methodCode === "freeshipping" &&
                  jeddahFreeShipping)
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
                      handleShippingMethodUpdate(
                        m.carrierCode || "",
                        m.methodCode || ""
                      );
                    }}
                    checked={true}
                  />
                  {m.methodTitle} {m.carrierTitle} ({m.amount?.value}{" "}
                  {m.amount?.currencyCode})
                </Label>
              ))}
          </div>
        ) : (
          <></>
        )}

        <Button
          className="w-full p-4 col-span-2"
          onClick={() => {
            // recordAPI({behaviour: "saveinfo", source: "checkout"})
            {
              handlePurchaseClick;
            }
            setActive({ flag: true, count: active.count + 1 });
            setSubmitBtn(true);
            setDirtyBit(true);
            openModal(<SelectShippingMethod />);
          }}
          loading={
            setShippingAddressesOnCartLoading || setGuestEmailOnCartLoading
          }
          disabled={!validShippingForm}
          type="submit"
        >
          {locale === "ar" ? "حفظ" : "save"}
        </Button>
      </form>
    </>
  );
};

export default AddressForm;
