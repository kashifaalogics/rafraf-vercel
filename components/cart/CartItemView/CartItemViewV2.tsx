import { CartItem } from "@common/types/cart";
import { Product } from "@common/types/product";
import { AddToCart, Cross, Heart, Minus, Plus } from "@components/icons";
import { A, H5 } from "@components/typography";
import { Image, Loading } from "@components/ui";
import useLangDirection from "@utils/language/useLangDirection";
import { FunctionComponent, useEffect } from "react";
import { colors } from "theme/themeColors.config";
import cn from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useViewport, useCartItems } from "@common/hooks";
import { useState } from "react";
import { API_URL } from "@framework/const";
import { useStore } from "@common/state";
import addProductToCart from "./add-product-to-cart";
import updateCartV2 from "./update-cart-v2";
import { count } from "console";
import TagManager from "react-gtm-module";

interface Props {
  cartItem: CartItem;
  loading: boolean;
  onIncrement?: (product: Product) => void;
  onDecrement?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onWishListed?: (product: Product) => void;
  products: any;
  itemID: number;
}

const CartItemView: FunctionComponent<Props> = (props) => {
  const {
    cartItem,
    cartItem: { product, quantity },
    // loading,
    onDecrement = () => {},
    onIncrement = () => {},
    onDelete = () => {},
    onWishListed = () => {},
  }: any = props;

  const {
    setCartCount,
    cartCount,
    setGrandTotal,
    setGrandDecrement,
    gandTotalonDecrement,
    setProductQuant,
  } = useStore();
  const { t } = useTranslation();
  const { cart } = useCartItems();
  const { rtl } = useLangDirection();
  const { locale, defaultLocale } = useRouter();
  const [VIN, setVIN] = useState("");
  const [totalQuantity, setTotalQuantity] = useState<number | undefined>(
    quantity
  );
  const [labelBtn, setLabelBtn] = useState(false);
  const { breakpoint: bp } = useViewport();
  const cartID = useStore((state) => state.cartID);
  const [loading, setLoading] = useState(false);
  const [buttonAvailable, setButtonAvailable] = useState(false);
  const [singleClick, setSingleClick] = useState(0);

  async function addChassisNo(cartItem: CartItem, chassis_no: string) {
    try {
      var queryGet = `
        mutation {
          addChassisNumber( 
              input: {
                cartId : "${cart.id}"
                id: "${cartItem.id}"
                chassis_number: "${chassis_no}"
              }
            ) {
              message
              status
            }
         }     
       `;
      const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet }),

        headers: {
          "Content-Type": "application/json",
          Store: "ar",
        },
      });

      const data = await res.json();

      if (data.data.addChassisNumber.status == "true") {
        setLabelBtn(true);
      }
      return data;
    } catch (e) {
      console.log("ERROR 500");
      console.log("Exception", e);
    }
  }

  const token = localStorage.getItem("TOKEN")
    ? localStorage.getItem("TOKEN")
    : JSON.parse(localStorage.getItem("CUSTOMER_STATE") || "{}").token;

  const handledelete = () => {
    onDelete(props.itemID);
    addProductToCart({
      setLoading,
      cart,
      setTotalQuantity,
      setCartCount,
      setGrandTotal,
      product,
      count: 0,
    });
  };

  const handleIncrement = async () => {
    setProductQuant(true);
    const res = await addProductToCart({
      setLoading,
      cart,
      setTotalQuantity,
      setCartCount,
      setGrandTotal,
      product,
      count: 1,
    });
  };

  const handleDecrement = async () => {
    setProductQuant(false);
    const cartItems = await addProductToCart({
      setLoading,
      cart,
      setTotalQuantity,
      setCartCount,
      setGrandTotal,
      product,
      count: -1,
    });
    setLoading(true);
    TagManager.dataLayer({
      dataLayer: {
        event: "remove_from_cart",
        name: product.name,
        id: product.sku,
      },
    });
    const items = cartItems.data.addProductsToCart.cart.items;

    const selectedItem = items.filter(
      (item: any) => item.product.sku === product.sku
    )[0];

    const cartItemID = selectedItem.id;
    const updatedQuantity = selectedItem.quantity - 1;

    if (updatedQuantity < 1) {
      handledelete();
      setLoading(false);
      return;
    }

    const res = await updateCartV2({
      cart_item_id: cartItemID,
      quantity: updatedQuantity,
    });

    const data = await res.json();
    const newCartItems = data.data.updateCartItems.cart.items;
    const total_quantity = data.data.updateCartItems.cart.total_quantity;

    setCartCount(total_quantity);

    const newSelectedItem = newCartItems.filter(
      (item: any) => item.product.sku === product.sku
    )[0];
    setTotalQuantity(newSelectedItem.quantity);
    const decrementedPrice: number =
      data.data.updateCartItems?.cart.prices.subtotal_including_tax.value;

    setGrandTotal(decrementedPrice);
    // setGrandDecrement(decrementedPrice);

    setLoading(false);
  };
  return (
    <div
      className={cn(
        "bg-white w-full mb-3 p-3 flex flex-wrap relative animate__animated"
      )}
      style={{
        minHeight: "124px",
        borderRadius: "6px",
        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
      }}
    >
      <div
        className="absolute cursor-pointer"
        style={{ top: "22px", [rtl ? "left" : "right"]: "22px" }}
        onClick={handledelete}
      >
        {!loading ? <Cross stroke={colors.darkgrey} /> : ""}
      </div>

      {/* image */}
      <div
        className="relative"
        style={{
          width: "100px",
          height: "100px",
          borderRadius: "4px",
        }}
      >
        <Image
          src={`https://s3.me-south-1.amazonaws.com/images.rafraf.com/${product.image.url}`}
          layout="fill"
          objectFit="contain"
          alt={product.image.label || product.name}
        />
        {product.type ? (
          <div
            className={`capitalize absolute bottom-0 left-0 right-0 flex justify-center items-center text-sm ${
              product.type === "genuine"
                ? "bg-yellow text-black"
                : "bg-red text-white"
            }`}
            style={{
              height: "22px",
              borderBottomLeftRadius: "4px",
              borderBottomRightRadius: "4px",
            }}
          >
            {t(`common:${product.type}`)}
          </div>
        ) : (
          ""
        )}
      </div>

      {/* name & price */}
      <div className="w-44 md:w-80" style={{ margin: "13px 18px" }}>
        <A
          target="_blank"
          href={`${
            locale === defaultLocale ? "" : "/" + locale
          }/${product.url_key.replaceAll("/", "__")}`}
        >
          <div>{product.name}</div>
        </A>
        <div
          className="flex items-baseline"
          style={{ gap: "6px", marginTop: "6px" }}
        >
          <H5>
            {product.price_range.maximum_price.final_price?.value.toFixed(2) ||
              ""}{" "}
            {product.price_range.maximum_price.final_price?.currency || ""}
          </H5>
          {/* <div
            className="text-darkgrey line-through text-sm"
            style={{ lineHeight: "16px" }}
          >
            {product.price_range.maximum_price.regular_price?.value.toFixed(2) || ""}{" "}
            {product.price_range.maximum_price.regular_price?.currency || ""}
          </div> */}
          <div
            className="rounded-full flex items-center justify-center "
            style={{ height: "35px", width: "35px" }}
            onClick={() => onWishListed(product)}
          >
            {/* <Heart 
          values="lmfaop"
          style={{ transform: "scale(0.7) translateY(2px)" }} /> */}
          </div>
        </div>
        <div>
          <div className="flex flex-wrap gap-1   ">
            <div className="basis-1/2">
              <input
                type="text"
                style={{
                  marginTop: "6px",
                  width: `${bp === "sm" ? "205px" : "230px"}`,
                  fontSize: `${bp === "sm" ? "12px" : "13.5px"}`,
                }}
                placeholder={t("cart:addVin")}
                className=" rounded border-solid border-2 text-sm px-4 w-full"
                onChange={(e) => setVIN(e.target.value)}
              ></input>
            </div>
            <div className="basis-1/4">
              <button
                className="text-sm hover:underline disabled:text-darkgrey "
                style={{ marginTop: "6px" }}
                disabled={
                  VIN.length !== 17
                    ? true
                    : Boolean(VIN.match(/^[A-Za-z0-9_.]+$/))
                    ? false
                    : true
                }
                onClick={() => {
                  addChassisNo(cartItem, VIN);
                }}
              >
                {t("cart:check")}
              </button>
            </div>
          </div>

          {labelBtn ? (
            <div>
              <label className="text-green-500 text-sm">
                {" "}
                {t("cart:manually")}
              </label>
            </div>
          ) : (
            <>
              {/* {VIN ? <label className="text-red text-sm">{VIN.match(/^[A-Za-z0-9_.]+$/)? true : t("cart:validVin")}</label> : 
                ""
                } */}
            </>
          )}
          {/* </div> */}
        </div>
      </div>

      {/* controls */}
      <div className="flex-1 flex justify-end md:justify-center items-end md:items-center gap-6">
        <div
          className="bg-light-blue rounded-sm flex justify-around items-center w-14 md:w-24"
          style={{ height: "35px" }}
        >
          {loading ? (
            <Loading color="blue" size={5} />
          ) : (
            <>
              <span className="cursor-pointer" onClick={handleDecrement}>
                <Minus
                  color={colors.blue}
                  style={{ transform: "scale(0.625)" }}
                />
              </span>
              <span className="text-lg leading-5">{totalQuantity}</span>
              <span
                className="cursor-pointer"
                // onClickCapture={async (e) => {
                //   handleIncrement();
                //   e.preventDefault();
                //   setSingleClick(e.timeStamp);
                // }}
                onClick={handleIncrement}
              >
                <Plus
                  color={colors.blue}
                  style={{ transform: "scale(0.625)" }}
                />
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartItemView;
