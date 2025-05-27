import { A } from "@components/typography";
import { Link } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import React, { FunctionComponent } from "react";

interface Props {
  active: "orders" | "info" | "AddressBooks" | "AccountInformation" | "PrivacyTool" | "wishlist";
}

const AccountLayout: FunctionComponent<Props> = ({ active, children, ...rest }) => {
  const { t } = useTranslation();
  return (
    <div className="grid grid-cols-4 gap-3 py-3">
      <div className="col-span-1">
        <div className="shadow flex flex-col">
        <div className={`border-b-2 p-3 ${active === "AccountInformation" ? "bg-grey-op-20" : ""}`}>
            <Link href="/account/account-information">
              <A>{t("account:accountInfo")}</A>
            </Link>
          </div>
          <div className={`border-b-2 p-3 ${active === "info" ? "bg-grey-op-20" : ""}`}>
            <Link href="/account">
              <A>{t("account:AccountInformation")}</A>
            </Link>
          </div>
          <div className={`border-b-2 p-3 ${active === "orders" ? "bg-grey-op-20" : ""}`}>
            <Link href="/account/orders">
              <A>{t("account:myOrders")}</A>
            </Link>
          </div>
          <div className={`border-b-2 p-3 ${active === "AddressBooks" ? "bg-grey-op-20" : ""}`}>
            <Link href="/account/address-book">
              <A>{t("account:AddressBooks")}</A>
            </Link>
          </div>
         
          <div className={`border-b-2 p-3 ${active === "PrivacyTool" ? "bg-grey-op-20" : ""}`}>
            <Link href="/account/privacy-tool">
              <A>{t("account:PrivacyTool")}</A>
            </Link>
          </div>
          <div className={`border-b-2 p-3 ${active === "wishlist" ? "bg-grey-op-20" : ""}`}>
            <Link href="/account/wishlist">
              <A>{t("account:wishlist")}</A>
            </Link>
          </div>
        </div>
      </div>

      <div className="col-span-3">{children}</div>
    </div>
  );
};

export default AccountLayout;
