import { FunctionComponent, useEffect, useRef, useState } from "react";
import Head from "next/head";
import {
  Accordion,
  Button,
  Container,
  Pill,
  Breadcrumbs,
} from "@components/ui";
import cn from "classnames";
import useTranslation from "next-translate/useTranslation";
import { ProductCard, ProductCardSkeleton } from "..";
import { range } from "@utils/common";
import { H3, Subtitle } from "@components/typography";
import { useProductListing } from "@common/hooks";
import useLangDirection from "@utils/language/useLangDirection";
import { Category } from "@common/types/category";
import { ProductsList } from "@common/types/product";
import { GetStaticPropsContext } from "next";
import { useRouter } from "next/router";
import categories from "@assets/data/categories.json";
// import categoryData from "@assets/data/carCategoryNames.json";
import cars from "@assets/data/cars.json";
import urlMapper from "@assets/data/UrlMapperCars.json";
import { useSearchEngine } from "@common/hooks";
import { getSource, getAnalyticsId } from "framework/analytics";
import { API_URL } from "@framework/const";
import  getDropDownManufacturer  from "./ManufacturerDropDown.json";
import { useStore } from "@common/state";
import { getCarLocalized } from "@utils/common/cars-localization";


interface Props {
  products: ProductsList;
  categoriesTree: Category[];
  category: Category;
  showTopCategories: Boolean;
  breadcrumb: {
    car: Boolean;
    maker: String;
    model: String;
    year: string;
  };
}

interface Manufacturers {
  label: string;
  value: string;
  checked: boolean | undefined;
}

const ProductListing: FunctionComponent<Props> = ({
  products: initialProducts,
  categoriesTree,
  category: category,
  showTopCategories,
  breadcrumb,
}) => {
  const { t } = useTranslation();
  const dir = useLangDirection();
  const rootRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const productListing = useProductListing({
    initialProducts,
    categoriesTree,
    mainCategory: category,
  })();
  const { meta } = productListing;
  const {maker, model, year} = getCarLocalized({value: breadcrumb, dir})

  const { partCategories, activePartCategories, partManufacturer, partType } =
    productListing;

  const { products, productsPage, loading } = productListing;

  const {
    handleCategoryFilterChange,
    handlePartManufacturerFilterChange,
    handlePartTypeFilterChange,
  } = productListing;

  const { handelGoToPage } = productListing;

  const [categPill, setCategPill] = useState({ cateName: "", cateId: "" });
  const [pageNumber, setPageNumber] = useState({ pageNumber: "1" });
  const [productsToShow, setProductsToShow] = useState(12);
  const [isLoading, setIsLoading] = useState(false);
  const { uniqueManufacturer, productType } = useStore();
  
  useEffect(() => {
    const filterForm = JSON.parse(
      localStorage.getItem("categFilter") || "{}"
    ).cateId;
    const filterFormName = JSON.parse(
      localStorage.getItem("categFilter") || "{}"
    ).cateName;
    const MAIN_CATEGORY = JSON.parse(
      localStorage.getItem("MAIN_CATEGORY") || "{}"
    );
    const page = JSON.parse(localStorage.getItem("PAGE") || "{}").pageNumber;

    if (filterForm && category.id === MAIN_CATEGORY) {
      setCategPill({ cateName: filterFormName, cateId: filterForm });
      setPageNumber({ pageNumber: page });
    } else if (page !== "1" && category.id === MAIN_CATEGORY) {
      setPageNumber({ pageNumber: page });
    } else {
      setCategPill({ cateName: "", cateId: "" });
      setPageNumber({ pageNumber: "1" });
    }
  }, []);

  useEffect(() => {
    if (categPill.cateId === "RESET") {
      localStorage.setItem(
        "categFilter",
        JSON.stringify({ cateName: "", cateId: "" })
      );
      localStorage.setItem("PAGE", JSON.stringify({ pageNumber: "1" }));
      setCategPill({ cateName: "", cateId: "" });
      setPageNumber({ pageNumber: "1" });
    } else if (categPill.cateId !== "") {
      localStorage.setItem(
        "categFilter",
        JSON.stringify({
          cateName: categPill.cateName,
          cateId: categPill.cateId,
        })
      );
      handleCategoryFilterChange(categPill.cateId || "");
      pageNumber.pageNumber !== "1"
        ? handelGoToPage(pageNumber.pageNumber)
        : "";
    }
  }, [categPill]);

  useEffect(() => {
    localStorage.setItem(
      "PAGE",
      JSON.stringify({ pageNumber: pageNumber.pageNumber })
    );
    handelGoToPage(pageNumber.pageNumber || "1");
  }, [pageNumber]);

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
      function isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        );
      }
      function getOffsetValue() {
        return isMobileDevice() ? 1400 : 400;
      }
      const scrolledToBottom =
        Math.ceil(scrollTop + clientHeight) >= scrollHeight - getOffsetValue();
      const allProductsLoaded = productsToShow === products.length;
      if (scrolledToBottom && !isLoading && !allProductsLoaded) {
        setIsLoading(true);
        setTimeout(() => {
          setProductsToShow((prevProductsToShow) => prevProductsToShow + 12);
          setIsLoading(false);
        }, 1000); // Simulate loading time
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, products.length, productsToShow]);
  return (
    <>
      <Head>
        <meta
          name="description"
          content={
            meta.description ||
            category.meta?.description ||
            `${t("common:rafraf")} | ${t("common:parts")} ${maker} ${model} ${year}`
          }
        />
        <meta
          name="keywords"
          content={meta.keywords || category.meta?.keywords || `${t("common:rafraf")} | ${t("common:parts")} ${maker} ${model} ${year}`}
        />
        <link
          rel="canonical"
          href={`https://rafraf.com/${dir.rtl ? "ar" : "en"}${router.asPath}`}
        />
        <title>
          {
            meta.title ||
            category.meta?.title ||
            `${t("common:rafraf")} | ${t("common:parts")} ${maker} ${model} ${year}`}
        </title>
      </Head>
      <Container>
        {breadcrumb.car ? <Breadcrumbs value={breadcrumb} /> : <></>}
        <div className="block md:grid md:grid-cols-4 pt-2" ref={rootRef}>
          {/* Filters */}
          <Accordion
            label={t("product/listing:filters")}
            open={category.id === "7442" ? true : false}
          >
            <div className="md:col-span-1">
              <div
                className={cn(
                  "h-auto md:h-screen overflow-y-auto border-none",
                  dir.rtl ? "md:pl-5 border-l-2" : "md:pr-5 border-r-2"
                )}
              >
                {/* selected car */}
                {breadcrumb.car ? (
                  <Accordion
                    label={`${dir ? "السيارة المختارة" : "Car Selected"}`}
                  >
                    {cars.map((op, i) => (
                      <Accordion
                        key={op.makerEn + String(i)}
                        label={
                          <div>
                            <input
                              id={`category_id_${op.makerEn}`}
                              name={`category_id`}
                              type="radio"
                              className="mx-3"
                              onChange={() => {}}
                              onClick={() => {
                                let url = `/${dir.rtl ? "ar" : "en"}/cars/${
                                  op.makerEn
                                }/`;
                                router.push(url.toLocaleLowerCase());
                              }}
                              checked={
                                op.makerEn.toLocaleLowerCase() ===
                                breadcrumb.maker
                              }
                            />
                            <label htmlFor={`category_id_${op.makerEn}`}>
                              {dir ? op.makerAr : op.makerEn}
                            </label>
                          </div>
                        }
                      >
                        {op.models.map((model) => (
                          <Accordion
                            key={model.modelEn}
                            label={
                              <div>
                                <input
                                  id={`category_id_${model.modelEn}`}
                                  name={`category_id`}
                                  type="radio"
                                  className="mx-3"
                                  onChange={() => {}}
                                  onClick={() => {
                                    let url =
                                      urlMapper[
                                        String(
                                          `${op.makerEn}/${op.makerEn}${model.modelEn}`.toLowerCase()
                                        ) as keyof typeof urlMapper
                                      ];
                                    router.push(
                                      `/${dir.rtl ? "ar" : "en"}/cars/${url}`
                                    );
                                  }}
                                  checked={
                                    model.modelEn.toLocaleLowerCase() ===
                                    breadcrumb.model
                                  }
                                />
                                <label htmlFor={`category_id_${model.modelEn}`}>
                                  {dir ? model.modelAr : model.modelEn}
                                </label>
                              </div>
                            }
                          >
                            {/* The years Accordion */}
                            {model.years.map((year) => (
                              <div key={year}>
                                <input
                                  id={`category_id_${year}`}
                                  name={`category_id`}
                                  type="radio"
                                  className="mx-3"
                                  onChange={() => {}}
                                  onClick={() => {
                                    let url = 
                                      urlMapper[
                                        String(
                                          `${op.makerEn}/${op.makerEn}${model.modelEn}/${op.makerEn}${model.modelEn}${year}`.toLowerCase()
                                        ) as keyof typeof urlMapper
                                      ];
                                    router.push(
                                      `/${dir.rtl ? "ar" : "en"}/cars/${url}`
                                    );
                                  }}
                                  checked={
                                    model.modelEn
                                      .toLocaleLowerCase()
                                      .concat(year) ===
                                    breadcrumb.model.concat(breadcrumb.year)
                                  }
                                />
                                <label htmlFor={`category_id_${year}`}>
                                  {year}
                                </label>
                              </div>
                            ))}
                          </Accordion>
                        ))}
                      </Accordion>
                    ))}
                  </Accordion>
                ) : (
                  ""
                )}
                {/* categories */}
                {showTopCategories ? (
                  <Accordion label={t("product:attributes.category_id")}>
                    {categoriesTree.map((c1) => (
                      <Accordion
                        key={c1.id}
                        label={
                          <div>
                            <input
                              id={`category_id_${c1.id}`}
                              name={`category_id`}
                              type="radio"
                              className="mx-3"
                              onClick={(e) => {
                                setPageNumber({ pageNumber: "1" });
                                setCategPill({
                                  cateName: c1.name,
                                  cateId: c1.id,
                                });
                              }}
                              onChange={(e) => {
                                // handleCategoryFilterChange(c1.id || "");
                              }}
                              checked={
                                categPill.cateId === c1.id ? true : false
                              }
                              value={
                                activePartCategories
                                  .map((op) => op.value)
                                  .includes(c1.id || "")
                                  ? "on"
                                  : "off"
                              }
                            />
                            <label htmlFor={`category_id_${c1.id}`}>
                              {c1.name}
                            </label>
                          </div>
                        }
                      ></Accordion>
                    ))}
                  </Accordion>
                ) : (
                  <></>
                )}
                {/* part type */}
                <Accordion label={t("product:attributes.part_type_new")}>
                  {productType.map((op, i) => (
                    <div
                      key={op.value + String(i)}
                      className="flex justify-between items-baseline"
                    >
                      <label htmlFor={"part_type_new_" + op.value}>
                        {t(
                          `product:attributes.part_type_new${op.value}`,
                          {},
                          { fallback: op.label }
                        )}
                      </label>
                      <input
                        id={"part_type_new_" + op.value}
                        type="checkbox"
                        onChange={(e) => {
                          handlePartTypeFilterChange(
                            op.value || "",
                            e.target.checked
                          );
                        }}
                      />
                    </div>
                  ))}
                </Accordion>
                {/* part manufacturers */}
                <Accordion
                  label={t("product:attributes.part_manufacturer_store")}
                  // open={category.id === "7442" ? true : false}
                >
                  {uniqueManufacturer.map((op, i) => (
                    <div
                      key={op.value + String(i)}
                      className="flex justify-between items-baseline"
                    >
                      <label htmlFor={"part_manufacturer_store_" + op.value}>
                        {t(
                          `product:attributes.part_manufacturer_store${op.value}`,
                          {},
                          { fallback: op.label }
                        )}
                      </label>
                      <input
                        id={"part_manufacturer_store_" + op.value}
                        type="checkbox"
                        onChange={(e) => {
                          handlePartManufacturerFilterChange(
                            op.value || "",
                            e.target.checked
                          );
                        }}
                      />
                    </div>
                  ))}
                </Accordion>
              </div>
            </div>
          </Accordion>

          {/* product listing  */}
          <div className={cn("col-span-3 relative", dir.rtl ? "pr-5" : "pl-5")}>
            {/* <div className="right-0 absolute cursor-pointer" onClick={() => {
              // Show filters
              setShowFilter(!showFilter);
            }}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 9.0001H0M18 15.0001L15 15.0001M18 3.0001L10.2 3.00011M7.8 3.0001L1.40668e-06 3.0001M5.4 9.0001L18 9.0001M12.6 15.0001L8.82141e-07 15.0001M12.6 12.6001L12.6 17.4001L15 17.4001L15 12.6001L12.6 12.6001ZM3 6.6001L3 11.4001H5.4L5.4 6.6001H3ZM7.8 0.600098L7.8 5.4001L10.2 5.4001V0.600098L7.8 0.600098Z" stroke="#1D1929"/>
              </svg>
            </div> 

            {/* Categoris selection top */}
            {showTopCategories ? (
              <>
                {/* Mobile display */}
                <div className="relative block lg:hidden">
                  <div className="grid grid-cols-5 gap-4 my-4">
                    {categories.map((e, i) =>
                      e.id !== "7442" && e.id !== "9524" ? (
                        <>
                          <div
                            className="px-1 text-lg leading-5 text-center"
                            key={i}
                          >
                            <div
                              onClick={() => {
                                setPageNumber({ pageNumber: "1" });
                                setCategPill({
                                  cateName: dir.rtl ? e.nameArabic : e.nameEng,
                                  cateId: e.id,
                                });
                              }}
                            >
                              <button>
                                <img
                                  src={`/categories/${e.id}.jpg`}
                                  alt="Category Image"
                                />{" "}
                                <div
                                  className="pt-2 hover:underline"
                                  style={{
                                    fontSize: "12px",
                                  }}
                                >
                                  {dir.rtl ? e.nameArabic : e.nameEng}
                                </div>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )
                    )}
                  </div>
                </div>

                {/* Desktop display */}
                <div
                  className={`relative hidden lg:block  duration-200 origin-top-right transition ease-in-out`}
                >
                  <div className="flex gap-2">
                    {categories.map((e, i) =>
                      e.id !== "7442" && e.id !== "9524" ? (
                        <>
                          <div
                            className="px-2 text-lg leading-5 text-center"
                            key={i}
                          >
                            <div
                              onClick={() => {
                                // handleCategoryFilterChange(e.id || "");
                                setPageNumber({ pageNumber: "1" });
                                setCategPill({
                                  cateName: dir.rtl ? e.nameArabic : e.nameEng,
                                  cateId: e.id,
                                });
                              }}
                            >
                              <button>
                                <img
                                  src={`/categories/${e.id}.jpg`}
                                  alt="Category Image"
                                />{" "}
                                <div
                                  className="pt-2 hover:underline"
                                  style={{
                                    fontSize: "14px",
                                  }}
                                >
                                  {dir.rtl ? e.nameArabic : e.nameEng}
                                </div>
                              </button>
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )
                    )}
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {/* product sorting control */}
            {/* <div className="border-b-2 mb-5 flex justify-between">
              <div>
                <label htmlFor="">{t("product/listing:sortBy")}</label>
                <select
                  name="sortBy"
                  className="bg-transparent"
                  defaultValue={defaultSort}
                  onChange={(e) => handleSortChange(e.target.value as any)}
                >
                  {sortOptions.map((op) =>
                    op.value === "position" ||
                    op.value === "part_number_store" ||
                    op.value === "featured" ? (
                      ""
                    ) : (
                      <option key={op.value} value={op.value}>
                        {t(
                          `product:attributes.${op.value}`,
                          {},
                          {
                            fallback: op.label,
                          }
                        )}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div> */}

            {/* product filters pills */}
            <div className="flex gap-2 flex-wrap">
              {/* // COMMIT 5/26 */}
              {/* <div> */}
              {categPill.cateName !== "" ? (
                <Pill
                  key={categPill.cateId}
                  label={categPill.cateName}
                  value={categPill.cateId}
                  onRemove={(value) => {
                    handleCategoryFilterChange(value, false);
                    setCategPill({ cateName: "", cateId: "RESET" });
                  }}
                />
              ) : (
                <></>
              )}
            </div>

            {/* products cards */}
            <div
              className={`flex flex-wrap gap-7 justify-${
                products.length ? "start" : "center"
              } relative my-5`}
              // style={{ maxHeight: "80vh" }}
            >
              {loading ? (
                range({ e: 9 }).map((i) => (
                  <div className="flex-1" key={i}>
                    <ProductCardSkeleton />
                  </div>
                ))
              ) : products.length ? (
                products.slice(0, productsToShow).map((p, i) => (
                  <div className="flex-1" key={i}>
                    <ProductCard product={p} />
                  </div>
                ))
              ) : (
                <div className="justify-items-center justify-center relative">
                  <div className="text-gray-400 justify-center text-center text-2xl mb-8 font-bold left-0  ">
                    {t("product/listing:productNotFound")}
                  </div>
                  <div>
                    <img src="/images/notFoundImage.svg" alt="" />
                  </div>
                </div>
              )}

              {/* { isLoading && <div id="loading"></div> } */}

              {/* {LoadMore ? (
                <button
                  className="shadow-md rounded flex justify-center items-center bg-blue text-white text-lg text-center hover:bg-blue-dark active:bg-blue-darker px-5 py-3"
                  onClick={() => {
                    setisLoad(true);
                    setLoadMore(false);
                    setTimeout(() => {
                      setLoadMore(true);
                      setisLoad(false);
                      setProductsToShow(productsToShow + 12);
                    }, 3000);
                  }}
                >
                  Load More
                </button>
              ) : (
                ""
              )} */}
              {/* {isLoad && <div id="loading"></div>} */}
            </div>
            {isLoading && productsToShow < products.length && (
              <div id="loading"></div>
            )}
            {/* products paging control */}
            <div className="flex justify-start items-center my-5 gap-7">
              {!loading
                ? ""
                : // <div className="flex justify-between items-baseline w-full">
                  //   <Button
                  //     color="white"
                  //     className={`shadow-none border-2 bg-transparent ${
                  //       (productsPage?.currentPage || 1) > 1
                  //         ? "border-primary"
                  //         : ""
                  //     } hover:bg-blue-op-20 active:bg-blue-op-30 p-2 text-blue`}
                  //     onClick={() => {
                  //       setPageNumber({pageNumber: String(Number(productsPage?.currentPage) - 1 ) || "1"})
                  //       rootRef.current?.scrollIntoView({
                  //         behavior: "smooth",
                  //         block: "start",
                  //         inline: "start",
                  //       });
                  //     }}
                  //     disabled={!((productsPage?.currentPage || 1) > 1)}
                  //   >
                  //     {t("product/listing:prevPage")}
                  //   </Button>
                  //   <Subtitle>
                  //     {t("product/listing:currentPage")} (
                  //     {productsPage?.currentPage})
                  //   </Subtitle>
                  //   <Button
                  //     color="white"
                  //     className={`shadow-none border-2 bg-transparent ${
                  //       products.length === 21 ? "border-primary" : ""
                  //     } hover:bg-blue-op-20 active:bg-blue-op-30 p-2 text-blue`}
                  //     onClick={() => {
                  //       setPageNumber({pageNumber: String(Number(productsPage?.currentPage) + 1 ) || "1"})
                  //       rootRef.current?.scrollIntoView({
                  //         behavior: "smooth",
                  //         block: "start",
                  //         inline: "start",
                  //       });
                  //     }}
                  //     disabled={products.length !== 21}
                  //   >
                  //     {t("product/listing:nextPage")}
                  //   </Button>
                  // </div>
                  ""}
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ProductListing;
