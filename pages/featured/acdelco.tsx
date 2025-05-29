import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { ProductCard, ProductCardSkeleton } from "@components/product";
import { Container, Image } from "@components/ui";
import { API_URL } from "@framework/const";
import useLangDirection from "@utils/language/useLangDirection";
import { getAcdelcoQuery } from '@framework/utils/graphql';
import ProductCardv2 from "@components/product/productCardv2";
import { Layout } from "@components/common";
import { GetStaticProps } from 'next';

interface Product {
  id: string;
  name: string;
  sku: string;
  __typename: string;
  image: { url: string };
  price_range: {
    maximum_price: {
      regular_price: {
        currency: string;
        value: number;
      };
    };
  };
}

interface ACDelcoProps {
  products: Product[];
  error?: string;
}

const ACDelco: React.FC<ACDelcoProps> = ({ products, error }) => {
  const { t } = useTranslation();
  const dir = useLangDirection();
  const router = useRouter();

  return (
    <Layout categories={[]}>
      <Head>
        <meta name="description" content={t("common:rafraf")} />
        <meta name="keywords" content="" />
        <link
          rel="canonical"
          href={`https://rafraf.com/${dir.rtl ? "ar" : "en"}${router.asPath}`}
        />
        <title>{t("common:rafraf")}</title>
      </Head>
      <Container>
        <div className="block md:grid md:grid-cols-2 pt-2">
          <div className={`col-span-3 relative ${dir.rtl ? "pr-5" : "pl-5"}`}>
            <div className={`flex flex-wrap gap-7 justify-${products.length > 0 ? "start" : "center"} relative my-5`}>
              {error ? (
                <div className="text-red-500 text-center w-full">
                  {error}
                </div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div className="flex-1" key={product.id}>
                    <ProductCardv2 product={product} />
                  </div>
                ))
              ) : (
                <div className="justify-items-center justify-center relative">
                  <div className="text-gray-400 justify-center text-center text-2xl mb-8 font-bold left-0">
                    {t("product/listing:productNotFound")}
                  </div>
                  <div>
                    <Image src="/images/notFoundImage.svg" alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
  );
};

export const getStaticProps: GetStaticProps<ACDelcoProps> = async () => {
  try {
    const response = await fetch(`${API_URL}/graphql`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query: getAcdelcoQuery }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }

    const data = await response.json();
    const products = data?.data?.products?.items || [];

    return {
      props: {
        products,
      },
      // Revalidate every hour
      revalidate: 3600,
    };
  } catch (err) {
    console.error("Error fetching ACDelco products:", err);
    return {
      props: {
        products: [],
        error: "Failed to load products. Please try again later.",
      },
      // Revalidate every minute if there was an error
      revalidate: 60,
    };
  }
};

export default ACDelco;
