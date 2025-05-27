import { useCartItems } from "@common/hooks";
import { Category } from "@common/types/category";
import { CartEmptyView, CartLoadingView, CartView } from "@components/cart";
import { Layout } from "@components/common";
import { H2 } from "@components/typography";
import { Container } from "@components/ui";
import { getConfig } from "@framework/api/config";
import { getCategories } from "@framework/categories";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useEffect } from "react";
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

export default function Cart({
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const { cartItems, getCartLoading } = useCartItems();

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: "view_cart",
      },
    });
  }, []);
  
  return (
    <>
      <Head>
        <link rel="canonical" href="https://rafraf.com/ar/cart" />
        <title>
          {t("cart:title")} | {t("common:rafraf")}
        </title>
      </Head>
      <Container>
        <H2 className="mt-10 mb-6">{t("cart:title")}</H2>
        {getCartLoading ? (
          <CartLoadingView getCartLoading={getCartLoading} />
        ) : cartItems.length < 1 ? (
          <CartEmptyView cartItems={cartItems} />
        ) : (
          <CartView setloading={undefined} cart={undefined} setTotalQuantity={undefined} setCartCount={undefined} product={undefined} count={0} />
        )}
      </Container>
    </>
  );
}

Cart.Layout = Layout;
