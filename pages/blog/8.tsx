import { Category } from "@common/types/category";
import { getConfig } from "@framework/api/config";
import { getCategories } from "@framework/categories";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import useTranslation from "next-translate/useTranslation";
import { A, H1, H2, H3, H4, P } from "@components/typography";
import { Layout, BlogArtical, BlogMini, RecentBlogs } from "@components/common";
import { Container, Image } from "@components/ui";

import {
    GetStaticPropsContext,
    GetStaticPropsResult,
    InferGetServerSidePropsType,
  } from "next";

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

function Blog({
  categories,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { t } = useTranslation();

  return (
    <div>    
      {/* Mobile Display */}
      <div className="relative block md:hidden">
        <Container>
          <div className="pt-12">
            <div className="mt-6">
              <H4>{t("static/blogs:blog_8.title")}</H4>
              <div
                style={{
                  marginTop: "12px",
                }}
              >
                {t("static/blogs:blog_8.date")}
              </div>
              <div className="mb-16">
                <P>
                  <div className="mt-16">
                    <div className="my-10">
                    </div>
                    <div className="my-8 mx-8">
                        {/* blog_4.content */}

                        <div className="my-10">
                            <img
                                src={t("static/blogs:blog_8.imageUrl")}
                                alt="blog-image"
                            />
                            </div>
                            <div className="pb-3">{t("static/blogs:blog_8.content.intro_1")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.intro_2")}</div>

                            <H4 className="pb-3">{t("static/blogs:blog_8.content.head_1")}</H4>
                            <ul>
                            <li className="pb-7">{t("static/blogs:blog_8.content.body_1_1")}</li>
                            <li className="pb-7">{t("static/blogs:blog_8.content.body_1_2")}</li>
                            <li className="pb-7">{t("static/blogs:blog_8.content.body_1_3")}</li>
                            <li className="pb-7">{t("static/blogs:blog_8.content.body_1_4")}</li>
                            <li className="pb-7">{t("static/blogs:blog_8.content.body_1_5")}</li>
                            <li className="pb-7">{t("static/blogs:blog_8.content.body_1_6")}</li>
                            </ul>
                            
                            <H4 className="pb-3">{t("static/blogs:blog_8.content.head_2")}</H4>
                            <div className="pb-7">{t("static/blogs:blog_8.content.body_2")}</div>

                            <H4 className="pb-3">{t("static/blogs:blog_8.content.head_3")}</H4>
                            <div className="pb-7">{t("static/blogs:blog_8.content.body_3_1")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.body_3_2")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.body_3_3")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.body_3_4")}</div>

                            <div className="pb-7">{t("static/blogs:blog_8.content.head_6")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.head_7")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.head_8")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.head_9")}</div>

                        <div className="mt-10">
                        متجر رفرف الإلكتروني يوفّر مجموعة واسعة من قطع
                        الغيار الأصلية Genuine و OEM وقطع الغيار البديلة
                        المعتمدة Aftermarket لمختلف أنواع سيارات{" "}
                        <a href="https://rafraf.com/ar/cars/toyota">
                            تويوتا
                        </a>{" "}
                        وهوندا{" "}
                        <a href="https://rafraf.com/ar/cars/gmc">والجمس </a>
                        <a href="https://rafraf.com/ar/cars/chevrolet">
                            والشفروليه
                        </a>{" "}
                        <a href="https://rafraf.com/ar/cars/ford">
                            والفورد
                        </a>{" "}
                        <a href="https://rafraf.com/ar/cars/cadillac">
                            والكاديلاك
                        </a>{" "}
                        <a href="https://rafraf.com/ar/cars/lincoln">
                            ولينكولن
                        </a>{" "}
                        <a href="https://rafraf.com/ar/cars/mercury">
                            وميركوري
                        </a>{" "}
                        <a href="https://rafraf.com/ar/cars/hyundai">
                            وهيونداي{" "}
                        </a>
                        <a href="https://rafraf.com/ar/cars/hummer">وهمر</a>
                        <a href="https://rafraf.com/ar/cars/lexus">ولكزس</a>
                        وغيرها، ونقوم أيضاً بتلبية جميع متطلبات السوق
                        السعودي من <a href="https://rafraf.com/ar/parts/7442">الزيوت </a>{" "}
                        <a href="https://rafraf.com/ar/parts/9524">والفلاتر الأمريكية الأصلية</a>.
                        </div>
                      </div>
                  </div>
                </P>
              </div>
              <RecentBlogs />

              <div></div>
            </div>
          </div>
        </Container>
      </div>

      {/* Desktop Display */}
      <div className="relative hidden md:block pt-12">
        <Container>
          <div className="flex flex-column">
            <RecentBlogs />
blog_8
            <div>
              <div>
                <div>
                  {/* heading */}
                  <Container className="pb-1">
                    <div
                      className="flex"
                      style={{
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
                        width: "750px",
                        height: "162px",
                        marginBottom: "20px",
                      }}
                    >
                      <div className="mt-6 mx-8">
                        <H3>{t("static/blogs:blog_8.title")}</H3>
                        <div
                          style={{
                            marginTop: "35px",
                          }}
                        >
                          {t("static/blogs:blog_8.date")}
                        </div>
                      </div>
                    </div>
                  </Container>
                </div>
              </div>

              <div>
                <div className="pb-12">
                  {/* Content Container */}
                  <Container className="pb-9">
                    <div
                      className="flex"
                      style={{
                        boxShadow: "0px 2px 6px rgba(0, 0, 0, 0.15)",
                        width: "750px",
                        height: "auto",
                        marginBottom: "20px",
                      }}
                    >
                      <div className="my-8 mx-8">
                        <div className="my-10">
                            <img
                                src={t("static/blogs:blog_8.imageUrl")}
                                alt="blog-image"
                            />
                            </div>

                            <div className="pb-3">{t("static/blogs:blog_8.content.intro_1")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.intro_2")}</div>

                            <H4 className="pb-3">{t("static/blogs:blog_8.content.head_1")}</H4>
                            <ul className="list-disc">
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_1_1")}</li>
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_1_2")}</li>
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_1_3")}</li>
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_1_4")}</li>
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_1_5")}</li>
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_1_6")}</li>
                            </ul>

                            <H4 className="pb-3">{t("static/blogs:blog_8.content.head_2")}</H4>
                            <div className="pb-7">{t("static/blogs:blog_8.content.body_2")}</div>

                            <H4 className="pb-3">{t("static/blogs:blog_8.content.head_3")}</H4>
                            <ul className="list-disc">
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_3_1")}</li>
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_3_2")}</li>
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_3_3")}</li>
                            <li className="pb-7 mr-7">{t("static/blogs:blog_8.content.body_3_4")}</li>
                            </ul>
                            <div className="pb-7">{t("static/blogs:blog_8.content.head_6")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.head_7")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.head_8")}</div>
                            <div className="pb-7">{t("static/blogs:blog_8.content.head_9")}</div>
                            




                          <div className="mt-10">
                            متجر رفرف الإلكتروني يوفّر مجموعة واسعة من قطع
                            الغيار الأصلية Genuine و OEM وقطع الغيار البديلة
                            المعتمدة Aftermarket لمختلف أنواع سيارات{" "}
                            <a href="https://rafraf.com/ar/cars/toyota">
                              تويوتا
                            </a>{" "}
                            وهوندا{" "}
                            <a href="https://rafraf.com/ar/cars/gmc">والجمس </a>
                            <a href="https://rafraf.com/ar/cars/chevrolet">
                              والشفروليه
                            </a>{" "}
                            <a href="https://rafraf.com/ar/cars/ford">
                              والفورد
                            </a>{" "}
                            <a href="https://rafraf.com/ar/cars/cadillac">
                              والكاديلاك
                            </a>{" "}
                            <a href="https://rafraf.com/ar/cars/lincoln">
                              ولينكولن
                            </a>{" "}
                            <a href="https://rafraf.com/ar/cars/mercury">
                              وميركوري
                            </a>{" "}
                            <a href="https://rafraf.com/ar/cars/hyundai">
                              وهيونداي{" "}
                            </a>
                            <a href="https://rafraf.com/ar/cars/hummer">وهمر</a>{" "}
                            <a href="https://rafraf.com/ar/cars/lexus">ولكزس</a>{" "}
                            وغيرها، ونقوم أيضاً بتلبية جميع متطلبات السوق
                            السعودي من <a href="">الزيوت </a>{" "}
                            <a href="">والفلاتر الأمريكية الأصلية</a>.
                          </div>
                        
                      </div>
                    </div>
                  </Container>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </div>
    </div>
  )
}

export default Blog
Blog.Layout = Layout;