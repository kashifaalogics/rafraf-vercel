import { CartItem } from "@common/types/cart";
import { Product } from "@common/types/product";
import { Cross, Heart, Minus, Plus } from "@components/icons";
import { A, H5 } from "@components/typography";
import { Image, Link, Loading, Button } from "@components/ui";
import useLangDirection from "@utils/language/useLangDirection";
import { FunctionComponent } from "react";
import { colors } from "theme/themeColors.config";
import cn from "classnames";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { useSearchEngine, useCustomer, useViewport, useCartItems } from "@common/hooks";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { VIN_COMPATABLE_API } from "@framework/const";
import { API_URL } from "@framework/const";

interface Props {
  cartItem: CartItem;
  loading: boolean;
  onIncrement?: (product: Product) => void;
  onDecrement?: (product: Product) => void;
  onDelete?: (product: Product) => void;
  onWishListed?: (product: Product) => void;
}

const CartItemView: FunctionComponent<Props> = (props) => {
  const {
    cartItem,
    cartItem: { product, quantity },
    loading,
    onDecrement = () => {},
    onIncrement = () => {},
    onDelete = () => {},
    onWishListed = () => {},
  } = props;
  
  const { t } = useTranslation();
  const { cart, address, addToCart } = useCartItems();
  const { rtl } = useLangDirection();
  const { locale, defaultLocale } = useRouter();
  const [VIN, setVIN] = useState("");
  const [compatable, setCompatable] = useState("");
  const [labelBtn, setLabelBtn] = useState(false);
  const [apiLoading, setApiLoading] = useState(false);
  const IDs = product?.categories?.map((e) => e.id);
  const { recordAnalytic, searchCookie } = useSearchEngine();
  const { customer } = useCustomer();
  const { breakpoint: bp } = useViewport();
  
  async function addChassisNo(cartItem : CartItem , chassis_no : string) {
      try {
        var queryGet =  `
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
           body: JSON.stringify({ query: queryGet
            }),
     
           headers: {
             "Content-Type": "application/json",
             "Store" : "ar",
           },
         });
         
         const data = await res.json();
         if(data.data.addChassisNumber.status == "true"){
          setLabelBtn(true);
         }           
     }  
       catch(e) {
         console.log('ERROR 500')
         console.log( "Exception", e)
       }
  }

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
        onClick={() => onDelete(product)}
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
          src={product.images[0].url}
          layout="fill"
          objectFit="contain"
          alt={product.images[0].alt || product.name}
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
          href={`${locale === defaultLocale ? "" : "/" + locale}/${
            product.slug
          }`}
        >
          <div>{product.name}</div>
        </A>
        <div
          className="flex items-baseline"
          style={{ gap: "6px", marginTop: "6px" }}
        >
          <H5>
            {product.price.final?.value.toFixed(2) || ""}{" "}
            {product.price.final?.currencyCode || ""}
          </H5>
          <div
            className="text-darkgrey line-through text-sm"
            style={{ lineHeight: "16px" }}
          >
            {product.price.regular?.value.toFixed(2) || ""}{" "}
            {product.price.regular?.currencyCode || ""}
          </div>
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
                    disabled={ VIN.length !== 17 ? true : Boolean(VIN.match(/^[A-Za-z0-9_.]+$/))? false : true }
                    onClick={() => {
                      addChassisNo(cartItem,VIN);
                      // recordAnalytic({
                      //   email: customer?.email || "",
                      //   name: `${customer?.firstname || ""} ${
                      //     customer?.lastname || ""
                      //   }`.trim(),
                      //   searched_query: VIN,
                      //   userID: searchCookie,
                      //   results_clicked_on: product.sku,
                      //   language: locale || "",
                      //   part_number: "",
                      //   behavior: "VIN comp cart page",
                      // });
                      // const CART_ITEMS = JSON.parse(
                      //   localStorage.getItem("CART_ITEMS") || "[]"
                      // );
                      // localStorage.setItem(
                      //   "CART_ITEMS",
                      //   JSON.stringify([
                      //     ...CART_ITEMS,
                      //     { VIN: VIN, SKU: product.sku, API: "other" },
                      //   ])
                      // );
                    }}
                  >
                    {t("cart:check")}
                  </button>
                </div>
              </div>
              
          {/* {product.manufacturer === "Toyota" ||
          product.manufacturer === "Hyundai" ? (
            <>
              <div><label>{t("cart:addVin")}</label></div>

              <div className="flex flex-wrap gap-1 ">
                <div className="basis-1/2">
                  <input
                    type="text"
                    placeholder={t("cart:addVin")}
                    className=" rounded border-solid border-2 text-sm px-4 w-full"
                    style={{
                      marginTop: "6px",
                      width: `${bp === "sm" ? "205px" : "230px"}`,
                      fontSize: `${bp === "sm" ? "12px" : "13.5px"}`,
                    }}
                    onChange={(e) => setVIN(e.target.value)}
                  ></input>
                </div>
                <div className="basis-1/4">
                  <button
                    className="text-sm hover:underline disabled:text-darkgrey "
                    style={{ marginTop: "6px" }}
                    disabled={VIN.length !== 17 ? true : Boolean(VIN.match(/^[A-Za-z0-9_.]+$/))? false : true}
                    onClick={async (e) => {
                      e.preventDefault();
                      setApiLoading(true);
                      // try {
                      //   const res = await fetch(
                      //     `${VIN_COMPATABLE_API}/Multi_EPCs_Cheker.php?vin=${VIN}&pn=${product.sku}`,
                      //     {
                      //       method: "GET",
                      //       headers: {},
                      //     }
                      //   );
                      //   const data = await res.json();
                      //   setApiLoading(false)
                      //   // Set API Loading = false
                      //   setCompatable(data.Compatable); //setSubcat(x)
                      //   let comp = "";
                      //   if (data.Compatable === "True") {
                      //     comp = "HT_Compatable";
                      //   } else {
                      //     comp = "HT_notCompatable";
                      //   }
                      //   const CART_ITEMS = JSON.parse(
                      //     localStorage.getItem("CART_ITEMS") || "[]"
                      //   );
                      //   localStorage.setItem(
                      //     "CART_ITEMS",
                      //     JSON.stringify([
                      //       ...CART_ITEMS,
                      //       { VIN: VIN, SKU: product.sku, API: comp },
                      //     ])
                      //   );
                      // }
                      // catch(e) {
                      //   console.log('ERROR 500')
                      //   console.log(e)
                      // }
                      
                    }}
                  >
                    {t("cart:checking")}
                  </button>
                </div>

                <div className="basis-1/4 mt-1">
                  {apiLoading? 
                  <>
                     <label className="text-black-500 text-sm py-4">
                     {t("cart:loading")}
                     </label>
                    
                    <svg role="status" className="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-3 " viewBox="0 0 100 101" fill="blue" xmlns="http://www.w3.org/2000/svg">
                      <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                      <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                    </svg>
                    </>
                  : compatable === "True" ? (
                    <label className="text-green-500 text-sm py-4 ">
                      {t("cart:compatable")}
                    </label>
                  ) : compatable === "False" ? (
                    <label className="text-red text-sm">
                      {t("cart:notCompatable")}
                    </label>
                  ) : (
                    <></>
                  )}
                  {VIN ? <label className="text-red text-sm">{VIN.match(/^[A-Za-z0-9_.]+$/)? true : t("cart:validVin")}</label> : 
                    ""
                  }

                </div>
              </div>
            </>
          ) : IDs?.includes("7442") || IDs?.includes("9524") ? (
            // Noting will appear for Oils and filters
            <></>
          ) : (
            <>
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
                    disabled={ VIN.length !== 17 ? true : Boolean(VIN.match(/^[A-Za-z0-9_.]+$/))? false : true }
                    onClick={() => {
                      setLabelBtn(true);
                      recordAnalytic({
                        email: customer?.email || "",
                        name: `${customer?.firstname || ""} ${
                          customer?.lastname || ""
                        }`.trim(),
                        searched_query: VIN,
                        userID: searchCookie,
                        results_clicked_on: product.sku,
                        language: locale || "",
                        part_number: "",
                        behavior: "VIN comp cart page",
                      });
                      const CART_ITEMS = JSON.parse(
                        localStorage.getItem("CART_ITEMS") || "[]"
                      );
                      localStorage.setItem(
                        "CART_ITEMS",
                        JSON.stringify([
                          ...CART_ITEMS,
                          { VIN: VIN, SKU: product.sku, API: "other" },
                        ])
                      );
                    }}
                  >
                    {t("cart:check")}
                  </button>
                </div>
              </div> </>*/}
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
            <Loading color="blue" />
          ) : (
            <>
              <span
                className="cursor-pointer"
                onClick={() => onDecrement(product)}
              >
                <Minus
                  color={colors.blue}
                  style={{ transform: "scale(0.625)" }}
                />
              </span>
              <span className="text-lg leading-5">{quantity}</span>
              <span
                className="cursor-pointer"
                onClick={() => onIncrement(product)}
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
