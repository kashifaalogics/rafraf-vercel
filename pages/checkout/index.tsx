import { useAuth, useCartItems, useCustomer } from "@common/hooks";
import { Layout } from "@components/common";
import { H2, H4, Label } from "@components/typography";
import { Container, Loading } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import {
  AddressForm,
  CreditCardForm,
  OrderSummary,
  CreditAddressForm,
} from "@components/checkout";
import { Category } from "@common/types/category";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetStaticPropsType,
} from "next";
import { getConfig } from "@framework/api/config";
import { getCategories } from "@framework/categories";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { getCartV2 } from "@common/hooks/z-hooks";
import { useStore } from "@common/state";
import TagManager from "react-gtm-module";
import { useEffect } from "react";

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

export default function Checkout({
  categories,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const { cartItemsV8, loading, error, showPopup }: any = getCartV2();

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: "begin_checkout",
      },
    });
  }, []);

  return (
    <div style={{ backgroundColor: "#FAFAFA" }}>
      <Head>
        <title>
          {t("checkout:title")} | {t("common:rafraf")}
        </title>
      </Head>
      <Container className="p-2 pb-10 min-height">
        <H2 className="my-6">{t("checkout:title")}</H2>
        <div className="flex flex-wrap gap-8">
          
          <div className="md:flex-1 order-2 md:order-1 grid">
            <div>
              <div
                className="bg-white p-8 pb-60 rounded"
                style={{ boxShadow: "0px -4px 17px rgba(0, 0, 0, 0.06)" }}
              >
                <CreditAddressForm cartV2={cartItemsV8} loadingV2={loading} />
              </div>
            </div>
          </div>

          {/* summary */}
          <div className="flex-1 order-1 md:order-2">
            <div
              className="bg-white rounded"
              style={{ boxShadow: "0px 4px 17px rgba(0, 0, 0, 0.06)" }}
            >
              <OrderSummary cart={cartItemsV8} loading={loading} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

Checkout.Layout = Layout;
