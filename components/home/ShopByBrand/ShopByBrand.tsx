import { A, H2, Subtitle } from "@components/typography";
import { FunctionComponent, useEffect } from "react";
import useTranslation from "next-translate/useTranslation";
import Slider from "@ant-design/react-slick";
import { Image, Link } from "@components/ui";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";
import { Button } from "@components/ui";
import useLangDirection from "@utils/language/useLangDirection";
import { Arrow } from "@components/icons";
import cn from "classnames";
import s from "./ShopByBrand.module.css";
import { useViewport, useSearchEngine } from "@common/hooks";
import makers from "@assets/data/makers.json";
import { useRouter } from "next/router";

interface Props {}

const ShopByBrand: FunctionComponent<Props> = () => {
  const { t } = useTranslation();
  const dir = useLangDirection();
  const { recordAPI } = useSearchEngine();
  const { breakpoint: bp } = useViewport();
  const sliderRef = useRef<Slider>(null);
  const router = useRouter();

  return (
    <div className={`my-28 ${s.shopByBrand}`}>
      <div className="flex justify-between gap-6 items-center mb-12">
        <H2 className={cn("hover:bg-gradient-to-br", s.categoryText)}>
          {t("home:shopByCategory.text")}
        </H2>
        {bp !== "sm" && (
          <>
            <div className="bg-blue-700 flex-auto" style={{ height: "1px" }}></div>
            <div className={cn("flex", dir.ltr ? "flex-row-reverse" : "")}>
              <Button
                color="grey"
                className={cn("h-8 w-8 shadow-none mx-2", dir.rtl ? "" : "mr-0")}
                onClick={() => {
                  sliderRef.current?.slickNext();
                }}
              >
                <Arrow color="white" direction="right" />
              </Button>
              <Button
                className={cn("h-8 w-8 shadow-none mx-2", dir.rtl ? "ml-0" : "")}
                onClick={() => {
                  sliderRef.current?.slickPrev();
                }}
              >
                <Arrow color="white" direction="left" />
              </Button>
            </div>
          </>
        )}
      </div>

      {bp === "sm" ? (
        <div className="flex flex-wrap">
          {makers.map((c, i) => {
            const route =
              i < makers.length - 2
                ? `/cars/${c.nameEng.toLowerCase()}`
                : `/`;

            return (
              <div className="flex-1 w-1/2 p-1" key={c.nameEng}>
                <div className="shadow p-3 h-48 flex justify-center items-center">
                  <Link prefetch={false} href={route}>
                    <A>
                      <div className="px-10 flex flex-col justify-center items-center">
                        <div className="relative w-28 h-28 rounded-full flex items-center justify-center">
                          <Image
                            className="block"
                            src={c.image}
                            fallbackSrc={`/categories/${c.nameEng}.png`}
                            alt={c.nameEng}
                            layout="fill"
                            objectFit="scale-down"
                          />
                        </div>
                        <Subtitle className="text-center text-sm">{c.nameEng}</Subtitle>
                      </div>
                    </A>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <Slider ref={sliderRef} slidesToShow={5} rtl={dir.rtl} className={s.slider} arrows={false}>
          {makers.map((c, i) => {
            const route =
              i < makers.length - 2
                ? `/cars/${c.nameEng.toLowerCase()}`
                : `/`;
            return (
              <Link prefetch={false} key={c.nameEng} href={route}>
                <A>
                  <div className="px-100 flex flex-col justify-center items-center mr--20">
                    <div
                      className="relative rounded-full flex items-center justify-center"
                      style={{
                        width: "100px",
                        height: "100px",
                      }}
                    >
                      <Image
                        className="block w-[150px]"
                        src={c.image}
                        fallbackSrc={`/categories/${c.nameEng}`}
                        alt={c.nameEng}
                        layout="fill"
                        objectFit="scale-down"
                      />
                    </div>
                    <Subtitle className="text-center">
                      {router.locale === "ar" ? c.nameArabic : c.nameEng}
                    </Subtitle>
                  </div>
                </A>
              </Link>
            );
          })}
        </Slider>
      )}
    </div>
  );
};

export default ShopByBrand;
