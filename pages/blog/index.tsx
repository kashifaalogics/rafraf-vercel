import { Category } from "@common/types/category";
import { Product } from "@common/types/product";
import { Layout, BlogArtical, BlogMini, BlogRow, RecentBlogs } from "@components/common";
import { A, H1, H2, H3, H4, H5 } from "@components/typography";
import { Button, Container, Image } from "@components/ui";
import { getConfig } from "@framework/api/config";
import { getCategories } from "@framework/categories";
import { getAllProducts } from "@framework/product";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { Link } from "@components/ui";
import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from "next";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { FunctionComponent } from "react";
import { useRouter } from "next/router";
import allBlogs from "locales/ar/static/blogs.json"

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

export default function Blogs({
  categories,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { t } = useTranslation();
  const router = useRouter();
  const blogsLength = Object.keys(allBlogs).filter((blog) => {
    if (blog.includes("blog_")) return blog
  })
  return (
    <>
      <Head>
        <title>
          {t("static/blogs:title")} | {t("common:rafraf")}
        </title>
        <link rel="canonical" href='https://rafraf.com/ar/blog' />
      </Head>

      {/* Mobile display */}
      <div className="relative block md:hidden">
        <div className="py-12">
          <Container className="pb-9">
            <H4 className="text-2xl mb-4">{t("static/blogs:Header")}</H4>
            {
              blogsLength.map((blog, index) => (
                <div key={index}>
                  <BlogRow 
                  id={t(`static/blogs:${blog}.id`)} 
                  title={t(`static/blogs:${blog}.title`)}
                  image={t(`static/blogs:${blog}.imageUrl`)}
                  date={t(`static/blogs:${blog}.date`)}
                />
              </div>
              ))
            }
          <RecentBlogs />
          </Container>
        </div>
      </div>

      {/* Desktop display */}
      <div className="relative hidden md:block">
        <div>
          <div className="py-12">
            {/* heading */}
            <Container className="pb-9">
              <H2 className="text-2xl">{t("static/blogs:Header")}</H2>
            </Container>

            {/* Blogs */}
            <Container>
              <div className="flex gap-8">
                <div>
                  <RecentBlogs />
                </div> 


                <div
                  className="flex gap-8"
                  style={{
                    flexDirection: "column",
                  }}
                >
                  {
                    blogsLength.map((blog, index) => (
                      <>{
                        (index + 1) %2 !== 0? 
                        <BlogRow 
                          id={t(`static/blogs:${blog}.id`)} 
                          title={t(`static/blogs:${blog}.title`)}
                          image={t(`static/blogs:${blog}.imageUrl`)}
                          date={t(`static/blogs:${blog}.date`)}
                      />
                        : ""}
                    </>
                    ))
                  }
                </div>

                <div
                  className="flex gap-8"
                  style={{
                    flexDirection: "column",
                  }}
                >

                  {
                    blogsLength.map((blog, index) => (
                      <>{
                        (index + 1) %2 === 0? 
                        <BlogRow 
                          id={t(`static/blogs:${blog}.id`)} 
                          title={t(`static/blogs:${blog}.title`)}
                          image={t(`static/blogs:${blog}.imageUrl`)}
                          date={t(`static/blogs:${blog}.date`)}
                      />
                        : ""}
                    </>
                    ))
                  }
                </div>
              </div>
            </Container>

            {/* Vision, Identity */}

            {/* rate us */}
          </div>
        </div>
      </div>
    </>
  );
}

Blogs.Layout = Layout;
