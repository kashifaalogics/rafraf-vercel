import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from "next";
import useTranslation from "next-translate/useTranslation";

import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { Layout } from "@components/common";
import { getConfig } from "@framework/api/config";
import { getCategories, getCategoriesTree } from "@framework/categories";
import { getAllProducts } from "@framework/product";
import { Container } from "@components/ui";
import { Button, Input } from "@components/ui";
import Head from "next/head";
import { Category } from "@common/types/category";
import { ProductsList } from "@common/types/product";
import { H1, H4 } from "@components/typography";
import { PrivacyTool, AccountLayout } from "@components/account";
import { useUI } from "@components/ui/constext";
import ChangePasswordForm from "@components/account/ChangePasswordForm";
import { API_URL, BASE_URL } from "@framework/const";
import { useAuth, useCustomer } from "@common/hooks";

interface Props {
  categories: Category[];
  categoriesTree: Category[];
}

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

  const { customer, updateCustomerInfo, updateCustomerInfoLoading } =
  useCustomer();


  const deleteAccount = async () => {
   
    var myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');
    //myHeaders.append("Cookie", "PHPSESSID=2dl0skmjc27d4jkr314fm8vgh4");
    

    
    const res = await fetch(`${API_URL}/rest/V1/deletecustomer/${customer?.email}`, {
      method: 'delete',
      headers: myHeaders
    });

    const token = await res.json()

    if(token){
      window.location.replace(`${BASE_URL}?deleted=true`);
    }

    //const data = await res.json();

    //console.log("Data" , data); 
  };

  return (
    <>
      <Head>
        <title>{t("common:myAccount")} | {t("common:rafraf")}</title>
      </Head>     
      <Container className="py-5">
        <H4>{t("account:PrivacyTool")}</H4>
        <AccountLayout active="PrivacyTool">
                <PrivacyTool />
        </AccountLayout>
      </Container>
    </>
  );
}

AccountInfo.Layout = Layout;
