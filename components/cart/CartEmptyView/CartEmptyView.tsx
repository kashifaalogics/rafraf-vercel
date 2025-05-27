import { FunctionComponent, useEffect, useState } from "react";
import { Cart as CartIcon } from "@components/icons";
import { A, H3 } from "@components/typography";
import Link from "next/link";
import useTranslation from "next-translate/useTranslation";
import { CartItem } from "@common/types/cart";
import { useRouter } from "next/router";
import { useUI } from "@components/ui/constext";
import { LoginForm } from "@components/account";
import { useStore } from "@common/state";
import { Button } from "@components/ui";

interface Props {
  cartItems: CartItem[];
}

const CartEmptyView: FunctionComponent<Props> = ({ cartItems }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { openModal, closeModal } = useUI();
  const { setCartCount } = useStore();
  useEffect(() => {
    const showModal = router.query.modal === "login";
    if (!showModal) return;
    openModal(<LoginForm onLoginComplete={closeModal} />);
  }, [router]);

  useEffect(() => {
    setCartCount(0);
  }, []);
  
  return (
    <div>
      {cartItems.length === 0 ? (
        <div className="flex flex-col gap-8 justify-center items-center py-32">
          <CartIcon size={85} />
          <H3 className="text-blue">{t("cart:emptyCart")}</H3>
          <Link href="/">
            <A
              className="py-4 w-full flex items-center justify-center bg-blue text-white text-lg rounded shadow-md hover:no-underline hover:bg-blue-dark transition-all"
              style={{ maxWidth: "409px", backgroundColor: "#1D4ED8" }}
            >
              {t("cart:goToCatalogue")}
            </A>
          </Link>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default CartEmptyView;
