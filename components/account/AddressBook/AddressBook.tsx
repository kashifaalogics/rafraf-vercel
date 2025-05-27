import { useAuth, useCustomer } from "@common/hooks";
import { rafrafToast } from "@common/utils/feedback";
import { isValidEmail } from "@common/utils/validation";
import { H5, H1 } from "@components/typography";
import { Button, Input } from "@components/ui";
import { API_URL, BASE_URL } from "@framework/const";
import useTranslation from "next-translate/useTranslation";
import { redirect } from "next/dist/server/api-utils";
import {
  FormEvent,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { $CombinedState } from "redux";
import { getConfig } from "@framework/api/config";
import { data } from "cheerio/lib/api/attributes";
import { Link } from "@components/ui";
import { useRouter } from "next/router";
import { useStore } from "@common/state";

interface Props {
  onSaved?: () => void;
}

const AddressBook: FunctionComponent<Props> = ({ onSaved = () => {} }) => {
  const { t } = useTranslation();
  const { customer, updateCustomerInfo, updateCustomerInfoLoading } =
    useCustomer();
  const { CustomerAddress, setCustomeraddress } = useStore();
  // const [customerAddress, setCustomeraddress] = useState({
  //   addressId: null,
  //   street: "",
  //   telephone: "",
  //   city: "",
  //   country: "",
  //   postCode: "",
  // });

  const router = useRouter();
  const [firstname, setFirstname] = useState({
    value: customer?.firstname,
    valid: false,
  });
  const [lastname, setLastname] = useState({
    value: customer?.lastname,
    valid: false,
  });
  const [email, setEmail] = useState({
    value: customer?.email,
    valid: false,
  });

  const [street, setStreet] = useState({
    value: CustomerAddress?.street,
    valid: false,
  });
  const [city, setCity] = useState({
    value: CustomerAddress?.city,
    valid: false,
  });
  const [country, setCountry] = useState({
    value: CustomerAddress?.country,
    valid: false,
  });
  const [telephone, setTelephone] = useState({
    value: CustomerAddress?.telephone,
    valid: false,
  });
  const [postCode, setPostCode] = useState({
    value: CustomerAddress?.postCode,
    valid: false,
  });
  const [addressId, setaddressId] = useState({
    value: CustomerAddress?.addressId,
    valid: false,
  });
  console.log("customerAddress:", CustomerAddress);

  const [addresses, setAddresses] = useState<any[]>([]);

  const [formShowHide, setformShowHide] = useState(false);

  useEffect(() => {
    setFirstname({ value: customer?.firstname, valid: true });
    setLastname({ value: customer?.lastname, valid: true });
    setEmail({ value: customer?.email, valid: true });
    setStreet({ value: CustomerAddress?.street, valid: true });
    setCountry({ value: CustomerAddress?.country, valid: true });
    setTelephone({ value: CustomerAddress?.telephone, valid: true });
    setCity({ value: CustomerAddress?.city, valid: true });
    setPostCode({ value: CustomerAddress?.postCode, valid: true });
    setaddressId({ value: CustomerAddress?.addressId, valid: true });
  }, [customer, CustomerAddress, formShowHide]);
  const validForm = useMemo<boolean>(
    () =>
      firstname.valid &&
      Boolean(firstname.value) &&
      lastname.valid &&
      Boolean(lastname.value) &&
      email.valid &&
      Boolean(email.value),
    [firstname, lastname, email]
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    console.log("in submit");
    e.preventDefault();
    //if (!validForm) return;
    if (
      !firstname.value ||
      !lastname.value ||
      !telephone.value ||
      !country.value ||
      !street.value ||
      !city.value
    )
      return;
    await updateCustomerAddress(
      addressId.value,
      firstname.value,
      lastname.value,
      telephone.value,
      country.value,
      street.value,
      city.value,
      postCode.value
    );
    rafrafToast(t("common:saved"));
    onSaved();
    setformShowHide(false);
    router.push("/account/address-book");
  };

  async function updateCustomerAddress(
    addressId: any,
    firstname: string,
    lastname: string,
    telephone: any,
    country: string,
    street: any,
    city: string,
    postCode: string
  ) {
    try {
      var queryGet = `
      mutation {
        updateCustomerAddress( 
            id: ${addressId}
            input: {
              firstname : "${firstname}"
              lastname: "${lastname}"
              street: "${street}"
              city: "${city}"
              postcode: "${postCode}"
              country_code: ${country}
              telephone: "${telephone}"
            }
          ) {
            id
            firstname 
            lastname
            street
            city
            postcode
            country_code
            telephone

          }
       }     
     `;

      const currentToken = JSON.parse(
        window.localStorage.getItem("CUSTOMER_STATE") || "{}"
      );
      const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet }),

        headers: {
          "Content-Type": "application/json",
          Store: "ar",
          Authorization: `Bearer ${currentToken.token}`,
        },
      });

      const data = await res.json();

      const array = {
        street: data.data.updateCustomerAddress.street,
        addressId: data.data.updateCustomerAddress.id,
        country: data.data.updateCustomerAddress.country_code,
        telephone: data.data.updateCustomerAddress.telephone,
        city: data.data.updateCustomerAddress.city,
        postCode: data.data.updateCustomerAddress.postcode,
      };
      setCustomeraddress(array);
      console.log("setCustomeraddress@ @ @1", CustomerAddress);
      //    return data.customer.addresses[0];
    } catch (e) {
      console.log("ERROR 500");
      console.log("failed to ????", e);
    }
  }

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

      const currentToken = JSON.parse(
        window.localStorage.getItem("CUSTOMER_STATE") || "{}"
      );
      const apiConfig = getConfig({ locale: "ar" });
      const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet, locale: apiConfig.locale }),

        headers: {
          "Content-Type": "application/json",
          Store: locale,
          Authorization: `Bearer ${currentToken.token}`,
        },
      });

      const data = await res.json();

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
      setAddresses(allAddresses);

      const array = {
        street: data.data.customer.addresses[0].street,
        addressId: data.data.customer.addresses[0].id,
        country: data.data.customer.addresses[0].country_code,
        telephone: data.data.customer.addresses[0].telephone,
        city: data.data.customer.addresses[0].city,
        postCode: data.data.customer.addresses[0].postcode,
      };
      setCustomeraddress(array);
      //    return data.customer.addresses[0];
    } catch (e) {
      console.log("ERROR 500");
      console.log("failed to ????", e);
    }
  }

  const formOpens = () => {
    setformShowHide(true);
  };

  const editAddress = () => {
    setformShowHide(true);
  };

  useEffect(() => {
    getAddress("ar");
  }, []);
  console.log("postCode:", postCode)
  return (    
    <div className="addressBookPage my_account_showcase pt-10">
      <H1>{t("account:AddressBook")}</H1>
      <div className="address_books">
        <div className="address_books_manage_address">
          <h1>{t("account:defaultAddresses")}</h1>
        </div>
        <div className="address_books">
          <div className="default_billing_address">
            <h4 className="address_books_heading">
              {t("account:DefaultBillingAddress")}
            </h4>
            <p className="address_books_name">
              {firstname.value} {lastname.value}
            </p>
            <p className="address_books_name">{street.value}</p>
            <p className="address_books_name">
              {city.value} {postCode.value}
            </p>
            <p className="address_books_name">{country.value}</p>
            <p className="address_books_name">{telephone.value}</p>

            <div className="edit_address">
              <Link href="#form_info_address">
                <a onClick={editAddress}>{t("account:changeBillingAddress")}</a>
              </Link>
            </div>
          </div>
          <div className="default_shipping_address">
            <h4 className="address_books_heading">
              {t("account:DefaultShippingAddress")}
            </h4>
            {/* <p className="address_books_name"> */}
            {/* {addressData.default_shipping
                    ? addressData.street
                    : "You have not set a default shipping address."} */}
            {/* </p> */}
            <p className="address_books_name">
              {firstname.value} {lastname.value}
            </p>
            <p className="address_books_name">{street.value}</p>
            <p className="address_books_name">
              {city.value} {postCode.value}
            </p>
            <p className="address_books_name">{country.value}</p>
            <p className="address_books_name">{telephone.value}</p>

            <div className="edit_address">
              <Link href="#form_info_address">
                <a onClick={editAddress}>
                  {t("account:changeShippingAddress")}
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="additional_entries">
        <div className="additional_entries_name">
          <h2>{t("account:additionalAddressEntries")}</h2>
        </div>
        <table className="table_entries">
          <tbody>
            <tr className="table_head">
              <th>{t("account:firstName")}</th>
              <th>{t("account:lastName")}</th>
              <th>{t("account:streetAddress")}</th>
              <th>{t("account:city")}</th>
              <th>{t("account:Country")}</th>
              <th>{t("account:State")}</th>
              <th>{t("account:zip/PostalCode")}</th>
              <th>{t("account:phone")}</th>
            </tr>
            {addresses.map((addd, key) => (
              <tr key={key}>
                <td>{addd.firstname}</td>
                <td>{addd.lastname}</td>
                <td>{addd.street}</td>
                <td>{addd.city}</td>
                <td>{addd.country}</td>
                <td>{addd.State}</td>
                <td>{addd.postCode}</td>
                <td>{addd.telephone}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="count_items_table">
          <p>{addresses.length} Item(s)</p>
        </div>
      </div>

      <div className="form_info_address" id="form_info_address">
        {formShowHide ? (
          <div>
            <h1>{t("account:AddNewAddress")}</h1>
            <form onSubmit={submit} className="space-y-6">
              <div className="info mb-4">
                <div className="head mb-4">
                  <h2>{t("account:ContactInformation")}</h2>
                </div>
                <Input
                  label={t("common/account:firstname")}
                  id="firstname"
                  errorMessage={t("common/account:nameError")}
                  type="text"
                  name="firstname"
                  placeholder={t("common/account:lastname")}
                  onValueChange={(e) => setFirstname(e)}
                  value={firstname.value}
                  className="w-full"
                />
                <Input
                  label={t("common/account:lastname")}
                  id="lastname"
                  errorMessage={t("common/account:nameError")}
                  type="text"
                  name="lastname"
                  placeholder={t("common/account:lastname")}
                  onValueChange={(e) => setLastname(e)}
                  value={lastname.value}
                  className="w-full"
                />
                <Input
                  label={t("account:phoneNumber")}
                  id="phoneNumber"
                  errorMessage={t("common/account:nameError")}
                  type="text"
                  name="phoneNumber"
                  onValueChange={(e) => setTelephone(e)}
                  value={telephone.value}
                  className="w-full"
                />
              </div>
              <div className="address">
                <div className="head mb-4">
                  <h2>{t("account:Address")}</h2>
                </div>
                <Input
                  label={t("account:streetAddress")}
                  errorMessage={t("common/account:nameError")}
                  type="text"
                  placeholder={t("account:streetExample")}
                  onValueChange={(e) => setStreet(e)} 
                  value={street.value}
                  className="w-full"
                />
                <Input
                  label={t("account:Country")}
                  id="country"
                  errorMessage={t("common/account:nameError")}
                  type="text"
                  name="country"
                  placeholder={t("account:Country")}
                  onValueChange={(e) => setCountry(e)}
                  value={country.value}
                  className="w-full"
                />
                <Input
                  label={t("account:city")} 
                  id="city"
                  errorMessage={t("common/account:nameError")}
                  type="text"
                  name="city"
                  onValueChange={(e) => setCity(e)}
                  value={city.value}
                  className="w-full"
                />
                <Input
                  label={t("account:zip/PostalCode")}
                  id="post_code"
                  errorMessage={t("common/account:nameError")}
                  type="text"
                  name="post_code"
                  onValueChange={(e) => setPostCode(e)}
                  value={postCode.value}
                  className="w-full"
                />
                <Button type="submit" className="px-5 py-3 w-full sm:w-auto">
                  {" "}
                  {t("common:save")}{" "}
                </Button>
              </div>
            </form>
          </div>
        ) : (
          <Button className="px-5 py-3" onClick={formOpens}>
            Add New Address
          </Button>
        )}
      </div>
    </div>
  );
};

export default AddressBook;
