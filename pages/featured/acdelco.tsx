import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import useTranslation from "next-translate/useTranslation";
import { ProductCard, ProductCardSkeleton } from "@components/product";
import { Accordion, Container, NeImage, Pill } from "@components/ui";
import { API_URL, IMAGES_STORAGE_URL } from "@framework/const";
import { range } from "@utils/common";
import useLangDirection from "@utils/language/useLangDirection";
import { getAcdelcoQuery } from '@framework/utils/graphql';
import ProductCardv2 from "@components/product/productCardv2";
import { Layout } from "@components/common";
import Timer from "@components/ui/Timer";

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


const ACDelco: React.FC = () => {
  const { t } = useTranslation();
  const dir = useLangDirection();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
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
      const productItems = data?.data?.products?.items || [];

      setProducts(productItems);
      setIsLoading(false);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);
  

  

  return (
    <>
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
          <div className="justify-items-center pt-6">
          {/* <Timer/> */}
          </div>
      <Container>
        <div className="block md:grid md:grid-cols-2 pt-2">
          {/* <Accordion label={t("product/listing:filters")} open={false} /> */}
          <div className={`col-span-3 relative ${dir.rtl ? "pr-5" : "pl-5"}`}>
            {/* <div className="border-b-2 mb-5 flex justify-between">
              <div>
                <label htmlFor="">{t("product/listing:sortBy")}</label>
                <select name="sortBy" className="bg-transparent" onChange={(e) => {}}></select>
              </div>
            </div> */}
            {/* <div className="flex gap-2 flex-wrap">
              <Pill label="Filter 1" value="1" onRemove={() => {}} />
            </div> */}
            <div className={`flex flex-wrap gap-7 justify-${products.length > 0 ? "start" : "center"} relative my-5`}>
              {isLoading ? (
                range({ e: 9 }).map((i) => (
                  <div className="flex-1" key={i}>
                    <ProductCardSkeleton />
                  </div>
                ))
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
                    <img src="/images/notFoundImage.svg" alt="" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Layout>
    </>
  );
};

export default ACDelco;
