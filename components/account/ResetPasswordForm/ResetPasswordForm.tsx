import { useAuth } from "@common/hooks";
import { isValidEmail, isValidPassword } from "@common/utils/validation";
import { H3 } from "@components/typography";
import { Button, Input } from "@components/ui";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { FormEvent, FunctionComponent, useMemo, useState } from "react";

interface Props {}

const ResetPasswordForm: FunctionComponent<Props> = () => {
  const { t } = useTranslation();
  const { resetPassword, resettingPassword } = useAuth();
  const router = useRouter();
  const { openModal } = useUI();
  const [email, setEmail] = useState({ value: "", valid: false });
  const [password, setPassword] = useState({ value: "", valid: false });

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
    try {
      await resetPassword({
        email: email.value,
        newPassword: password.value,
        token: (router.query.token as string) || "",
      });
      openModal(
        <div className="text-green-700 text-center">
          {t("common/account:passwordReset")}
        </div>
      );
      router.push("/");
    } catch (e) {
      openModal(
        <div className="text-red text-center">{t("common:error")}</div>
      );
    }
  };

  return (
    <div className="flex flex-col items-center">
      <H3 className="text-blue">
        {t("common:reset")} {t("common/account:password")}
      </H3>

      <form className="flex flex-col gap-3" onSubmit={submit}>
        <Input
          label={t("common/account:email")}
          id="resetEmail"
          errorMessage={t("common/account:emailError")}
          type="text"
          name="email"
          placeholder="example@email.com"
          onValueChange={(e) => setEmail(e)}
          validationFunction={isValidEmail}
        />

        <Input
          label={t("common/account:password")}
          id="resetPass"
          errorMessage={t("common/account:passwordError")}
          type="password"
          name="password"
          placeholder="********"
          onValueChange={(e) => setPassword(e)}
          validationFunction={isValidPassword}
        />

        <Button
          type="submit"
          color="blue"
          className="py-3"
          disabled={!validForm}
          loading={resettingPassword}
        >
          {t("common:reset")}
        </Button>
      </form>
    </div>
  );
};

export default ResetPasswordForm;
