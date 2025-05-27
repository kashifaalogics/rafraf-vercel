import { useAuth } from "@common/hooks";
import { handleError, handleSuccess } from "@common/utils/handlers";
import { isValidEmail, isValidPassword } from "@common/utils/validation";
import { H3, H5 } from "@components/typography";
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

interface Props {
  
}

const RequestResetPasswordForm: FunctionComponent<Props> = () => {
  const { t } = useTranslation();
  const { requestResetPassword, requestingResetPassword } = useAuth();
  const { openModal } = useUI();
  const [email, setEmail] = useState({ value: "", valid: false });

  const validForm = useMemo<boolean>(
    () =>
      email.valid &&
      Boolean(email.value),
    [email]
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validForm) return;
    try {
      await requestResetPassword(email.value);
      openModal(<div className="text-green-700 text-center">{t("common/account:resetPasswordRequested")}</div>);
    } catch (e) {
      openModal(<div className="text-red text-center">{t("common:error")}</div>);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <H3 className="text-blue">{t("common:reset")} {t("common/account:password")}</H3>

      <form className="flex flex-col gap-3" onSubmit={submit}>
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

        <Button
          type="submit"
          color="blue"
          className="py-3"
          disabled={!validForm}
          loading={requestingResetPassword}
        >
          {t("common:reset")}
        </Button>
      </form>
    </div>
  );
};

export default RequestResetPasswordForm;
