import { useAuth } from "@common/hooks";
import { isValidEmail, isValidPassword } from "@common/utils/validation";
import { H3, H5 } from "@components/typography";
import { Button, Input } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import {
  FormEvent,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
import ShowPassword from "@components/icons/showPassword";
import HidePassword from "@components/icons/hidePassword";
import { useRouter } from "next/router";

interface Props {
  onRegistrationComplete?: () => void;
}

const RegistrationForm: FunctionComponent<Props> = ({
  onRegistrationComplete = () => {},
}) => {
  const { t } = useTranslation();
  const { signup, signingUp } = useAuth();
  const [firstname, setFirstname] = useState({ value: "", valid: false });
  const [lastname, setLastname] = useState({ value: "", valid: false });
  const [mobile_number, setmobile_number] = useState({
    value: "",
    valid: false,
  });
  const [email, setEmail] = useState({ value: "", valid: false });
  const [password, setPassword] = useState({ value: "", valid: false });
  const [showPassword, setShowPassword] = useState(false);
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
      Boolean(password.value),
    [firstname, lastname, mobile_number, email, password]
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
    <div className="flex flex-col items-center">
      <H3 className="text-blue">{t("common/account:login.title")}</H3>
      <H5 className="text-blue mt-3">{t("common/account:login.subtitle")}</H5>

      <form className="flex flex-col gap-3" onSubmit={submit}>
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
        <div className="text-sm op-30">{t("common/account:password")}</div>
        <div className="relative flex justify-between items-center bg-grey-op-20 rounded shadow-xl">
          <Input
            value={password.value}
            id="signupPass"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="********"
            onValueChange={(e) => setPassword(e)}
            validationFunction={isValidPassword}
            className="w-56 md:w-96 bg-grey-op-20 rounded h-10 px-4"
          />

          {showPassword ? (
            <HidePassword
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center text-sm leading-5 p-2"
            >
              {t("common/hide")}
            </HidePassword>
          ) : (
            <ShowPassword
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="flex items-center text-sm leading-5 p-2"
            >
              {t("common/show")}
            </ShowPassword>
          )}
        </div>
        {!password.valid && (
          <div className="text-red-500 text-sm mt-1 text-red">
            {t("common/account:passwordError")}
          </div>
        )}
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

export default RegistrationForm;
