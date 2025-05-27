import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from "next";
import { useRouter } from "next/router";

import { Layout } from "@components/common";
import { getConfig } from "@framework/api/config";
import { getCategories } from "@framework/categories";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { getProduct, getProductByPartnumber } from "@framework/product";
import { ProductView } from "@components/product";
import { Category } from "@common/types/category";
import { Product } from "@common/types/product";
import getProductsByOem from "@framework/product/get-products-by-oem";
import { unwatchFile } from "fs";
import { escape } from "querystring";
import { BASE_URL } from "@framework/const";
import TagManager from "react-gtm-module";
import { useEffect } from "react";

interface Props {
  categories: Category[];
  product: Product | null;
  alternatives: Product[];
}

export async function getStaticPaths() {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  try {
    const config = getConfig({ locale: context.locale || "ar" });
    const categoriesPromise = getCategories(config, CATEGORIES_ROOT_ID);

    const partSlug = context.params?.partSlug as string;

    const productPromise = getProduct({
      apiConfig: config,
      variables: { slug: partSlug },
    });

    const [categories, product] = await Promise.all([
      categoriesPromise,
      productPromise,
    ]);
    if (!product) {
      try {
        const tempConfig = getConfig({
          locale: config.locale === "en" ? "ar" : "en",
        });

        const productPromise = getProduct({
          apiConfig: tempConfig,
          variables: { slug: partSlug },
        });

        const [product] = await Promise.all([productPromise]);
        if (product?.sku) {
          const config_convert = getConfig({
            locale: config.locale === "ar" ? "en" : "ar",
          });
          const productPromise_en = getProductByPartnumber({
            apiConfig: config_convert,
            variables: { sku: product?.sku },
          });

          const [productEn] = await Promise.all([productPromise_en]);
          const config_convert_2 = getConfig({ locale: config.locale });
          if (productEn?.slug) {
            return {
              redirect: {
                destination: `${BASE_URL}/${config_convert_2.locale}/${escape(
                  productEn?.slug
                )}`,
                permanent: false,
              },
            };
          }
        } else {
          return {
            redirect: {
              destination: context.locale + "/404",
              permanent: false,
            },
          };
        }
      } catch (e) {}
    }

    const alternatives = await getProductsByOem({
      apiConfig: config,
      variables: { oem: product?.oem || "0" },
    });

    return {
      props: {
        categories,
        product,
        alternatives,
      },
      revalidate: 60 * 60 * 24,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default function Part({
  categories,
  product,
  alternatives,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const router = useRouter();

  useEffect(() => {
    TagManager.dataLayer({
      dataLayer: {
        event: "view_item",
        name: product?.name,
        id: product?.sku,
      },
    });
  }, []);

  return (
    <>
      {product && <ProductView product={product} alternatives={alternatives} />}
    </>
  );
}

Part.Layout = Layout;
