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

interface Props {
  onSaved?: () => void;
}

const AccountInfoForm: FunctionComponent<Props> = ({ onSaved = () => {} }) => {
  const { t } = useTranslation();
  const { customer, updateCustomerInfo, updateCustomerInfoLoading } =
    useCustomer();

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
  // const [currentPassword, setCurrentPassword] = useState({
  //   value: "",
  //   valid: false,
  // });

  useEffect(() => {
    setFirstname({ value: customer?.firstname, valid: true });
    setLastname({ value: customer?.lastname, valid: true });
    setmobile_number({ value: customer?.mobile_number, valid: true });
    setEmail({ value: customer?.email, valid: true });
  }, [customer]);

  const validForm = useMemo<boolean>(
    () =>
      firstname.valid &&
      Boolean(firstname.value) &&
      lastname.valid &&
      Boolean(lastname.value) &&
      mobile_number.valid &&
      Boolean(mobile_number.value) &&
      email.valid &&
      Boolean(email.value),
    [firstname, lastname, email, mobile_number]
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validForm) return;
    if (
      !firstname.value ||
      !lastname.value ||
      !email.value ||
      !mobile_number.value
    )
      return;
    await updateCustomerInfo({
      lastname: lastname.value,
      firstname: firstname.value,
      mobile_number: mobile_number.value,
      email: email.value,
    });
    rafrafToast(t("common:saved"));
    onSaved();
  };

  const deleteAccount = async () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    //myHeaders.append("Cookie", "PHPSESSID=2dl0skmjc27d4jkr314fm8vgh4");

    const res = await fetch(
      `${API_URL}/rest/V1/deletecustomer/${customer?.email}`,
      {
        method: "delete",
        headers: myHeaders,
      }
    );

    const token = await res.json();

    if (token) {
      window.location.replace(`${BASE_URL}?deleted=true`);
    }
  };
  return (
    <div className="flex flex-col">
      <H5 className="text-blue mt-3">{t("account:personalInfo")}</H5>

      <form className="flex flex-col gap-3 mb-5" onSubmit={submit}>
        <Input
          label={t("common/account:firstname")}
          id="signupFirstname"
          errorMessage={t("common/account:nameError")}
          type="text"
          name="firstname"
          placeholder={t("common/account:firstname")}
          onValueChange={(e) => setFirstname(e)}
          value={firstname.value}
        />

        <Input
          label={t("common/account:lastname")}
          id="signupLastname"
          errorMessage={t("common/account:nameError")}
          type="text"
          name="lastname"
          placeholder={t("common/account:lastname")}
          onValueChange={(e) => setLastname(e)}
          value={lastname.value}
        />

        <Input
          label={t("common/account:phoneNo")}
          id="signupPhone"
          errorMessage={t("common/account:phoneError")}
          type="text"
          name="phone"
          placeholder={t("common/account:phoneNo")}
          onValueChange={(e) => setmobile_number(e)}
          value={mobile_number.value}
        />

        <Input
          label={t("common/account:email")}
          id="signupEmail"
          errorMessage={t("common/account:emailError")}
          type="text"
          name="email"
          placeholder="example@email.com"
          onValueChange={(e) => setEmail(e)}
          validationFunction={isValidEmail}
          value={email.value}
        />

        {/* <Input
          label={t("common/account:currentPassword")}
          id="currentPassword"
          errorMessage={""}
          type="password"
          name="currentPassword"
          placeholder={t("common/account:currentPassword")}
          onValueChange={(e) => setCurrentPassword(e)}
          value={currentPassword.value}
        /> */}

        <Button
          type="submit"
          color="blue"
          className="py-3"
          disabled={!validForm}
          loading={updateCustomerInfoLoading}
        >
          {t("common:save")}
        </Button>
      </form>

      {/* <Button
          type="button"
          color="red"
          className="py-3"
          onClick={deleteAccount}
        >
          {t("common:delete")}
        </Button> */}
    </div>
  );
};

export default AccountInfoForm;
