import {
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from "next";
import { Image } from "@components/ui";
import { FALLBACK_IMAGE } from "@framework/const";
import { BlogArtical, Layout } from "@components/common";
import { Container } from "@components/ui";
import {
  FlashSales,
  HomeCategories,
  Selection,
  ShopByBrand,
} from "@components/home";
import useTranslation from "next-translate/useTranslation";
import Slider from "@ant-design/react-slick";
import { getConfig } from "@framework/api/config";
import { getCategories } from "@framework/categories";
import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { getAllProducts } from "@framework/product";
import { Category } from "@common/types/category";
import { ProductsList } from "@common/types/product";
import Head from "next/head";
import { useEffect, useState, useRef, Key } from "react";
import s from "../components/home/FlashSales/Silder.module.css";
import { useRouter } from "next/router";
import { API_URL, IMAGE_URL } from "@framework/const";
import { Cheerio } from "cheerio";
import { RegistrationForm } from "@components/account";
import { useUI } from "@components/ui/constext";
import Carousel from "@components/product/carousels";
import { GtmBase } from "framework/analytics";
import Oil from "@components/ui/Oil";
import { BlogMini } from "@components/common";
import { BlogRow } from "@components/common";
import ReviewsFromCustomers from "@components/home/ReviewsFromCustomers";
import { A, H2, Subtitle } from "@components/typography";
import Timer from "@components/ui/Timer";
import { ProductCard } from "@components/product";
import MagnetLeed from "@components/ui/Magnet/MagnetLeed";
import { useAuth } from "@common/hooks";
import { setTimeout } from "timers";
import DiscountPopUp from "@components/ui/DiscountPopup/Discount";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useInView } from "react-intersection-observer";
import TagManager from "react-gtm-module";


const BANNER_MOBILE =
  "https://s3.me-south-1.amazonaws.com/images.rafraf.com/slider/banner-mobile.jpg";
const BANNER_DESKTOP =
  "https://s3.me-south-1.amazonaws.com/images.rafraf.com/slider/banner-desktop.jpg";

interface Props {
  categories: Category[];
  products: ProductsList;
  featuredProducts: ProductsList;
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  try {
    const config = getConfig({ locale: context.locale || "ar" });
    const categoriesPromise = getCategories(config, CATEGORIES_ROOT_ID);
    const productsPromise = getAllProducts(config, {
      filter: { category_id: { in: ["7442"] } },
    });
    const featuredProductsPromis = getAllProducts(config, {
      filter: { featured: { eq: "1" } },
    });

    const [categories, products, featuredProducts] = await Promise.all([
      categoriesPromise,
      productsPromise,
      featuredProductsPromis,
    ]);
    return {
      props: {
        categories,
        products,
        featuredProducts,
      },
      revalidate: 60 * 60 * 24,
    };
  } catch (error) {
    return {
      notFound: true,
    };
  }
}

export default function Home({
  categories,
  products,
  featuredProducts,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const [ref, inView] = useInView({
    triggerOnce: true,
  });
  const LazyComponent = dynamic(() => import("@components/ui/lazyoutube"), {
    loading: () => <div className="text-center mt-8">Loading...</div>,
  });
  const { t } = useTranslation();
  const sliderRef = useRef<Slider>(null);
  const router = useRouter();
  const [emptyBanners, setEmptyBanners] = useState(false);

  const cheerio = require("cheerio");
  const [showSVG, setShowSVG] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [banners, setBanners] = useState([]);

  const [promoPopup, setPromoPopupData] = useState(null);
  const { openModal, closeModal } = useUI();
  const { loggedIn, showDiscount } = useAuth();
  const [lazy, isLazy] = useState(false);

  async function getPromoBannerData(locale: string) {
    try {
      var queryGet = `
      query {
        getInitiatePromoBanners{
          data{
            banners_id,
            title,
            bannerimage,
            link,
            sort_order,
            target,
            status,
            created_time
          
          }
        }
        }
    `;

      const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet, locale: "ar" }),

        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("banner Response Data ====>", data);

      if (data.data.getInitiatePromoBanners.data.length === 0) {
        setEmptyBanners(true);
        return;
      }

      const array = await data.data.getInitiatePromoBanners.data.map(
        (item: any) => {
          return {
            title: item.title,
            id: item.banners_id,
            status: item.status,
            link: item.link,
            image: item.bannerimage,
            target: item.target,
            sortOrder: item.sort_order,
            created_at: item.created_time,
            // updated_at: item.updated_at,
          };
        }
      );
      const numAscending = array.sort(
        (a: any, b: any) => a.sortOrder - b.sortOrder
      );
      console.log("numAscending:", numAscending);
      setBanners(numAscending);
      return data;
    } catch (e) {
      console.log("ERROR 500");
      console.log(e);
    }
  }

  async function getPromoPopup(locale: string) {
    try {
      var queryGet = `
    query{
      getInitiatePopup{
        html
      }
      }
  `;

      const res = await fetch(`${API_URL}/graphql`, {
        method: "POST",
        body: JSON.stringify({ query: queryGet, locale: "ar" }),

        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      console.log("promo Response Data ====>", data);

      const html = data.data.getInitiatePopup.html;
      setPromoPopupData(html);

      return data;
    } catch (e) {
      console.log("ERROR 500");
      console.log(e);
    }
  }



  useEffect(() => {
    if (promoPopup == null) {
      setShowPopup(false);
    } else {
      const popupShownBefore = sessionStorage.getItem("popupShown");
      if (!popupShownBefore) {
        setShowPopup(true);
        sessionStorage.setItem("popupShown", "true");
      }
    }
    // setShowPopup(true);
    getPromoPopup("ar");
    getPromoBannerData("ar");

    const timer = setTimeout(() => {
      setShowSVG(true);
    }, 3000);
    return () => clearTimeout(timer);
  }, [promoPopup]);

  {
    /* extract image */
  }
  function extractImageSrc(promoPopup: any) {
    if (promoPopup != null) {
      const $ = cheerio.load(promoPopup);
      const imageSrc = $("a img").attr("src");
      return imageSrc;
    } else {
      const imageSrc = "";
      return imageSrc;
    }
  }
  const imageSrc = extractImageSrc(promoPopup);

  {
    /* extract image link */
  }
  function extractHrefSrc(promoPopup: any) {
    if (promoPopup != null) {
      const $ = cheerio.load(promoPopup);
      const hrefSrc = $("a").attr("href");
      return hrefSrc;
    } else {
      const hrefSrc = "";
      return hrefSrc;
    }
  }

  const hrefSrc = extractHrefSrc(promoPopup);

  const handleBannerClick = (link: string) => {
    TagManager.dataLayer({
      dataLayer: {
        event: "select_promotion",
        link: link,
      },
    });
    router.push(link);
  };

  return (
    <>
      <Head>
        <title>
          {t("home:metaTitle")} | {t("common:rafraf")}
        </title>
        <link rel="canonical" href="https://rafraf.com/ar" />
      </Head>
      {/* marketing popup */}
      {showPopup && (
        <div className="popup__home__page">
          {/* Mobile popup */}
          <div className="relative block">
            <div
              className="absolute bg-white z-40 rounded-sm animate__animated animate__fadeIn animate__faster"
              style={{
                filter: "drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))",
                height: "auto",
                width: "400px",
                transform: "translateX(-50%)",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                borderRadius: "8px",
                zIndex: "9999",
                position: "fixed",
                top: "30%",
                left: "50%",
                backgroundColor: "#fff",
              }}
            >
              {
                <div className="absolute left-0">
                  <div
                    dir="ltr"
                    className="pb-3 relative close__btn"
                    style={{ alignItems: "center" }}
                  >
                    {showSVG && (
                      <svg
                        version="1.1"
                        id="Capa_1"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 460.775 460.775"
                        className="w-4 h-4 m-2 cursor-pointer absolute top-0 z-10"
                        onClick={() => setShowPopup(false)}
                      >
                        <path
                          d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                      c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                      c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                      c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                      l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                      c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                        />
                      </svg>
                    )}

                    {/* {imageSrc && <Image height="600" width="600" src={imageSrc} alt="" />} */}
                    <a href={hrefSrc}>
                      <img src={imageSrc} alt="" />
                    </a>
                  </div>
                </div>
              }
            </div>
          </div>

          {/* Desktop popup */}
          {/* <div className="md:block popup__home__page">
            <div
                className="absolute top-0  bg-white z-40 rounded-sm animate__animated animate__fadeIn animate__faster"
                style={{
                  filter: "drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))",
                  height: "500px",
                  width: "500px",
                  transform: "translateX(-50%)",
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  borderRadius: '8px',
                  zIndex: '9999',
                  position: 'fixed',
                  top: '50%',
                  left: '50%',
                  backgroundColor: '#fff',
                }}
              >
                <div className="absolute left-0">
                  <div
                    dir="ltr"
                    className="pb-3 relative close__btn"
                    style={{  alignItems: "center" }}
                  >
                    <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px"
                      viewBox="0 0 460.775 460.775" className="w-4 h-4 m-2 cursor-pointer absolute top-0 z-10" onClick={()=> setShowPopup(false)}>
                    <path d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                      c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                      c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                      c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                      l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                      c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"/>
                    </svg>
                    <img src={imageSrc} alt="" />
                  </div>
                </div>
            </div>
          </div> */}
        </div>
      )}

      {/* Main Banner */}
      <div className="relative block md:hidden cursor-pointer">
        <div className="-mt-11">
          <Slider
              ref={sliderRef}
              slidesToShow={1}
              rtl={false}
              className={s.slider}
              draggable={true}
              infinite={true}
              centerMode={false}
              arrows={false}
              dots={true}
          >
            {banners &&
                banners.map((baner: any, key) => {
                  if (
                      baner.status === true &&
                      baner.title.includes("mobile-banner")
                  ) {
                    return (
                        <div key={key} className="w-full h-24 flex items-center justify-center">
                          <Image
                              src={`https://api.rafraf.com/pub/media${baner.image}`}
                              alt="قطع غيار سيارات"
                              layout="fill"
                              objectFit="fill"
                              className="w-full h-full"
                              onClick={() => router.push(baner.link)}
                          />
                        </div>
                    );
                  }
                })}
          </Slider>
        </div>
        {/* <div  onClick={() => sliderRef.current?.slickNext()} className="rotateNext shadow-md rounded flex justify-center items-center bg-grey text-white font-bold text-lg leading-5 uppercase text-center hover:bg-grey-dark active:bg-grey-darker disabled:bg-grey disabled:text-darkgrey disabled:cursor-default transition-all h-8 w-8 shadow-none mx-2">
            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform"><g clip-path="url(#clip0_912_25434)"><path d="M15 4L8 11L1 4" stroke="white" stroke-width="1.6" stroke-linecap="round"></path></g><defs><clipPath id="clip0_912_25434"><rect width="16" height="15" fill="white" transform="translate(16 15) rotate(-180)"></rect></clipPath></defs></svg>
          </div>


          <div  onClick={() => sliderRef.current?.slickPrev()} className="rotatePrev shadow-md rounded flex justify-center items-center bg-grey text-white font-bold text-lg leading-5 uppercase text-center hover:bg-grey-dark active:bg-grey-darker disabled:bg-grey disabled:text-darkgrey disabled:cursor-default transition-all h-8 w-8 shadow-none mx-2">
            <svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform"><g clip-path="url(#clip0_912_25434)"><path d="M15 4L8 11L1 4" stroke="white" stroke-width="1.6" stroke-linecap="round"></path></g><defs><clipPath id="clip0_912_25434"><rect width="16" height="15" fill="white" transform="translate(16 15) rotate(-180)"></rect></clipPath></defs></svg>
          </div> */}

        <div
          className="relative w-full"
          // style={{
          //   background: "rgba(18, 18, 18, 0.1)",
          // }}
        >
          <Container el="section" className="h-0">
            {/* <Categoires> */}
            <Selection className=" pb-8 px-0" />
          </Container>
        </div>
      </div>

      <div className="relative hidden md:block cursor-pointer my__slider__new p-23 mr-2533">
        {/* <Image
            src={BANNER_DESKTOP}
            alt="قطع غيار سيارات"
            layout="fill"
            objectFit="cover"
            onClick={() => router.push("/parts/7442")}
          /> */}

        <Slider
          ref={sliderRef}
          slidesToShow={1}
          rtl={false}
          className={s.slider}
          draggable={true}
          infinite={true}
          centerMode={false}
          arrows={false}
          dots={true}
        >
          {banners &&
            banners.map((baner: any, key: Key) => {
              if (
                baner.status == true &&
                baner.title.includes("desktop-banner")
              ) {
                return (
                  <Image
                    key={key}
                    src={`https://api.rafraf.com/pub/media${baner.image}`}
                    alt="قطع غيار سيارات"
                    layout="fill"
                    objectFit="contain"
                    onClick={() => handleBannerClick(baner.link)}
                  />
                );
              }
            })}
        </Slider>
        {/* <div  onClick={() => sliderRef.current?.slickNext()} className="rotateNext shadow-md rounded flex justify-center items-center bg-grey text-white font-bold text-lg leading-5 uppercase text-center hover:bg-grey-dark active:bg-grey-darker disabled:bg-grey disabled:text-darkgrey disabled:cursor-default transition-all h-8 w-8 shadow-none mx-2">
Click={() => sliderRef.current?.slickNext()} className="rotateNext shadow-md rounded flex justify-center items-center bg-grey text-white font-bold text-lg leading-5 uppercase text-center hover:bg-grey-dark active:bg-grey-darker disabled:bg-grey disabled:text-darkgrey disabled:cursor-default transition-all h-8 w-8 shadow-none mx-2">

<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform"><g clip-path="url(#clip0_912_25434)"><path d="M15 4L8 11L1 4" stroke="white" stroke-width="1.6" stroke-linecap="round"></path></g><defs><clipPath id="clip0_912_25434"><rect width="16" height="15" fill="white" transform="translate(16 15) rotate(-180)"></rect></clipPath></defs></svg>
</div>


<div  onClick={() => sliderRef.current?.slickPrev()} className="rotatePrev shadow-md rounded flex justify-center items-center bg-grey text-white font-bold text-lg leading-5 uppercase text-center hover:bg-grey-dark active:bg-grey-darker disabled:bg-grey disabled:text-darkgrey disabled:cursor-default transition-all h-8 w-8 shadow-none mx-2">
<svg width="16" height="15" viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="transform"><g clip-path="url(#clip0_912_25434)"><path d="M15 4L8 11L1 4" stroke="white" stroke-width="1.6" stroke-linecap="round"></path></g><defs><clipPath id="clip0_912_25434"><rect width="16" height="15" fill="white" transform="translate(16 15) rotate(-180)"></rect></clipPath></defs></svg>
</div> */}

        <div
          className=" w-full form__sec"
          // style={{
          //   background: "rgba(18, 18, 18, 0.1)",
          // }}
        >
          <Container el="section">
            <h1 className="sm:w-auto md:w-1/3 text-5xl leading-snug font-bold pt-52 text-transparent">
              {/* {t("home:bannerTitle")} */}
            </h1>
            {/* <div style={{ minHeight: "200px" }}></div> */}

            {/* <div
              role="doc-subtitle"
              className="sm:w-auto md:w-1/2 h-14 text-2xl leading-7 text-white pt-4"
              >
              {t("home:bannerSubtitle")}
            </div> */}
            <Selection className="pt-14 pb-8 px-0" />
          </Container>
        </div>
      </div>

      {/* Shop By Categories */}
      <Container el="section" className="pt-64 md:pt-1 pb-9">
        <div className="flex items-center justify-center">
          <h1 style={{ fontSize: "36px" }}>قطع سيارتك .. لباب بيتك</h1>
        </div>
        <div className="flex items-center justify-center">
          <p>رفرف متجر إلكتروني مختص لبيع قطع غيار السيارات</p>
        </div>
        {/* <HomeCategories categories={categories} /> */}
      </Container>
      {/* <Timer /> */}
      {/* <Carousel></Carousel> */}
      <Container el="section">
        <FlashSales
          products={featuredProducts?.products || []}
          title={t("home:flashSales.title_brake_pad")}
          routerId={"ar/search?q=kbf"}
        />
      </Container>

      <a id="wablock" className="flex items-center justify-center mb-6 md:mb-0">
        <img
          src="../images/home/WABlock.webp"
          alt=""
          onClick={() => {
            // Your code to handle the image click goes here
            window.location.href = "https://wa.me/966536722255";
          }}
          className="cursor-pointer max-h-96 md:max-h-full"
        />
      </a>
      {/* <Carousel/> */}

      {/* Flash Sales
      <Container el="section">
      <FlashSales
      products={products?.products || []}
      <Timer/>
      <Timer/>
      title={t("home:flashSales.oils")}
      routerId={"parts/7442"}
      />
    </Container> */}
      <Container>
        <Oil />
      </Container>

      <Container el="section">
        <ReviewsFromCustomers />
      </Container>

      <Container el="section">
        <ShopByBrand />
      </Container>

      <Container className="mb-8">
        <H2
          className="gap-6 bg-gradient-to-br hover:from-blue-700 hover:to-red-700 hover:font-extrabold hover:text-transparent bg-clip-text duration-150 mb-4"
          style={{ display: "flex", alignItems: "center" }}
        >
          {router.locale === "ar"
            ? t("home:ecksDee.text")
            : t("home:ecksDee.text")}
          <span
            className="bg-blue-700"
            style={{ flex: "1", height: "1px", margin: "0 10px" }}
          ></span>
        </H2>

        <div className="lg:flex lg:space-x-0 lg:space-x-reverse">
          <Container className="mb-4 lg:mb-0 sm:w-full lg:w-1/3 lg:pr-2 sm:pr-0">
            <BlogRow
              image={t("static/blogs:blog_11.imageUrl")}
              title={t("static/blogs:blog_11.title")}
              date={t("static/blogs:blog_11.date")}
              id={t("static/blogs:blog_11.id")}
            />
          </Container>

          <Container className="mb-4 lg:mb-0 sm:w-full lg:w-1/3 lg:pr-2 sm:pr-0">
            <BlogRow
              image={t("static/blogs:blog_12.imageUrl")}
              title={t("static/blogs:blog_12.title")}
              date={t("static/blogs:blog_12.date")}
              id={t("static/blogs:blog_12.id")}
            />
          </Container>

          <Container className="mb-4 lg:mb-0 sm:w-full lg:w-1/3 lg:pr-2 sm:pr-0">
            <BlogRow
              image={t("static/blogs:blog_9.imageUrl")}
              title={t("static/blogs:blog_9.title")}
              date={t("static/blogs:blog_9.date")}
              id={t("static/blogs:blog_9.id")}
            />
          </Container>
        </div>
      </Container>

      <div ref={ref}>{inView && <LazyComponent />}</div>


      {/* <ACDelco products={products}/> */}

      {/* </Container> */}
      {/*   
      <Container el="section">a
      <HomeCategories categories={categories} />
    </Container> */}
    </>
  );
}

Home.Layout = Layout;
