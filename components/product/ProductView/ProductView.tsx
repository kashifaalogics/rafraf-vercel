import { useCartItems, useViewport, useSearchEngine } from "@common/hooks";
import { CurrencyEnum } from "@common/types/currency";
import { Product, RelatedProducts } from "@common/types/product";
import { Minus, Plus, Warning } from "@components/icons";
import { H3, H5, Label, P, Subtitle, A } from "@components/typography";
import {
  Button,
  Container,
  Image,
  Loading,
  Rating,
  TabItem,
  Tabs,
} from "@components/ui";
import { getCookieData, getCustomerData, recordAPI } from "framework/analytics";
import { fitmentCategoriesTree } from "@utils/categories";
import useLangDirection from "@utils/language/useLangDirection";
import useTranslation from "next-translate/useTranslation";
import Head from "next/head";
import { useRouter } from "next/router";
import {
  FunctionComponent,
  useMemo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from "react";
import { colors } from "theme/themeColors.config";
import { ProductCard } from "..";
import { WHATSAPP_LINK, API_URL } from "@framework/const";
import manuImg from "../../../assets/data/manufacturersImages.json";
import { IMAGES_STORAGE_URL } from "@framework/const";
import { getConfig } from "@framework/api/config";
import { RelatedProductsComponent } from "@components/common/RelatedProducts";
import { useStore } from "@common/state";
import { productFormatter } from "@utils/common/helpers";

interface Props {
  product: Product;
  alternatives: Product[];
}

const ProductView: FunctionComponent<Props> = ({ product, alternatives }) => {
  const { t } = useTranslation();
  const router = useRouter();
  const { rtl } = useLangDirection();
  const { addToCart, cartItems, address } = useCartItems();
  const { breakpoint: bp } = useViewport();
  const [quantity, setQuantity] = useState<number>(1);
  const tabsRef = useRef<any>(null);
  const relatedProducts = product.related_products as RelatedProducts[];

  const fitmentCategories = useMemo(() => {
    return fitmentCategoriesTree(product.categories);
  }, [product.categories]);

  return (
    <>
      <Head>
        <meta
          name="description"
          content={productFormatter(product, fitmentCategories) || product?.header?.description || product.description}
        />
        <meta
          name="keywords"
          content={product?.header?.keywords || productFormatter(product, fitmentCategories)}
        />
        <title>
          {`${t("common:rafraf")} | ${productFormatter(product, fitmentCategories)}` || product?.header?.title}
        </title>
        <link
          rel="canonical"
          href={`https://rafraf.com/${rtl ? "ar" : "en"}${router.asPath}`}
        />
      </Head>
      <Container className="my-16">
        <div className="flex gap-6 flex-col md:flex-row">
          {/* mobile */}
          <div className="block md:hidden">
            <H3 className="text-blue">{productFormatter(product, fitmentCategories)}</H3>
          </div>

          {/* image */}
          <div>
            {product.type ? (
              <div
                className={`px-5 py-1 z-50 max-w-min capitalize ${
                  rtl ? "rounded-tr-md" : "rounded-tl-md"
                } ${
                  product.type === "genuine"
                    ? "bg-yellow text-black"
                    : "bg-red text-white"
                }`}
              >
                {t(`common:${product.type}`)}
              </div>
            ) : (
              ""
            )}
            <div
              className="relative"
              style={{ height: "464px", width: bp === "sm" ? "90vw" : "464px" }}
            >
              {product.images[0].url && (
                <Image
                  src={product.images[0].url}
                  alt={product.images[0].alt || product.name || ""}
                  layout="fill"
                  objectFit="scale-down"
                />
              )}
            </div>
          </div>

          {/* main content */}
          <div className="flex-grow">
            <div className="hidden md:block">
              <H3 className="text-blue">{productFormatter(product, fitmentCategories)}</H3>
              <div className="my-4 pb-4 border-b-2 flex items-center gap-4">
                {/* <Rating size={"22"} rating={product.rating?.summary || 0} /> */}
                {/* <Subtitle className="text-blue">
                  {t("product:review")} ({product.reviews?.count || 0})
                </Subtitle> */}
                {/* <div className="h-6 bg-grey" style={{ width: "1px" }}></div> */}
                {/* <Subtitle className="text-blue">
                  {product.reviews?.count || 0 || ""}{" "}
                  {t("product:answeredQuestions")}
                </Subtitle> */}
              </div>
            </div>
            {product.stock_status === "IN_STOCK" ? (
              <></>
            ) : (
              <>
                <div className="mb-2">
                  <Label className="text-red text-lg">
                    {t("product:outOfStock")}
                  </Label>
                </div>

                <A
                  // onClick={() => recordAPI({ behaviour: "whatsapp", source: "product_view", product: product.sku })}
                  target="_blank"
                  href={`https://wa.me/966536722255/?text=أود السؤال عن هذا المنتج ${product.sku}`}
                  title="تواصل على الواتسآب"
                  className="mb-3 w-full flex"
                >
                  <div>{t("product:notifyMeWhenAvailable")}</div>
                  <div>
                    <img className="w-6 mx-1" src={"/images/whatsapp.webp"} />
                  </div>
                </A>
              </>
            )}

            <div className="flex gap-3 items-baseline">
              <H3>
                {product.price.final?.value.toFixed(2)}{" "}
                {product.price.final?.currencyCode || CurrencyEnum.Sar}
              </H3>
              {/* <Heart/> */}
              <Subtitle className="text-darkgrey line-through">
                {product.price.regular?.value.toFixed(2)}{" "}
                {product.price.regular?.currencyCode || ""}
              </Subtitle>
              <Subtitle className="text-darkgrey">
                {t("product/view:vatInclusive")}
              </Subtitle>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-4">
              <Label className="text-blue text-lg">
                {t("product/view:partNumber")}
              </Label>
              <P className="col-span-2">{product.sku}</P>

              <Label className="text-blue text-lg">
                {t("product/view:fitments")}
              </Label>
              <P className="col-span-2 flex gap-3">
                <span>
                  {!fitmentCategories.length
                    ? ""
                    : fitmentCategories[0].children
                        ?.map((c1) =>
                          c1.children?.map((c2) => `${c2.name}`).join(", ")
                        )
                        .join(", ")}
                </span>{" "}
                <span
                  className="hover:underline text-light-blue-darker cursor-pointer"
                  onClick={() => {
                    tabsRef.current.setActiveTab(1);
                    tabsRef.current.scrollIntoView();
                  }}
                >
                  {t("common:more")}
                </span>
              </P>

              {/* <Label className="text-blue text-lg">
                {t("product/view:Oem")}
              </Label>
              <P className="col-span-2">
                {product.oem}
              </P> */}

              <Label className="text-blue text-lg">
                {t("product/view:description")}
              </Label>
              <P className="col-span-2">{product.description}</P>

              {product.manufacturer && (
                <>
                  <Label className="text-blue text-lg">
                    {t("product/view:manufacturer")}
                  </Label>
                  <div className="col-span-2">
                    <img
                      src={
                        IMAGES_STORAGE_URL +
                        manuImg[product.manufacturer as keyof typeof manuImg]
                      }
                      className="h-6"
                      alt="Logo Image"
                    />
                  </div>
                </>
              )}
            </div>

            {/* quantity control */}
            <div className="my-4">
              <div
                className={`bg-light rounded-sm flex justify-around items-center ${
                  rtl ? "flex-row-reverse" : ""
                }`}
                style={{ height: "35px", width: "108px" }}
              >
                {cartItems.find((i) => i.product.sku === product.sku)
                  ?.loading ? (
                  <Loading color="blue" />
                ) : (
                  <>
                    <span
                      className="cursor-pointer"
                      onClick={() => setQuantity((q) => (q > 1 ? q - 1 : q))}
                    >
                      <Minus
                        color={colors.blue}
                        style={{ transform: "scale(0.625)" }}
                      />
                    </span>
                    <span className="text-lg leading-5">{quantity}</span>
                    <span
                      className="cursor-pointer"
                      onClick={() => setQuantity((q) => q + 1)}
                    >
                      <Plus
                        color={colors.blue}
                        style={{ transform: "scale(0.625)" }}
                      />
                    </span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 my-4">
              <Warning />
              <P
                className=""
                style={{
                  color: "#717171",
                  maxWidth: "320px",
                  fontSize: "14px",
                  fontWeight: "800",
                }}
              >
                *{t("product/view:availabilityWarning")}
              </P>
            </div>

            {/* actions button */}
            <div className="flex justify-start gap-8">
              <Button
                id="buy-now-view"
                className="buy-now-view p-3 col-span-2 mx-2 w-full"
                style={{ maxWidth: "320px", backgroundColor: "#29AB87" }}
                disabled={product.stock_status === "IN_STOCK" ? false : true}
                onClick={async () => {
                  // recordAPI({behaviour: "buy_now", source: "product_view", product: product.sku})
                  await addToCart({ product });
                  router.push("/checkout");
                }}
              >
                {t("product:buyNow")}
              </Button>
              <Button
                id="add-to-cart-view"
                color="white"
                textColor="add-blue"
                className={`add-to-cart-view p-3 border-2 ${
                  product.stock_status === "IN_STOCK"
                    ? "border-add-blue-700"
                    : ""
                } bg-transparent hover:bg-add-blue-op-30 active:bg-add-blue-op-30 w-full`}
                style={{ maxWidth: "250px" }}
                disabled={product.stock_status === "IN_STOCK" ? false : true}
                onClick={() => {
                  // recordAPI({behaviour: "add_to_cart", source: "product_view", product: product.sku});
                  addToCart({ product, quantity });
                }}
              >
                {t("product:addToCart")}
              </Button>
            </div>

            <div className="flex items-center">
              <P
                className="mx-2 mt-2 text-blue text-center"
                style={{
                  maxWidth: "320px",
                  fontSize: "14px",
                }}
              >
                {t("product/view:fitmentWarning")}
              </P>
            </div>
          </div>
        </div>

        {/* alternatives */}
        {alternatives.filter((a) => a.id !== product.id).length ? (
          <div className="my-16">
            <H5 className="m-3">{t("product/view:alternatives")}</H5>
            {alternatives
              .filter((a) => a.id !== product.id)
              .map((a) => (
                <ProductCard key={a.id} variant="flat" product={a} />
              ))}
          </div>
        ) : (
          ""
        )}

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <RelatedProductsComponent related_products={relatedProducts} />
        )}

        {/* tabs */}
        <div className="my-16">
          <Tabs ref={tabsRef}>
            <TabItem title={t("product/view:description")} index={0}>
              <div>{product.description}</div>
              <div>{product.manufacturer}</div>
            </TabItem>
            <TabItem title={t("product/view:fitments")} index={1}>
              {!fitmentCategories.length
                ? ""
                : fitmentCategories[0].children?.map((c1) =>
                    c1.children?.map((c2) => (
                      <div className="grid grid-cols-4" key={c2.id}>
                        <div className="col-span-1">
                          {c1.name + " " + c2.name}
                        </div>
                        <div className="col-span-3">
                          {c2.children
                            ?.map((child) => child.name)
                            .sort()
                            .join(" - ")}
                        </div>
                      </div>
                    ))
                  )}
            </TabItem>
          </Tabs>
        </div>
      </Container>
    </>
  );
};

export default ProductView;
