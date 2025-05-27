import { useCartItems, useSearchEngine } from "@common/hooks";
import { useStore } from "@common/state";
import { Product } from "@common/types/product";
import { Arrow, Cart } from "@components/icons";
import { Subtitle } from "@components/typography";
import { Accordion, Badge, Link, Popup } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import { FunctionComponent, useEffect, useState } from "react";
import { AccountPopup } from "..";

interface Props {
  platform?: "mobile" | "desktop";
  onIncrement?: (product: Product) => void;
  onDecrement?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onWishListed?: (product: Product) => void;
}

const Usernav: FunctionComponent<Props> = ({ platform = "desktop" }) => {

  const { t } = useTranslation();
  const [cartClasses, setCartClasses] = useState("");
  const [openMyAccount, setOpenMyAccount] = useState(false);
  const cartCount = useStore((state) => state.cartCount);

  useEffect(() => {
    setCartClasses("animate__animated animate__rubberBand");
  }, [cartCount]);

  if (platform === "desktop") {
    return (
      <nav>
        <ul className="flex justify-between">
          <li
            className="hidden md:flex relative rounded-lg mx-2 p-3 cursor-pointer hover:bg-blue-op-20 items-center"
            onClick={() => setOpenMyAccount((s) => !s)}
          >
            <div className="flex justify-between items-center">
              <Subtitle className="mx-2">
                {t("common/navbar:myAccountTitle")}
              </Subtitle>
              <Arrow direction="down" />
            </div>
            <Popup open={openMyAccount}>
              <AccountPopup />
            </Popup>
          </li>
          {/* <li className="rounded-lg mx-2 p-3 hover:bg-blue-op-20 cursor-pointer">
            <Link prefetch={false} href="/">
              <A>
                <Badge value={5}>
                  <Heart />
                </Badge>
              </A>
            </Link>
          </li> */}

          <li className="rounded-lg mx-0 md:mx-2 p-3 hover:bg-blue-op-20 cursor-pointer">
            <Link prefetch={false} href="/cart">
              <div
                onAnimationEnd={() => setCartClasses("")}
                // onClick={() => recordAPI({behaviour: "on_cart", source: "navbar"})}
              >
                {cartCount === 0 ? (
                  <Cart className={cartClasses} />
                ) : (
                  <Badge value={cartCount}>
                    <Cart className={cartClasses} />
                  </Badge>
                )}
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    );
  } else {
    return (
      <nav>
        <ul className="flex justify-between">
          <li className="rounded-lg mx-0 md:mx-2 p-3 hover:bg-blue-op-20 cursor-pointer">
            <Link prefetch={false} href="/cart">
              <div
                onAnimationEnd={() => setCartClasses("")}
                // onClick={() => recordAPI({behaviour: "on_cart", source: "navbar"})}
              >
                <Badge value={cartCount}>
                  <Cart className={cartClasses} />
                </Badge>
              </div>
            </Link>
          </li>
          <li
            className="flex flex-1 relative rounded-lg cursor-pointer items-center border-none"
            onClick={() => setOpenMyAccount((s) => !s)}
          >
            <Accordion
              className="w-full"
              label={t("common/navbar:myAccountTitle")}
            >
              <AccountPopup />
            </Accordion>
          </li>
          {/* <li className="rounded-lg mx-2 p-3 hover:bg-blue-op-20 cursor-pointer">
            <Link prefetch={false} href="/">
              <A>
                <Badge value={5}>
                  <Heart />
                </Badge>
              </A>
            </Link>
          </li> */}
        </ul>
      </nav>
    );
  }
};

export default Usernav;
