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
import { useEffect, useMemo } from "react";
import { H1, H3, H5 } from "@components/typography";
import { useDispatch } from "react-redux";
import { Dispatch } from "@common/store";

interface Props {
  categories: Category[];
}

export async function getServerSideProps(
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
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default function CheckoutResult({
  categories,
}: InferGetStaticPropsType<typeof getServerSideProps>) {
  const { t } = useTranslation();
  const router = useRouter();
  const { cart } = useDispatch<Dispatch>();

  useEffect(() => {
    cart.reset();
  }, []);

  return (
    <Container style={{ backgroundColor: "#FAFAFA" }}>
      <div className="flex flex-col justify-center items-center p-10 gap-10">
        <div className="h-28 w-48 relative">
          <Image src="/images/payment-success.png" />
        </div>

        <H3 className="text-green-700">{t("checkout:success")}</H3>
        <H5 className="text-green-700">{router.query.orderId}</H5>

        <Button className="p-4" onClick={() => router.push("/")}>
          {t("common:goToHome")}
        </Button>
      </div>
    </Container>
  );
}

CheckoutResult.Layout = Layout;
