import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  GetServerSidePropsContext,
  GetServerSidePropsResult,
} from "next";
import React from "react";
import { Layout } from "@components/common";
import { useEffectV2, useSearchEngine } from "@common/hooks";
import { ProductCard, ProductCardSkeleton } from "@components/product";
import { ProductsList } from "@common/types/product";
import { CurrencyEnum } from "@common/types/currency";
import { Container, Accordion, Button } from "@components/ui";
import useLangDirection from "@utils/language/useLangDirection";
import { Subtitle } from "@components/typography";
import useTranslation from "next-translate/useTranslation";
import { Category } from "@common/types/category";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { getConfig } from "@framework/api/config";
import { getCategories, getStaticCategories } from "@framework/categories";
import { getAllProducts } from "@framework/product";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import manuLabel from "../assets/data/manufacturers.json";
import Head from "next/head";
import { useStore } from "@common/state";

interface Props {
  categories: Category[];
  products: ProductsList;
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  try {

    const config = getConfig({ locale: context.locale || "ar" });
    const productsPromise = getAllProducts(config, {
      filter: { category_id: { in: ["7442"] } },
    });
    const [products] = await Promise.all([productsPromise]);

    const categories = getStaticCategories({ locale: config.locale });
    return {
      props: {
        categories,
        products,
      },
      revalidate: 60 * 60 * 24,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default function Search() {
  const {
    setSearch,
    setPageSize,
    result,
    pageNumber,
    setPageNumber,
    Loading,
    totalPages,
    setIsGenuineFilter,
    setIsAltFilter,
    setManufacturerHyundaiFilter,
    setManufacturerToyotaFilter,
    setManufacturerACDelcoFilter,
    setManufacturerMotorcraftFilter,
    setManufacturerDeluxFilter,
    setManufacturerAvonFilter,
    setManufacturerUSstarFilter,
    setSortBy,
  } = useSearchEngine();

  const dir = useLangDirection();
  const myRef = useRef<HTMLDivElement>(null);
  const executeScroll = () => {
    myRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
      inline: "center",
    });
  };
  const { t } = useTranslation();
  const router = useRouter();
  const [query, setQuery] = useState("");
  //const [ result2, setResult2] = useState(result);
  const [productsToShow, setProductsToShow] = useState(12);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    //   const sessionId = JSON.parse(sessionStorage.getItem('tt_sessionId') || "Unknow session Id")
    //   const sessionStartTime = JSON.parse(sessionStorage.getItem('tt_sessionId') || "Unknow session time").split("-")[1]
    //   const sessionIndex = JSON.parse(sessionStorage.getItem('tt_pixel_session_index') || "Unknow session index").index || "Unknow session index"
    //   const platform = JSON.parse(sessionStorage.getItem('tt_appInfo') || "Unknow platform").platform || "Unknow platform"

    const q = router.query.q as string;
    setPageSize(100);
    setQuery(q);
    // console.log(q)
    // if (q) {
    //   setSearch(q);
    // }
    // console.log(sessionStartTime)
    // console.log(sessionId, sessionIndex, platform  )
  }, [router.query]);
  result.map((r: any) => {
    if (r.hasOwnProperty("image")) {
      r.Picture = r.image.url
        ? "" + r.image.url
        : "catalog/product/placeholder/default/Rafraf-small.jpg";
    }
    if (r.hasOwnProperty("price_range")) {
      r.price_0_1 = r.price_range.minimum_price.final_price.value
        ? r.price_range.minimum_price.final_price.value
        : 0;
    }
    if (r.hasOwnProperty("part_type_new")) {
      r.type = r.part_type_new == 862588 ? "genuine" : "aftermarket";
    }

    if (r.hasOwnProperty("part_manufacturer_store")) {
      r.manufacturer =
        manuLabel[r.part_manufacturer_store as keyof typeof manuLabel];
    }
    //r.price_0_1 = r.price_range.minimum_price.final_price.value
  });

  //  useEffect (() => {
  //     console("before ", result);
  //     result.map(async function(r){
  //       const product1 = getProduct(r.sku).then(function(result) {
  //         r.name = "" + result.data.products.items[0].name;
  //         r.Picture = "" + result.data.products.items[0].image.url;

  //       });
  //     })
  //     console("a ", result);

  //     setResult2(result);
  //   })

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        (document.documentElement && document.documentElement.scrollTop) ||
        document.body.scrollTop;
      const scrollHeight =
        (document.documentElement && document.documentElement.scrollHeight) ||
        document.body.scrollHeight;
      const clientHeight =
        window.innerHeight ||
        document.documentElement.clientHeight ||
        document.body.clientHeight;
      const scrolledToBottom =
        Math.ceil(scrollTop + clientHeight) >= scrollHeight - 400;
      if (scrolledToBottom && !isLoading) {
        setIsLoading(true);
        setTimeout(() => {
          setProductsToShow((prevProductsToShow) => prevProductsToShow + 12);
          setIsLoading(false);
        }, 1000); // Simulate loading time
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading]);

  // useEffectV2(() => {
  //   if (carSelected && carSelected.cars) {
  //     const name = `${carSelected.cars?.[1].name}/${
  //       carSelected.cars?.[1].name
  //     }${carSelected.cars?.[0].name?.replace(
  //       /\s/g,
  //       ""
  //     )}/${carSelected.cars?.[1].name?.replace(
  //       /\s/g,
  //       ""
  //     )}${carSelected.cars?.[0].name?.replace(/\s/g, "")}${
  //       carSelected.cars?.[2].year
  //     }`;
  //     // Change the route based on the selected car
  //     router.push(`/search?q=${query}/cars/${name}`);
  //   }
  // }, [carSelected, query]);

  return (
    <>
      <Head>
        <link rel="canonical" href={`https://rafraf.com/${dir.rtl? "ar" : "en"}/search?q=${query}`} />
        <title>{t("common:rafraf")}</title>
      </Head>

      <Container>
        <div className={`grid grid-cols-${!result.length? '3' : '4'} pt-9`}>
          {/* <div className={`col-span-1 ${!result.length? 'hidden' : 'block'}`}>
            <div className={dir.rtl ? "pl-5 border-l-2" : "pr-5 border-r-2"}>
              <div>
                <Accordion
                  label={<h1>{t("product:attributes.part_type_new")}</h1>}
                >
                  <label htmlFor="type">
                    <div className="scale-y-100 max-h-full m-2 transition-all transform origin-top">
                      <div>
                        <input
                          type="checkbox"
                          name="type"
                          value="genuine"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked) setIsGenuineFilter(true);
                            else setIsGenuineFilter(false);
                          }}
                        />
                        {t("common:genuine")}
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          name="type"
                          value="type"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked) setIsAltFilter(true);
                            else setIsAltFilter(false);
                          }}
                        />
                        {t("product/view:alternatives")}
                      </div>
                    </div>
                  </label>
                </Accordion>
              </div>

              <div>
                <Accordion
                  label={
                    <h1>{t("product:attributes.part_manufacturer_store")}</h1>
                  }
                >
                  <label htmlFor="manufacturer">
                    <div className="scale-y-100 max-h-full m-2 transition-all transform origin-top">
                      <div>
                        <input
                          type="checkbox"
                          name="manufacturer"
                          value="manufacturer"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked)
                              setManufacturerHyundaiFilter(true);
                            else setManufacturerHyundaiFilter(false);
                          }}
                        />
                        Hyundai
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          name="manufacturer"
                          value="manufacturer"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked)
                              setManufacturerToyotaFilter(true);
                            else setManufacturerToyotaFilter(false);
                          }}
                        />
                        Toyota
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          name="manufacturer"
                          value="manufacturer"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked)
                              setManufacturerACDelcoFilter(true);
                            else setManufacturerACDelcoFilter(false);
                          }}
                        />
                        ACDelco/GM
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          name="manufacturer"
                          value="manufacturer"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked)
                              setManufacturerMotorcraftFilter(true);
                            else setManufacturerMotorcraftFilter(false);
                          }}
                        />
                        Motorcraft/Ford
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          name="manufacturer"
                          value="manufacturer"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked)
                              setManufacturerDeluxFilter(true);
                            else setManufacturerDeluxFilter(false);
                          }}
                        />
                        Delux
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          name="manufacturer"
                          value="manufacturer"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked)
                              setManufacturerAvonFilter(true);
                            else setManufacturerAvonFilter(false);
                          }}
                        />
                        Avon
                      </div>

                      <div>
                        <input
                          type="checkbox"
                          name="manufacturer"
                          value="manufacturer"
                          className="mx-3"
                          onChange={(e) => {
                            if (e.target.checked)
                              setManufacturerUSstarFilter(true);
                            else setManufacturerUSstarFilter(false);
                          }}
                        />
                        US Star
                      </div>
                    </div>
                  </label>
                </Accordion>
              </div>
            </div>
          </div> */}

          <div className="col-span-4 pr-5">
            <div
              className={`border-b-2 mb-5 flex justify-between ${
                !result.length ? "hidden" : "block"
              }`}
            >
              {/*<div ref={myRef}>
                {/* sortBy */}
              <label htmlFor="">{t("product/listing:searchResult")}</label>
              {/* <select
                  name="sortBy"
                  onChange={(e) => {
                    setSortBy(e.target.value);
                  }}
                >
                  <option value="">--</option>
                  <option value="name">{t("product:attributes.name")}</option>
                  <option value="price">{t("product:attributes.price")}</option>
                </select>
              </div> */}
            </div>
            <div className="flex gap-2 flex-wrap"></div>
            {/* {console.log(result)} */}
            <div
              className={`flex flex-wrap gap-7 justify-${
                result.length ? "start" : "center"
              } relative my-5`}
            >
              {!result.length ? (
                <div className="justify-items-center">
                  <div className="text-gray-400 justify-center text-center text-2xl mb-8 font-bold">
                    {t("product/listing:productNotFound")}
                  </div>
                  <div>
                    <img src="/images/notFoundImage.svg" alt="" />
                  </div>
                </div>
              ) : (
                // {

                result.slice(0, productsToShow).map((r: any) =>
                  Loading ? (
                    <ProductCardSkeleton />
                  ) : (
                    <div className="flex-1">
                      <ProductCard
                        product={{
                          id: r.sku,
                          sku: r.sku,
                          name: r.name,
                          COD: r.COD,
                          type: r.type,
                          oem: "OEM",
                          description: r.description,
                          manufacturer: r.manufacturer,
                          slug: r.url_key,
                          path: r.url_key,
                          images: [
                            {
                              url:
                                "https://s3.me-south-1.amazonaws.com/images.rafraf.com/" +
                                r.Picture,
                            },
                          ],
                          price: {
                            final: {
                              value: r.price_0_1,
                              currencyCode: CurrencyEnum.Sar,
                            },
                          },

                          variants: [
                            {
                              attributes: [
                                {
                                  code: "vendor_store",
                                  value: "1",
                                  label: "vendor_from_search",
                                  uid: "",
                                  // Y29uZmlndXJhYmxlLzE3Ni84NjQ4NzI=
                                  // Y29uZmlndXJhYmxlLzE3Ni84NjQ4Njk=
                                },
                              ],
                            },
                          ],
                          stock_status: r.stock_status,
                        }}
                      />
                    </div>
                  )
                )
              )}
            </div>
            {isLoading && productsToShow < result.length && (
              <div id="loading"></div>
            )}

            <div
              className={`flex justify-start items-center my-5 gap-7 ${
                !result.length ? "hidden" : "block"
              }`}
            >
              {/* <div className="flex justify-between items-baseline w-full">
                <Button
                  color="white"
                  className={`shadow-none border-2 bg-transparent ${
                    (pageNumber || 1) > 1 ? "border-primary" : ""
                  } hover:bg-blue-op-20 active:bg-blue-op-30 p-2 text-blue`}
                  onClick={() => {
                    setPageNumber(pageNumber - 1);
                    executeScroll();
                  }}
                  disabled={!((pageNumber || 1) > 1)}
                >
                  {t("product/listing:prevPage")}
                </Button>
                <Subtitle>
                  {t("product/listing:currentPage")} {"( " + pageNumber + " )"}
                </Subtitle>
                <Button
                  color="white"
                  className={`shadow-none border-2 bg-transparent ${
                    (!pageNumber || result.length !== 21) ? "" : "border-primary"
                  } hover:bg-blue-op-20 active:bg-blue-op-30 p-2 text-blue`}
                  onClick={() => {
                    setPageNumber(pageNumber + 1);
                    executeScroll();
                  }}
                  disabled={!(pageNumber < totalPages)}
                >
                  {t("product/listing:nextPage")}
                </Button>
              </div> */}
              {/* ) : (
              ""
            )} */}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
}

Search.Layout = Layout;
