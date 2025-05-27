import {
  useAuth,
  useCartItems,
  useApiConfig,
  usePayment,
  useCustomer,
} from "@common/hooks";
import { isValidEmail, isValidPhone } from "@common/utils/validation";
import { Label, H4 } from "@components/typography";
import { Button, Input, Loading, Select } from "@components/ui";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { CreditCardForm } from "..";
import ApplePayPayment from "../ApplePayPayment";
import { createOrder } from "@framework/orders";
import { API_URL, BASE_URL } from "@framework/const";
import {
  FormEvent,
  FunctionComponent,
  useCallback,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import { ApplePayAvalible } from "@common/utils/validation";
import AvaliblePaymentMethods from "../PaymentMethods/AvaliblePaymentMethods";
import { checkCustomerEmail } from "@framework/customer";
import { getConfig } from "@framework/api/config";
import { getShippingPrice } from "@common/hooks";
import { useStore } from "@common/state";
import Location from "@components/icons/Location";
import Verified from "@components/icons/verified";
import { rafrafToast } from "@common/utils/feedback";
import TagManager from "react-gtm-module";


interface Props {
  updateFormValidity?: (b: boolean) => void;
  submittionDisabled?: boolean;
  cartV2: any;
  loadingV2: boolean;
}

const CreditAddressForm: FunctionComponent<Props> = ({
  updateFormValidity = () => {},
  submittionDisabled = false,
  cartV2,
  loadingV2,
}) => {
  const jeddahFreeShipping = false;

  const { t } = useTranslation();
  const { locale, ...router } = useRouter();
  const { loggedIn, loggingIn, login, token } = useAuth();
  const {
    cart,
    cartItems,
    address,
    countryStates,
    setPaymentMethodOnCartLoading,
    setPaymentMethodOnCart,
    setShippingAddressOnCart,
    setShippingMethodOnCart,
    setShippingAddressesOnCartLoading,
    setGuestEmailOnCart,
    setShippingMethodOnCartLoading,
    address: shippingAddress,
  } = useCartItems();

  const [guestEmail, setGuestEmail] = useState(cart.email || "");
  const [emailExist, setEmailExist] = useState(false);
  const { customer } = useCustomer();
  const setToggleCartCall = useStore((state) => state.setToggleCartCall);


  const [firstname, setFirstname] = useState(address?.firstname || "");
  const [lastname, setLastname] = useState(address?.lastname || "");
  const [telephone, setTelephone] = useState(address?.telephone || "");
  const [street, setStreet] = useState(address?.street || "");
  const [addresses, setAddresses] = useState<any[]>([]);

  const [customerAddress, setCustomerAddress] = useState({
    addressId: null,
    street: "",
    telephone: "",
    city: "",
    country: "",
    postCode: "",
  });
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [city, setCity] = useState("");
  const [shippingMethod, setShippingMethod] = useState(false);
  const [validShippingForm, setValidShippingForm] = useState(false);
  const [submitBtn, setSubmitBtn] = useState(false);
  const [dirtyBit, setDirtyBit] = useState(false);
  const [wrongInput, setWrongInput] = useState(false);
  const [loginEmail, setLoginEmail] = useState({ value: "", valid: false });
  const [password, setPassword] = useState({ value: "", valid: false });
  const [check, setCheck] = useState(false);
  const [selectedShipping, setSelectedShipping] = useState("defaultMethodCode");
  const [prevCart, setPrevCart] = useState([{}]);
  const [loginLoading, setLoginLoading] = useState(false);
  const [verifiedAddress, setVerifiedAddress] = useState(null);
  const [isAddressModified, setIsAddressModified] = useState(false);
  const applePayAvailable = ApplePayAvalible()

  const isAddressValid = ({
    firstname,
    lastname,
    street,
    telephone,
  }: any) => {

    if(!firstname.length) {
      rafrafToast("Please fill firstname")
      return false
    } else if(!lastname.length) {
      rafrafToast("Please fill lastname")
      return false
    } else if(!street.length) {
      rafrafToast("Please fill street")
      return false
    } else if(!telephone.length) {
      rafrafToast("Please fill telephone")
      return false
    }
   if (!loggedIn) {
      if(!loginEmail.value.length) {
        rafrafToast("Please fill email")
        return false
      }
    }
    return true
  }
  
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

  // useEffect(() => {
  //   // if (loggedIn) {
  //   console.log("customer2:", customer)
  //     setFirstname(customer?.firstname || "");
  //     setLastname(customer?.lastname || "");
  //     console.log("setting:", address)
  //     setTelephone(customer?.mobile_number || "");
  //     setStreet(address?.street || "");
  //   // }
  // }, [loggedIn, address, customer]);

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

  
  useEffect(() => {
    console.log("customer:", customer)

    if(customer) {
      setShippingAddressOnCart({
        city: "Jeddah",
        country_code: "SA",
        firstname: customer?.firstname,
        lastname: customer?.lastname,
        postcode: "",
        street: "template_street",
        telephone: "template_telephone",
      })
    }

    if (JSON.stringify(cart) !== "{}") {

      // set template form to access Magento features
      setShippingAddressOnCart({
        city: "Jeddah",
        country_code: "SA",
        firstname: "template_firstname",
        lastname: "template_lastname",
        postcode: "",
        street: "template_street",
        telephone: "template_telephone",
      })

      // set default shipping method
      setShippingMethodOnCart({
        carrierCode: "freeshipping",
        methodCode: "freeshipping"
      })
      // set the dafault payment method
      if (applePayAvailable) {
        setPaymentMethodOnCart("moyasar_apple_pay")
      }
      else {
        setPaymentMethodOnCart("moyasar_credit_card")
      }
    }
  }, [customer]);

  // Address form submission
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  };

  const cashOnDeliverySubmit = async () => {
    setCheck(true);
    const cartId = cart.id;
    const orderNumber = await createOrder(apiConfig, { cart_id: cartId });
    if (orderNumber != null) {
      window.location.href = `${BASE_URL}/checkout/thank-you?orderId=${orderNumber}`;
    } else {
      window.location.href = `${BASE_URL}/checkout/failed`;
    }
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

    // Save old items
    setPrevCart(cartItems);
    const oldItems = cartItems;

    await login({ email: loginEmail.value, password: password.value });
    setLoginLoading(!loginLoading);

    if (!loggedIn) {
      setWrongInput(true);
    } else {
      setEmailExist(false);
      // Add items to existance cart
    }
  };

  const handleShippingMethodUpdate = useCallback(
    async (carrierCode: string, methodCode: string) => {
      setSelectedShipping(methodCode);
      if (!methodCode || !carrierCode) return;
      await setShippingMethodOnCart({
        methodCode,
        carrierCode,
      });
      setToggleCartCall();
      TagManager.dataLayer({
        dataLayer: {
          event: "add_shipping_info",
          methodCode,
          carrierCode,
        },
      });
    },
    [setSelectedShipping, setShippingMethodOnCart, setToggleCartCall]
  );

  const apiConfig = useApiConfig();
  const { price, title, loading, data } = getShippingPrice({
    city: city,
    cart: cart.id,
  });
  useEffect(() => {
    async function getAddress(locale: string) {
      try {
        var queryGet = `
      query getCustomerData{
        customer {
          addresses {
            id
            firstname
            lastname
            street
            city
            postcode
            country_code
            telephone
            default_shipping
            default_billing
          }
        }
      }
    `;

        const currentToken = localStorage.getItem("TOKEN") || JSON.parse(
          window.localStorage.getItem("CUSTOMER_STATE") || "{}"
        );
        const apiConfig = getConfig({ locale: "ar" });
        const res = await fetch(`${API_URL}/graphql`, {
          method: "POST",
          body: JSON.stringify({ query: queryGet, locale: apiConfig.locale }),

          // TODO
          headers: {
            "Content-Type": "application/json",
            Store: locale,
            ...(currentToken.token? {"Authorization" : `Bearer ${currentToken.token}`}: [])
          },
        });

        const data = await res.json();

        console.log("data:", data)
        // loggedIn
        const allAddresses = data.data.customer.addresses.map(
          (address: {
            default_shipping: any;
            default_billing: any;
            firstname: any;
            lastname: any;
            street: any;
            id: any;
            country_code: any;
            telephone: any;
            city: any;
            postcode: any;
          }) => ({
            firstname: address.firstname,
            lastname: address.lastname,
            street: address.street,
            addressId: address.id,
            country: address.country_code,
            telephone: address.telephone,
            city: address.city,
            postCode: address.postcode,
            default_shipping: address.default_shipping,
            default_billing: address.default_billing,
          })
        );
        allAddresses.forEach((address: any) => {
          if (address.postCode === "null") {
            address.postCode = null;
          }
        });
        setAddresses(allAddresses);


        if(!data.data.customer.addresses.length) return
        
        const array = {
          street: data.data.customer.addresses[0].street,
          addressId: data.data.customer.addresses[0].id,
          country: data.data.customer.addresses[0].country_code,
          telephone: data.data.customer.addresses[0].telephone,
          city: data.data.customer.addresses[0].city,
          postCode: data.data.customer.addresses[0].postcode,
        };
        setCustomerAddress(array);
        //    return data.customer.addresses[0];
      } catch (e) {
        console.log("ERROR 500");
        console.log("failed to ????", e);
      }
    }
    getAddress("ar");
  }, []);


  return (
    <>
      <H4 className="mb-3">1. {t("checkout:deliveryForm.title")}</H4>
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
                setIsAddressModified(true);
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
                    setIsAddressModified(true);
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
          defaultValue={firstname}
          id="deliveryFirstName"
          type="text"
          name="deliveryFirstName"
          placeholder={t("checkout:deliveryForm.firstname")}
          onValueChange={(v) => {
            setFirstname(v.value);
            setDirtyBit(false);
            setIsAddressModified(true);
          }}
        />
        <Input
          label={t("checkout:deliveryForm.lastname")}
          defaultValue={lastname}
          id="deliveryLastName"
          type="text"
          name="deliveryLastName"
          placeholder={t("checkout:deliveryForm.lastname")}
          onValueChange={(v) => {
            v.value && setLastname(v.value);
            setDirtyBit(false);
            setIsAddressModified(true);
          }}
        />

        <Input
          label={t("checkout:deliveryForm.streetAddress")}
          defaultValue={street}
          id="deliveryStreetAddress"
          type="text"
          name="deliveryStreetAddress"
          placeholder={t("checkout:deliveryForm.streetAddress")}
          onValueChange={(v) => {
            setStreet(v.value);
            setDirtyBit(false);
            setIsAddressModified(true);
          }}
          containerClass="col-span-2"
        />


        <Input
          label={t("checkout:deliveryForm.phoneNumber")}
          defaultValue={telephone}
          id="deliveryPhoneNumber"
          type="text"
          name="deliveryPhoneNumber"
          placeholder={t("checkout:deliveryForm.phoneNumber")}
          onValueChange={(v) => {
            setTelephone(v.value);
            setIsAddressModified(true);
            setDirtyBit(false);
          }}
          validationFunction={isValidPhone}
          errorMessage={t("common/account:phoneError")}
        />
        <Select
          label={t("checkout:deliveryForm.city")}
          defaultValue={city}
          name="state"
          placeholder={city || ""}
          options={countryStates.map((c) => ({
            label: locale === "ar" ? c.name : c.code,
            value: c.code,
          }))}
          selectRef={null}
          onChange={(v) => {
            // const isValid = isAddressValid({
            //   firstname,
            //   lastname,
            //   street,
            //   telephone,
            // })
            // if(!isValid) return
            // return
            // console.log("setting v1", loggedIn)
            setCity(v || "");
            setDirtyBit(false);

            setShippingAddressOnCart({
              city: v || "",
              country_code: "SA",
              firstname: firstname,
              lastname: lastname,
              postcode: "",
              street: street,
              telephone: telephone,
            });
          }}
          disabled={false}
        />
        {loading ? (
          <div className="flex justify-center items-center my-3">
            <Loading />
          </div>
        ) : data && city ? (
          // <div>{JSON.stringify(data)}</div>
          <div className="flex flex-col my-4 col-span-2">
            <Label>{t("checkout:deliveryForm.shippingMethod")}</Label>
            {data.map((m: any) => (
              <label key={m.method_code}>
                <input
                  type="radio"
                  name="selectedShippingMethod"
                  value={m.method_code}
                  checked={selectedShipping === m.method_code}
                  onChange={() =>
                    handleShippingMethodUpdate(m.carrier_code, m.method_code)
                  }
                />
                {title} - {price} SAR
              </label>
            ))}{" "}
          </div>
        ) : (
          <></>
        )}
      </form>
      {/* CREDIT CARD FORMAT */}
      {Boolean(city) && Boolean(firstname) && Boolean(shippingAddress) && (
        <div className="pt-8">
          <div className="bg-white rounded">
            <H4 className="mb-3">2. {t("checkout:paymentForm.title")}</H4>
            <AvaliblePaymentMethods cartV2={cartV2} />

            <div className="my-3">
              {setPaymentMethodOnCartLoading ? (
                <div className="flex items-center justify-center">
                  <Loading />
                </div>
              ) : cart.selectedPaymentMethods?.code ===
                "moyasar_credit_card" ? (
                <CreditCardForm
                  city={city}
                  firstname={firstname}
                  lastname={lastname}
                  street={street}
                  telephone={telephone}
                  validShippingForm={validShippingForm}
                  guestEmail={guestEmail}
                />
              ) : cart.selectedPaymentMethods?.code === "moyasar_apple_pay" ? (
                <ApplePayPayment
                  loggedIn={loggedIn}
                  validShippingForm={validShippingForm}
                  city={city}
                  firstname={firstname}
                  lastname={lastname}
                  street={street}
                  telephone={telephone}
                  guestEmail={guestEmail}
                />
              ) : cart.selectedPaymentMethods?.code === "cashondelivery" ? (
                <Button
                  // Create payment
                  style={{ backgroundColor: "#1D4ED8" }}
                  className="col-span-4 w-full py-4 purchasedc-now"
                  type="submit"
                  onClick={cashOnDeliverySubmit}
                  id="purchase"
                  loading={check}
                  // disabled={!validCreditCardForm || !validShippingForm || submittionDisabled}
                >
                  {locale === "ar" ? "إتمام الدفع" : "pay"}
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreditAddressForm;
