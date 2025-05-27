import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from "next";
import { Button, Image } from "@components/ui";
import { Layout } from "@components/common";
import { Container } from "@components/ui";
import useTranslation from "next-translate/useTranslation";

import { getConfig } from "@framework/api/config";
import { getCategories, getStaticCategories } from "@framework/categories";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { getAllProducts } from "@framework/product";
import { Category } from "@common/types/category";
import { ProductsList } from "@common/types/product";
import { H3 } from "@components/typography";
import { useRouter } from "next/router";
import Head from "next/head";

const svg404 = "/images/404.svg";

interface Props {
  categories: Category[];
  products: ProductsList;
}
export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  const config = getConfig({ locale: context.locale || "ar" });
  const productsPromise = getAllProducts(config, { search: "فلتر زيت" });
  const [products] = await Promise.all([
    productsPromise,
  ]);
  const categories = getStaticCategories({locale: config.locale})
  return {
    props: {
      categories,
      products,
    },
    revalidate: 60 * 60 * 24,
  };
}

export default function NotFound({
  categories,
  products,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <>
    <Head>
      <title>{t("common:notFound")} | {t("common:rafraf")}</title>
    </Head>
      <Container el="section">
        <div className="relative h-52">
          <Image src={svg404} layout="fill" objectFit="scale-down" />
        </div>
        <div className="flex justify-center items-center flex-col gap-4 p-5">
          <H3>{t("common:notFound")}</H3>
          <Button className="p-3" onClick={() => router.push("/")}>{t("common:goToHome")}</Button>
        </div>
        
      </Container>
    </>
  );
}

NotFound.Layout = Layout;
