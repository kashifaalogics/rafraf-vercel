import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from "next";
import useTranslation from "next-translate/useTranslation";

import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { Layout } from "@components/common";
import { getConfig } from "@framework/api/config";
import { getCategories, getCategoriesTree } from "@framework/categories";
import { Accordion, Container } from "@components/ui";

import Head from "next/head";
import { Category } from "@common/types/category";
import { H4, H2 } from "@components/typography";
import { useCustomer } from "@common/hooks";
import { AccountLayout } from "@components/account";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API_URL } from "@framework/const";
interface Props {
  categories: Category[];
  categoriesTree: Category[];
}

const statusColor: any = {
  بالانتظار: "bg-grey",
  "قيد المعالجة": "bg-yellow",
  "": "bg-black",
  Canceled: "bg-red",
  Complete: "bg-green-500",
};

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  const apiConfig = getConfig({ locale: context.locale || "ar" });
  const categoriesPromise = getCategories(apiConfig, CATEGORIES_ROOT_ID);

  const categoriesTreePromise = await getCategoriesTree(
    apiConfig,
    CATEGORIES_ROOT_ID
  );

  const [categories, categoriesTree] = await Promise.all([
    categoriesPromise,
    categoriesTreePromise,
  ]);

  return {
    props: {
      categories,
      categoriesTree,
    },
    revalidate: 60 * 60 * 24,
  };
}

export default function AccountInfo({
  categories,
  categoriesTree,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const { customer } = useCustomer();
  const router = useRouter();
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [emptyOrders, setEmptyOrders] = useState(false);
  const [orders, setOrders] = useState([
    {
      id: "",
      invoice_id: "",
      status: "",
      orderNumber: "",
      date: "",
      items: [
        {
          type: "",
          productName: "",
          productSku: "",
          productUrlKey: "",
        },
      ],
      total: {
        currency: "SAR",
        value: 0,
      },
    },
  ]);

  const OrdersEmpty = () => (
    <label className="text-black-500 text-sm py-4">لا يوجد طلبات</label>
  );

  const LoadingIcon = () => (
    <div className="grid place-content-center">
      <label className="text-black-500 text-sm py-4">Loading</label>

      <svg
        role="status"
        className="inline w-9 h-9 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600 mx-3 "
        viewBox="0 0 100 101"
        fill="blue"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
    </div>
  );
  async function getOrders(locale: string) {
    try {
      var queryGet = `
          query {
            customerOrders {
              items {
                order_number
                id      
                created_at
                grand_total
                status
                
              }
            }
          }
        `;
      const currentToken = JSON.parse(
        window.localStorage.getItem("CUSTOMER_STATE") || "{}"
      );

      const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet, locale: "ar" }),

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${currentToken.token}`,
        },
      });

      const Orders = await res.json();
      // console.log("Orders Response --->",Orders.data.customerOrders);
      if (Orders.data.customerOrders.items.length === 0) {
        setEmptyOrders(true);
        return;
      }
      const array = Orders.data.customerOrders.items.map((item: any) => { 
        return {
          invoice_id: item.invoice_id,
          id: item.id,
          status: item.status,
          orderNumber: item.order_number,
          date: item.created_at,
          total: {
            currency: "SAR",
            value: item.grand_total,
          },
        };
      });
      setOrders(array);

      array.map(async (item:any) => {
        queryGet = `mutation{
          getInvoice(
          input:{
            order_id: "${item.id}"   
          }
          ){
            invoice_id
            status
          }
        }`;
        const response = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet, locale: "ar" }),

        headers: {
        "Content-Type": "application/json",
        },
        });
        const Invoice = await response.json();
        console.log("invoice", item.id);
        item.invoice_id = Invoice.data.getInvoice.invoice_id
      });
      setOrders(array);

    } catch (e) {
      console.log("ERROR 500");
      console.log(e);
    }
  }


  useEffect(() => {
    const token = JSON.parse(
      localStorage.getItem("CUSTOMER_STATE") || ""
    ).token;

    getOrders("ar");
    setOrdersLoading(false);
  }, []);
  
  
 const [reloadCounter, setReloadCounter] = useState(0);
 useEffect(() => {
  const interval = setInterval(() => {
    setReloadCounter(reloadCounter + 1);
  }, 2000);
  return () => {
    clearInterval(interval);
  };
}, [reloadCounter]);


  return (
    <>
      <Head>
        <title>
          {t("common:myAccount")} | {t("account:myOrders")} |{" "}
          {t("common:rafraf")}
        </title>
      </Head>

      <Container className="py-5 orders_page">
        <H4>{t("account:myOrders")}</H4>
        <AccountLayout active="orders">
        {/* <H2 className="mb-8">{t("account:myOrders")}</H2> */}

          <div className="tableOrder">
          <div className="tableHead mb-2">
        <div className="p-1">
                <div>
                  <div className="rounded w-full flex-1">
                    <div className="w-full flex justify-between flex-1 py-2 px-4">
                      <div className="font-bold col_width">{t("account:orderNumber")}</div>
                      <div className="font-bold col_width">{t("account:Date")}</div>
                      <div className="font-bold col_width">{t("account:orderTotal")}</div>
                      <div className="font-bold col_width">{t("account:status")}</div>
                      <div className="font-bold col_width">{t("account:GetInvoice")}</div>
                    </div>
                  </div>
                </div>
              </div>
        </div>
          {/* {ordersLoading ? (
            <LoadingIcon />
          ) : emptyOrders ? (
            <OrdersEmpty />
          ) : (
            orders[0].orderNumber &&
            orders.map((o, i) => (
              <div key={i} className="p-1">
                <div
                  className="rounded-md"
                >
                  <div className="rounded w-full flex-1">
                    <div className="w-full flex justify-between flex-1 py-2 px-4">
                      <div className="font-light col_width">#{o.orderNumber}</div>
                      <div className="font-light col_width">{o.date}</div>
                      <div className="font-light col_width">
                        {o.total.value?.toFixed(2)} {o.total.currency}
                      </div>
                      <div className="font-light col_width">
                        {o.status == "pending" ? "تحت الإجراء" : (o.status == "completed" ? "مكتمل" : "ملغي")}
                        </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )} */}
           {ordersLoading? <LoadingIcon /> : emptyOrders? <OrdersEmpty /> : 
          orders[0].orderNumber && orders.map((o, i) => (
            <div key={i} className="p-1 tableContent">
              <div
                className="rounded-md"
                style={{ boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)" }}
              >
                <Accordion
                  className="rounded w-full flex-1"
                  label={
                    <div className="w-full flex justify-between flex-1">
                      <div
                        className={`w-1 ${statusColor[o.status]} rounded-full`}
                      ></div>
                      <div className="font-light col_width">#{o.orderNumber}</div>
                      <div className="font-light col_width">{o.date}</div>
                      <div className="font-light col_width">
                        {o.total.value?.toFixed(2)} {o.total.currency}
                      </div>

                      <div className="font-light col_width">
                      {
                       ( o.status == "pending" ?  t("account:pending") : 
                        (o.status == "complete" ? t("account:completed") :  
                        (o.status == "processing" ? t("account:processing") : 
                        (o.status == "closed" ? t("account:processing") : t("account:cancelled") ) )))
                      }
                      </div>
                      
                      <div className="font-light col_width">
                        {o.invoice_id ? <a href={`${API_URL}/pdf_invoice_frontend/invoice/pdfdownload?invoice_id=${o.invoice_id}`} download="FileName">{t("account:GetInvoice")}</a> : ""}
                      </div>
                      {/* <div className="font-light col_width">
                        {o.invoice_id === undefined ? " " 
                        : <a href={`${API_URL}/pdf_invoice_frontend/invoice/pdfdownload?invoice_id=${o.invoice_id}`} download="FileName">{t("account:GetInvoice")}</a>}
                      </div> */}
                    </div>
                  }
                >
                  <div>
                    <div className="flex w-full justify-between border-b-2 p-2">
                      <div>{t("account:productName")}</div>
                      <div>{t("account:productSku")}</div>
                    </div>
                    {/* {o.items.map((it, i) => (
                      it.type !== "configurable" && <div
                        key={i}
                        className="flex w-full justify-between border-b-2 p-2 hover:bg-grey-op-20 font-bold"
                      >
                        <div>{it.productName}</div>
                        <div>{it.productSku}</div>
                      </div>
                    ))} */}
                  </div>
                </Accordion>
              </div>
            </div>
          ))}

          </div>

          


        </AccountLayout>
      </Container>
    </>
  );
}

AccountInfo.Layout = Layout;
