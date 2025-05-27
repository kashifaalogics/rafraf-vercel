import { useAuth, useCustomer } from "@common/hooks";
import { useUser } from "@common/hooks/z-hooks";
import { LoginForm } from "@components/account";
import RegistrationForm from "@components/account/RegistrationForm";
import { UserCircle } from "@components/icons";
import { A } from "@components/typography";
import { Button, Link } from "@components/ui";
import { useUI } from "@components/ui/constext";
import useTranslation from "next-translate/useTranslation";
import { FunctionComponent } from "react";

interface Props {}

const AccountPopup: FunctionComponent<Props> = (props) => {
  const { t } = useTranslation();
  const { openModal, closeModal, closeSidebar } = useUI();
  const { logout } = useUser();
  const { loggedIn, loggingOut } = useAuth();
  const { customer } = useCustomer();

  const handleRegister = () => {
    openModal(<RegistrationForm onRegistrationComplete={closeModal} />);
    closeSidebar();
  };
  const handleSignIn = () => {
    openModal(<LoginForm onLoginComplete={closeModal} />)
    closeSidebar()
  };

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center gap-3">
        <UserCircle />
        <Button
          className="p-3"
          style={{ minWidth: "160px", backgroundColor: "#1D4ED8" }}
          onClick={handleRegister}
        >
          {t("common:signUp")}
        </Button>
        <Button
          color="white"
          className="p-3 text-blue border-2 border-blue"
          style={{ minWidth: "160px" }}
          onClick={handleSignIn}
        >
          {t("common:signIn")}
        </Button>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col items-center gap-3">
        <div>
          {t("common:hi")} {customer?.firstname}
        </div>
        <Link href="/account">
          <A>
            <div className="flex items-center gap-2">
              <div className="font-bold text-blue">{t("common:myAccount")}</div>
              <div>
                <UserCircle size={30} />
              </div>
            </div>
          </A>
        </Link>

        <Button
          color="white"
          textColor="blue"
          className="p-3 border-2 border-blue"
          style={{ minWidth: "160px" }}
          onClick={() => {
            logout();
          }}
          loading={loggingOut}
        >
          {t("common:signOut")}
        </Button>
      </div>
    );
  }
};

export default AccountPopup;
