import { useCustomer } from "@common/hooks";
import { rafrafToast } from "@common/utils/feedback";
import { isValidPassword } from "@common/utils/validation";
import { H5 } from "@components/typography";
import { Button, Input } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import { FormEvent, FunctionComponent, useMemo, useState } from "react";

interface Props {
  onSaved?: () => void;
}

const ChangePasswordForm: FunctionComponent<Props> = ({
  onSaved = () => {},
}) => {
  const { t } = useTranslation();
  const { changePassword, changePasswordLoading } = useCustomer();

  const [currentPassword, setCurrentPassword] = useState({
    value: "",
    valid: false,
  });
  const [newPassword, setNewPassword] = useState({
    value: "",
    valid: false,
  });

  const validForm = useMemo<boolean>(
    () =>
      currentPassword.valid &&
      Boolean(currentPassword.value) &&
      newPassword.valid &&
      Boolean(newPassword.value),
    [currentPassword, newPassword]
  );

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validForm) return;
    if (!currentPassword.value || !newPassword.value) return;
    await changePassword({
      newPassword: newPassword.value,
      currentPassword: currentPassword.value,
    });
    rafrafToast(t("common:saved"));
    onSaved();
  };

  return (
    <div className="flex flex-col">
      <H5 className="text-blue mt-3">{t("account:changePassword")}</H5>

      <form className="flex flex-col gap-3" onSubmit={submit}>
        <Input
          label={t("common/account:currentPassword")}
          id="currentPassword"
          errorMessage={""}
          type="password"
          name="currentPassword"
          placeholder={t("common/account:currentPassword")}
          onValueChange={(e) => setCurrentPassword(e)}
          value={currentPassword.value}
        />

        <Input
          label={t("common/account:newPassword")}
          id="newPassword"
          errorMessage={t("common/account:passwordError")}
          type="password"
          name="newPassword"
          placeholder={t("common/account:newPassword")}
          onValueChange={(e) => setNewPassword(e)}
          value={newPassword.value}
          validationFunction={isValidPassword}
        />

        <Button
          type="submit"
          color="blue"
          className="py-3"
          disabled={!validForm}
          loading={changePasswordLoading}
        >
          {t("common:save")}
        </Button>
      </form>
    </div>
  );
};

export default ChangePasswordForm;
