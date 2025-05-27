import { Layout } from "@components/common";
import { Button, Container, Image } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import { Category } from "@common/types/category";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { getConfig } from "@framework/api/config";
import { getCategories } from "@framework/categories";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { A, H1, H3, H5 } from "@components/typography";
import { useDispatch } from "react-redux";
import { Dispatch } from "@common/store";
import { WHATSAPP_LINK } from "@framework/const";
import { useSearchEngine, useCustomer, useCartItems } from "@common/hooks";
import TagManager from "react-gtm-module";

interface Props {
  categories: Category[];
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  try {
    const config = getConfig({ locale: context.locale || "ar" });
    const categoriesPromise = getCategories(config, CATEGORIES_ROOT_ID);
    const [categories] = await Promise.all([categoriesPromise]);  
    return {
      props: {
        categories,
      },
      revalidate: 60 * 60 * 24,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default function CheckoutResult({
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const router = useRouter();
  const { cart } = useDispatch<Dispatch>();
  const { customer } = useCustomer();
  const { cartItems } = useCartItems();
  const [error, setError] = useState<string>("")
  const status = useMemo(() => router.query.status || "paid", [router.query, cartItems]);
  const { recordAnalytic, searchCookie } = useSearchEngine();
  


  useEffect(() => {
    if (cartItems.length){
      try {
        const cartState = JSON.parse(localStorage.getItem("CART_STATE") || "")

        if (cartState) {
          const shippingAddress = cartState?.cart?.shippingAddresses[0]
          const email = cartState?.cart?.email
          const fullName = shippingAddress.firstname + " " + shippingAddress.lastname
          const city = shippingAddress.city
          const phone = shippingAddress.telephone
    
          const req = async () => {
            await fetch("https://pythondata.rafraf.com/gs",
              {
                method: "POST",
                body: JSON.stringify({
                  "from": phone,
                  "timestamp": Date.now()/1000,
                  "city": city,
                  "email": email,
                  "fullName": fullName,
                  "orderNumber": String(router.query.incrementOrderID)
                }),
                headers: { "content-type": "application/json" },
              }
            );
          }
          req();
        }
    
        const SKUsArray = cartItems.map((item) => item.product.sku);
        const CART_ITEMS_LOCAL = JSON.parse(
          localStorage.getItem("CART_ITEMS") || "[]"
        );
    
        const record = () =>
          CART_ITEMS_LOCAL.map((i: { [x: string]: any }) => {
            if (SKUsArray.includes(i["SKU"])) {
              recordAnalytic({
                email: customer?.email || "",
                name: `${customer?.firstname || ""} ${
                  customer?.lastname || ""
                }`.trim(),
                searched_query: i["VIN"],
                userID: searchCookie,
                results_clicked_on: i["SKU"],
                language: i["API"],
                part_number: String(router.query.incrementOrderID),
                behavior: "VIN comp",
              });
            }
          });
        record();
        localStorage.setItem("CART_ITEMS", JSON.stringify([]))
      }
      catch(e){
        console.log(e)
      }
      if (status === "paid") {
        cart.reset();
        TagManager.dataLayer({
          dataLayer: {
            event: "purchase",
            transaction_id: String(router.query.incrementOrderID),
            currency: "SAR",
          }
        })
      }  
    }
  }, [cartItems, status]);


  useEffect(() => {
      if (status === "paid") {
        cart.reset();
      }  
  }, [status])


  useEffect(() => {
    try {
      setError(t(`checkout:${router.query.message as string}`))
    }
    
    catch(e){
      setError( router.query.message as string );
      console.log(e)
    }
  }, [router.query.message]);

  return (
    <Container style={{ backgroundColor: "#FAFAFA" }}>
      {status === "paid" ? (
        <Container style={{ backgroundColor: "#FAFAFA" }}>
          <div className="flex flex-col justify-center items-center p-10 gap-10">
            <div className="h-28 w-48 relative">
              <Image src="/images/payment-success.png" />
            </div>

            <H3 className="text-green-700">{t("checkout:success")}</H3>
            <H5 className="text-green-700">{router.query.incrementOrderID}</H5>

            <Button className="p-4" onClick={() => router.push("/")}>
              {t("common:goToHome")}
            </Button>
          </div>
        </Container>
      ) : (
        <Container style={{ backgroundColor: "#FAFAFA" }}>
          <H3 className="text-red p-10 flex justify-center items-center">
            {t("checkout:error")}
          </H3>
          <H3 className="text-red p-10 flex justify-center items-center">
            { error }
          </H3>

          <div className="flex justify-center items-center m-6">
            <A href={WHATSAPP_LINK} target="_blank">
              <div className="h-20 w-20 relative p-6">
                <Image src={"/images/whatsapp.webp"} />
              </div>
            </A>
          </div>
        </Container>
      )}
    </Container>
  );
}

CheckoutResult.Layout = Layout;
