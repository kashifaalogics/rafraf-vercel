import { FunctionComponent, useEffect, useState } from "react";
import { Dropdown, Image, Link, TOP_Z_INDEX } from "@components/ui";
import { Container } from "@components/ui";
import { LocaleNav, Usernav } from "@components/common";
import { BurgerMenu, Search as SearchIcon } from "@components/icons";
import { A } from "@components/typography";
import useTranslation from "next-translate/useTranslation";
import { useSearchEngine, useViewport, useCustomer } from "@common/hooks";
import { useUI } from "@components/ui/constext";
import SearchEngineDropdown from "../SearchEngineDropdown";
import { WHATSAPP_LINK } from "@framework/const";
import { useRouter } from "next/router";
import CarSelected from "@components/ui/CarSelected/CarSelected";
import { useStore } from "@common/state";

// import ReactStickyBox from "react-sticky-box";

interface Props {}

const Navbar: FunctionComponent<Props> = () => {
  const {
    setPageNumber,
    setIsAltFilter,
    setIsGenuineFilter,
    setManufacturerACDelcoFilter,
    setManufacturerAvonFilter,
    setManufacturerDeluxFilter,
    setManufacturerHyundaiFilter,
    setManufacturerMotorcraftFilter,
    setManufacturerToyotaFilter,
    setManufacturerUSstarFilter,
    setSortBy,
  } = useSearchEngine();
  const { t } = useTranslation();
  const { breakpoint: bp } = useViewport();
  const { openSidebar } = useUI();
  const {
    search,
    setSearch,
    recordAnalytic,
    searchCookie,
    recordAPI,
    setPageSize,
  } = useSearchEngine();
  const [inputFocus, setInputFocus] = useState(false);
  const router = useRouter();
  const { locale } = useRouter();
  const { customer } = useCustomer();
  const renderCarSelected = ["md", "lg", "xl"].includes(bp);

  useEffect(() => {
    if (router.query.q) {
      setSearch(router.query.q as string);
    }
  }, [router.query]);

  async function serachQuery(e: any) {
    setPageSize(10);
    setSearch(e.target.value);
  }
  return (
    <>
      <div
        className="w-full"
        style={{
          height:
            bp === "sm"
              ? router.asPath === "/checkout"
                ? "45px"
                : "88px"
              : router.asPath === "/checkout"
              ? "55px"
              : "80px",
        }}
      ></div>
      <div
        className={`bg-white fixed top-0 right-0 left-0 ${
          router.asPath === "/checkout" ? "h-19" : ""
        }`}
        style={{
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.15)",
          zIndex: TOP_Z_INDEX,
        }}
      >
        {/* <div className={`bg-red text-white p-2 md:p-1 text-center ${router.asPath === "/checkout"? "hidden" : ""}`}> */}
        {/* <A target="_blank" href={WHATSAPP_LINK} title="تواصل على الواتسآب"> */}
        {/* <div
              className="inline-flex items-center h-100%"
              onClick={() => {
                // recordAPI({behaviour: "whatsapp", source: "navbar"})
                recordAnalytic({
                  email: customer?.email || "",
                  name: `${customer?.firstname || ""} ${
                    customer?.lastname || ""
                  }`.trim(),
                  searched_query: "",
                  userID: searchCookie,
                  results_clicked_on: "",
                  language: locale || "",
                  part_number: "",
                  behavior: "Discount_navBar",
                });
              }}
            > 
              <div className="px-1">{t("common:DiscountNavBar")}</div>{" "}
              <div className="flex gap-1">
                <img className="w-5" src={"/images/SA.webp"} />
                <img className="w-5" src={"/images/SA.webp"} />
                <img className="w-5" src={"/images/SA.webp"} />
              </div>
              {t("common:star")}
            </div> */}
        {/* </A> */}
        {/* </div> */}

        <div
          className={`bg-black text-white p-2 md:p-1 text-center ${
            router.asPath === "/checkout" ? "hidden" : ""
          }`}
        >
          <A target="_blank" href={WHATSAPP_LINK} title="تواصل على الواتسآب">
            <div
              className="inline-flex items-center h-full"
              onClick={() => {
                // recordAPI({behaviour: "whatsapp", source: "navbar"})
                recordAnalytic({
                  email: customer?.email || "",
                  name: `${customer?.firstname || ""} ${
                    customer?.lastname || ""
                  }`.trim(),
                  searched_query: "",
                  userID: searchCookie,
                  results_clicked_on: "",
                  language: locale || "",
                  part_number: "",
                  behavior: "Whatsapp_Navbar",
                });
              }}
            >
              {t("common:topNotification")}
              <div className="flex gap-1 px-1">
                {/* <img className="w-5" src={"/images/SA.webp"} /> */}
                {/* <img className="w-5" src={"/images/SA.webp"} /> */}
                {/* <img className="w-5" src={"/images/SA.webp"} /> */}
              </div>
              {/* {t("common:star")} */}
              <img className="w-5" src={"/images/whatsapp.webp"} />
            </div>
          </A>
        </div>
        <Container>
          <div
            className={`h-16 flex flex-1 items-center gap-3 ${
              bp === "md" ? "mt-3 mb-3" : "" // Apply margin on desktop only
            } md:h-12`}
          >
            <div
              className="cursor-pointer block md:hidden"
              onClick={openSidebar}
            >
              <BurgerMenu />
            </div>
            <Link prefetch={false} href="/">
              <A>
                <div
                  className={`relative flex items-center justify-center h-9 w-9 ${
                    router.asPath === "/checkout"
                      ? "h-9 w-9"
                      : "md:h-24 md:w-10 h-9 w-9"
                  }`}
                >
                  <img
                    src={"/logo/rafraf.webp"}
                    className="hidden lg:block"
                    alt="rafraf logo"
                  />
                  <img
                    src={"/logo/rafraf-small.webp"}
                    className="w-4/5	 block lg:hidden"
                    alt="rafraf logo"
                  />
                </div>
              </A>
            </Link>
            <div className="hidden md:block">
              <LocaleNav />
            </div>
            <div
              className={`relative md:border-2 border-2 md:h-12 h-9 md:border-darkgrey border-gray rounded-md flex flex-grow  ${
                router.asPath === "/checkout" ? "hidden" : "flex"
              }`}
            >
              {renderCarSelected && (
                <div
                  className={`relative flex flex-grow ${
                    router.asPath === "/checkout" ? "hidden" : "flex"
                  }`}
                >
                  <CarSelected />
                </div>
              )}
              <Dropdown open={Boolean(search && inputFocus)}>
                <SearchEngineDropdown />
              </Dropdown>
              <input
                className={`px-1 md:px-6 w-full`}
                type="text"
                placeholder={t("common/navbar:searchPartPlaceholder")}
                onChange={(e) => serachQuery(e)}
                onFocus={() => setInputFocus(true)}
                onBlur={() => {
                  setTimeout(() => setInputFocus(false), 500);
                }}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    // recordAPI({behaviour: "searchquery", source: "navbar"})
                    router.push("/search?q=" + [e.currentTarget.value]);
                    recordAnalytic({
                      email: customer?.email || "",
                      name: `${customer?.firstname || ""} ${
                        customer?.lastname || ""
                      }`.trim(),
                      searched_query: search,
                      userID: searchCookie,
                      results_clicked_on: "",
                      language: locale || "",
                      part_number: "",
                      behavior: "Enter",
                    });
                  }
                  setPageNumber(1);
                  setSortBy("");
                  setIsAltFilter(false);
                  setIsGenuineFilter(false);
                  setManufacturerACDelcoFilter(false);
                  setManufacturerAvonFilter(false);
                  setManufacturerDeluxFilter(false);
                  setManufacturerHyundaiFilter(false);
                  setManufacturerMotorcraftFilter(false);
                  setManufacturerToyotaFilter(false);
                  setManufacturerUSstarFilter(false);
                }}
              />
              <div className="px-1 md:px-4 flex justify-center items-center">
                <SearchIcon searched_query={search} icon_color={"#999999"} />
              </div>
            </div>
            <div
              className={`${
                router.asPath === "/checkout" ? "flex flex-grow" : "hidden"
              } justify-center`}
            >
              <A
                target="_blank"
                href={WHATSAPP_LINK}
                title="تواصل على الواتسآب"
              >
                <div
                  className={`relative flex items-center justify-center gap-2`}
                >
                  <div>{t("common/navbar:secureCheckout")}</div>
                  <img className="w-6" src={"/images/whatsapp.webp"} />
                </div>
              </A>
            </div>
            <div className="md:ml-6">
              <Usernav />
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Navbar;
