import {
  useEffect,
  useRef,
  useState,
  FormEvent,
  FunctionComponent,
  useMemo,
} from "react";
import { useAuth } from "@common/hooks";
import { isValidEmail, isValidPassword } from "@common/utils/validation";
import { Button, Input } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";

interface Props {
  onRegistrationComplete?: () => void;
}

const MagnetLeed: FunctionComponent<Props> = ({
  onRegistrationComplete = () => {},
}) => {
  const { t } = useTranslation();
  const { signup, signingUp, showDiscount, loggedIn } = useAuth();
  const [firstname, setFirstname] = useState({ value: "", valid: false });
  const [lastname, setLastname] = useState({ value: "", valid: false });
  const [mobile_number, setmobile_number] = useState({
    value: "",
    valid: false,
  });
  const [email, setEmail] = useState({ value: "", valid: false });
  const [password, setPassword] = useState({ value: "", valid: false });
  const [checked, isChecked] = useState(false);
  const router = useRouter();

  const validForm = useMemo<boolean>(
    () =>
      firstname.valid &&
      Boolean(firstname.value) &&
      lastname.valid &&
      Boolean(lastname.value) &&
      email.valid &&
      mobile_number.valid &&
      Boolean(mobile_number.value) &&
      Boolean(email.value) &&
      mobile_number.valid &&
      Boolean(mobile_number.value) &&
      password.valid &&
      Boolean(password.value) &&
      checked,
    [firstname, lastname, mobile_number, email, password, checked]
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validForm) return;
    await signup({
      lastname: lastname.value,
      firstname: firstname.value,
      mobile_number: mobile_number.value,
      email: email.value,
      password: password.value,
    });
    onRegistrationComplete();
  };

  return (
    <div className="flex flex-col items-center mx-14  md:mx-auto md:max-w-md md:mr-96">
      <form className="flex flex-col" onSubmit={submit}>
        <img
          className="self-end md:absolute top-32 right-12"
          src="/images/SAR1.png"
          alt=""
        />
        <Input
          label={t("common/account:firstname")}
          id="signupFirstname"
          errorMessage={t("common/account:nameError")}
          type="text"
          name="firstname"
          placeholder={t("common/account:firstname")}
          onValueChange={(e) => setFirstname(e)}
        />
        <Input
          label={t("common/account:lastname")}
          id="signupLastname"
          errorMessage={t("common/account:nameError")}
          type="text"
          name="lastname"
          placeholder={t("common/account:lastname")}
          onValueChange={(e) => setLastname(e)}
        />
        <Input
          label={t("common/account:phoneNo")}
          id="signupPhone"
          errorMessage={t("common/account:nameError")}
          type="text"
          name="phone"
          placeholder={t("common/account:phoneNo")}
          onValueChange={(e) => setmobile_number(e)}
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
        />
        <Input
          label={t("common/account:password")}
          id="signupPass"
          errorMessage={t("common/account:passwordError")}
          type="password"
          name="password"
          placeholder="********"
          onValueChange={(e) => setPassword(e)}
          validationFunction={isValidPassword}
        />
        <div className="flex items-center mb-4">
          <Input
            id="policy"
            type="checkbox"
            name="Chckbox"
            checked={checked}
            onChange={() => isChecked(!checked)}
          />
          <label htmlFor="policy" className="ml-2">
            {t("common/account:policy")}{" "}
            <span
              className="cursor-pointer inline-block px-2 py-1 bg-hite hover:bg-blue-100 transition duration-100 rounded"
              onClick={() => router.push("./privacy-policy")}
            >
              {t("common/account:policyText")}
            </span>
          </label>
        </div>
        <Button
          type="submit"
          style={{ backgroundColor: "#1D4ED8" }}
          className="py-3"
          disabled={!validForm}
          loading={signingUp}
        >
          {t("common:signUp")}
        </Button>
      </form>
    </div>
  );
};

export default MagnetLeed;
