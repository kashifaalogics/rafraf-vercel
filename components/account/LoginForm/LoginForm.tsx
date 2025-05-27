import { useAuth } from "@common/hooks";
import { isValidEmail, isValidPassword } from "@common/utils/validation";
import { H3, H5, Label } from "@components/typography";
import { Button, Input } from "@components/ui";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import {
  FormEvent,
  FunctionComponent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { RequestResetPasswordForm } from "../";
import ShowPassword from "@components/icons/showPassword";
import HidePassword from "@components/icons/hidePassword";
import { useRouter } from "next/router";

interface Props {
  onLoginComplete?: () => void;
}

const LoginForm: FunctionComponent<Props> = ({
  onLoginComplete = () => {},
}) => {
  const { t } = useTranslation();
  const { loggedIn, loggingIn, login } = useAuth();
  const { openModal } = useUI();
  const [email, setEmail] = useState({ value: "", valid: false });
  const [password, setPassword] = useState({ value: "", valid: false });
  const [wrongInput, setWrongInput] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  // show modal even when loggedIn
  useEffect(() => {
    if (loggedIn) {
      onLoginComplete();
    }
  }, [loggedIn]);

  const validForm = useMemo<boolean>(
    () =>
      email.valid &&
      Boolean(email.value) &&
      password.valid &&
      Boolean(password.value),
    [email, password]
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validForm) return;
    const res = await login({ email: email.value, password: password.value });
    if (!loggedIn) {
      setWrongInput(true);
    }
  };
  
  return (
    <div className="flex flex-col items-center">
      <H3 className="text-blue">{t("common/account:login.title")}</H3>
      <H5 className="text-blue mt-3">{t("common/account:login.subtitle")}</H5>
      <form className="flex flex-col gap-3" onSubmit={submit}>
        <div className="relative flex justify-between items-center">
          <Input
            label={t("common/account:email")}
            id="loginEmail"
            errorMessage={t("common/account:emailError")}
            type="text"
            name="email"
            placeholder="example@email.com"
            onValueChange={(e) => setEmail(e)}
            validationFunction={isValidEmail}
          />
        </div>
        <div className="text-sm op-30">{t("common/account:password")}</div>
        <div className="relative flex justify-between items-center bg-grey-op-20 rounded shadow-xl">
          <Input
            id="loginPass"
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="********"
            onValueChange={(e) => setPassword(e)}
            errorMessage={
              password.valid ? "" : t("common/account:passwordError")
            }
            className="w-56 bg-grey-op-20 rounded h-10 px-4"
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
        <Label className="text-red">
          {wrongInput ? t("common/account:passwordCheck") : ""}
        </Label>

        <div className="flex justify-end">
          <div
            className="cursor-pointer underline text-darkgrey"
            onClick={() => openModal(<RequestResetPasswordForm />)}
          >
            {t("common/account:forget")}
          </div>
        </div>

        <Button
          style={{ backgroundColor: "#1D4ED8" }}
          type="submit"
          className="py-3"
          disabled={!validForm}
          loading={loggingIn}
        >
          {t("common:signIn")}
        </Button>
      </form>
    </div>
  );
};

export default LoginForm;
