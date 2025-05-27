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
import { A, H1, H3 } from "@components/typography";
import { useDispatch } from "react-redux";
import { Dispatch } from "@common/store";
import { WHATSAPP_LINK } from "@framework/const";

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
  const [error, setError] = useState<string>("")

  useEffect(() => {
    try {
      setError(router.query.message as string)
    }
    catch(e){
      console.log(e)
    }
  }, [router.query.message]);

  return (
    <Container style={{ backgroundColor: "#FAFAFA" }}>
      <H3 className="text-red p-10 flex justify-center items-center">
        {t("checkout:error")}
      </H3>
      <H3 className="text-red p-10 flex justify-center items-center">
        {error}
      </H3>

      <div className="flex justify-center items-center m-6">
        <A href={WHATSAPP_LINK} target="_blank">
          <div className="h-20 w-20 relative p-6">
            <Image src={"/images/whatsapp.webp"} />
          </div>
        </A>
      </div>
    </Container>
  );
}

CheckoutResult.Layout = Layout;
