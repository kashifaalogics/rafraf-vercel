import { useAuth, useCustomer } from "@common/hooks";
import { rafrafToast } from "@common/utils/feedback";
import { isValidEmail } from "@common/utils/validation";
import { H5 } from "@components/typography";
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
import { Link } from "@components/ui";
interface Props {
  onSaved?: () => void;
}
interface adress {
city: string
country_code: string
default_shipping : boolean 
firstname: string
lastname: string
street: object 
telephone: number
postcode: string
}

const AccountInfoPreview: FunctionComponent<Props> =  ({
  onSaved = () => {},
}) => {
  const { t } = useTranslation();
  const { customer, updateCustomerInfo, updateCustomerInfoLoading } =
    useCustomer();

  const [addressData, setaddressData] = useState({
    city: "",
    default_shipping : '', 
    firstname: '',
    lastname: '',
    street: '', 
    postcode: '', 
    country_code: '', 
    telephone: ''
  });

  const [firstname, setFirstname] = useState({
    value: customer?.firstname,
    valid: false,
  });
  const [lastname, setLastname] = useState({
    value: customer?.lastname,
    valid: false,
  });
  const [mobile_number, setmobile_number] = useState({
    value: customer?.mobile_number,
    valid: false,
  });
  const [email, setEmail] = useState({
    value: customer?.email,
    valid: false,
  });

  useEffect(() => {
    async function getCustomerData(locale: string) {
      try {
        var queryGet = `
        query getCustomerData{
          customer {
            addresses {
              city
              firstname
              lastname
              telephone
              street
              postcode
              default_shipping
              country_code
            }
          }
        }
      `;
        const currentToken = JSON.parse(
          window.localStorage.getItem("CUSTOMER_STATE") || "{}"
        );

        const res = await fetch(`${API_URL}/graphql`, {
          method: "POST",
          body: JSON.stringify({ query: queryGet, locale: "ar" }),

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentToken.token}`,
          },
        });

        const data = await res.json();
        const array = {
          city: data.data.customer.addresses[0].city,
          default_shipping : data.data.customer.addresses[0].default_shipping, 
          firstname: data.data.customer.addresses[0].firstname,
          lastname: data.data.customer.addresses[0].lastname,
          street: data.data.customer.addresses[0].street, 
          country_code: data.data.customer.addresses[0].country_code, 
          postcode: data.data.customer.addresses[0].postcode, 
          telephone: data.data.customer.addresses[0].telephone
        }
        setaddressData(array);
        console.log("render data", addressData);
        return data;
      } catch (e) {
        console.log("ERROR 500");
        console.log(e);
      }
    }

    const customerdata = getCustomerData("ar").then((data) => {});

    setFirstname({ value: customer?.firstname, valid: true });
    setLastname({ value: customer?.lastname, valid: true });
    setmobile_number({ value: customer?.mobile_number, valid: true })
    setEmail({ value: customer?.email, valid: true });
  }, [customer]);
  

  const validForm = useMemo<boolean>(
    () =>
      firstname.valid &&
      Boolean(firstname.value) &&
      lastname.valid &&
      Boolean(lastname.value) &&
      mobile_number.valid &&
      Boolean(mobile_number.value)&&
      email.valid &&
      Boolean(email.value),
    [firstname, lastname, email , mobile_number]
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validForm) return;
    if (!firstname.value || !lastname.value || !email.value || !mobile_number.value) return;
    await updateCustomerInfo({
      lastname: lastname.value,
      firstname: firstname.value,
      mobile_number: mobile_number.value,
      email: email.value,
    });
    rafrafToast(t("common:saved"));
    onSaved();
  };

  return (
    <div className="my_account_showcase">
      <div className="contact_info">
        <h1>{t("account:AccountInformation")}</h1>
        <h4 className="contact_info_heading">
          {t("account:ContactInformation")}
        </h4>
        <p className="contact_info_name">
          {firstname.value} {lastname.value}
        </p>
        <p className="contact_info_email">{mobile_number.value}</p>
        <p className="contact_info_email">{email.value}</p>
        <div className="edit_changePassword">
          <Link href="/account">
            <a className="edit">{t("account:Edit")}</a>
          </Link>
          <Link href="/account">
            <a className="chnagePass">{t("account:changePassword")}</a>
          </Link>
        </div>
      </div>

      {/* {addressData?.data?.customer?.addresses?.map((e:any) => ( */}
        <div>
          <div className="address_books">
            <div className="address_books_manage_address">
              <h1 >{t("account:AddressBook")}</h1>
            </div>
            <div className="address_books">
              <div className="default_billing_address">
                <h4 className="address_books_heading">
                  {t("account:DefaultBillingAddress")}
                </h4>
                <p className="address_books_name">
                  {addressData.default_shipping
                    ? (
                      <>
                        <p>{addressData.firstname} {addressData.lastname}</p>
                        <p>{addressData.street}</p>
                        <p>{addressData.city} {addressData.postcode}</p>  
                        <p>{addressData.country_code}</p>  
                        <p>{addressData.telephone}</p>  
                      </>
                    )
                    : "You have not set a default shipping address."}
                </p>
                <div className="edit_address">
                  <Link href="/account/address-book">
                    <a>{t("account:EditAddress")}</a>
                  </Link>
                </div>
              </div>
              <div className="default_shipping_address">
                <h4 className="address_books_heading">
                  {t("account:DefaultShippingAddress")}
                </h4>
                <p className="address_books_name">
                  {addressData.default_shipping
                    ? (
                      <>
                      <p>{addressData.firstname} {addressData.lastname}</p>
                      <p>{addressData.street}</p>
                      <p>{addressData.city} {addressData.postcode}</p>  
                      <p>{addressData.country_code}</p>  
                      <p>{addressData.telephone}</p>  
                    </>
                    )
                    : "You have not set a default shipping address."}
                </p>
                <div className="edit_address">
                  <Link href="/account/address-book">
                    <a>{t("account:EditAddress")}</a>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/* ))} */}
      {/* <div className="address_books">
              <div className="address_books_manage_address">
                <h1>{t("account:AddressBook")}</h1>
              </div>
              <div className="address_books">
                <div className="default_billing_address">
                  <h4 className="address_books_heading">
                    {t("account:DefaultBillingAddress")}
                  </h4>
                  <p className="address_books_name">
                    You have not set a default billing address.
                  </p>
                  <div className="edit_address">
                    <Link href="/account/address-book">
                    <a >{t("account:EditAddress")}</a>
                    </Link>
                  </div>
                </div>
                <div className="default_shipping_address">
                  <h4 className="address_books_heading">
                  {t("account:DefaultBillingAddress")}
                  </h4>
                  <p className="address_books_name">
                    You have not set a default shipping address.
                  </p>
                  <div className="edit_address">
                  <Link href="/account/address-book">
                    <a >{t("account:EditAddress")}</a>
                    </Link>
                  </div>
                </div>
              </div>
            </div> */}
    </div>
  );
};

export default AccountInfoPreview;
