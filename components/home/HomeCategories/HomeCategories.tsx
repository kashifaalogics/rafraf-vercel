import { A, H2, Subtitle } from "@components/typography";
import { FunctionComponent } from "react";
import useTranslation from "next-translate/useTranslation";
import Slider from "@ant-design/react-slick";
import { Image, Link, HScrollable } from "@components/ui";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";
import { Button } from "@components/ui";
import useLangDirection from "@utils/language/useLangDirection";
import { Arrow } from "@components/icons";
import { Category } from "@common/types/category";
import cn from "classnames";
import s from "./HomeCategories.module.css";
import { useViewport, useSearchEngine } from "@common/hooks";
import NextImage from "next/image";
import { recordAPI } from "framework/analytics";

interface Props {
  categories: Category[];
}

const HomeCategories: FunctionComponent<Props> = ({ categories }) => {
  const { t } = useTranslation();
  const dir = useLangDirection();
  const { breakpoint: bp } = useViewport();
  const sliderRef = useRef<Slider>(null);

  if (bp === "sm") {
    return (
      <>
        <div className="mt-28 my-10">

          <div className="flex flex-wrap">
          <HScrollable className="grid grid-rows-2 grid-flow-col">
            {categories.map((c, i) => (
              <Link prefetch={false} key={c.id} href={`/parts/${c.id}`}>
                <A 
                // onClick={() => recordAPI({behaviour: "on_category", source: "homepage"})}
                >
                  <div className="flex flex-col justify-center items-center mx-4 rounded-full bg-transparent">
                    <div
                      className="relative rounded-full flex items-center justify-center"
                      style={{
                        width: "110px",
                        height: "110px",
                      }}
                    >
                      <NextImage
                            loader={({ src, width, quality }: any) => {
                              return `${src}?w=${width}&q=${quality || 85}&?fm=webp`
                            }
                            }
                            layout='fill'
                            quality={20}
                            loading="lazy"
                            objectFit="scale-down"
                            src={"/categories/" + c.id + ".webp"}
                            alt={c.name}
                          />
                    </div>
                  </div>
                    <div className="text-center text-sm py-2 font-semibold customClasss">{c.name}</div>
                </A>
              </Link>
            ))}
          </HScrollable>
          {/* <div className="mx-auto w-12 h-1 bg-gray-300 rounded-md mt-4"></div> */}
          </div>

        </div>
      </>
    );
  } else {
    return (
      <>
       <div className="my-28">
       <div className="flex justify-between gap-6 items-center mb-12">
       <H2 className="bg-gradient-to-br hover:from-blue-700 hover:to-red-700 hover:font-extrabold hover:text-transparent bg-clip-text duration-150">
          {t("home:shopByCategory.text")}{" "}
            </H2>
            <div className="bg-blue-700 flex-auto" style={{ height: "1px" }}></div>
            <div className={cn("flex", dir.ltr ? "flex-row-reverse" : "")}>
              <Button
                color="grey"
                className={cn(
                  "h-8 w-8 shadow-none mx-2",
                  dir.rtl ? "" : "mr-0"
                )}
                onClick={() => {
                  sliderRef.current?.slickNext();
                }}
              >
                <Arrow color="white" direction="right" />
              </Button>
              <Button
              style={{ backgroundColor: 'rgb(211, 47, 62)' }}
                  className={cn(
                  "h-8 w-8 shadow-none mx-2",
                  dir.rtl ? "ml-0" : ""
                )}
                onClick={() => {
                  sliderRef.current?.slickPrev();
                }}
              >
                <Arrow color="white" direction="left" />
              </Button>
            </div>
          </div>

          <Slider
            ref={sliderRef}
            slidesToShow={5}
            rtl={dir.rtl}
            className={s.slider}
            arrows={false}
          >
            {categories.map((c, i) => (
              <Link prefetch={false} key={c.id} href={`/parts/${c.id}`}>
                <A 
                // onClick={() => recordAPI({behaviour: "on_category", source: "homepage"})}
                >
                  <div className="flex flex-col justify-center items-center mx-10 rounded-full">
                    <div
                      className="relative rounded-full flex items-center justify-center "
                      style={{
                        width: "200px",
                        height: "200px",
                      }}
                    >
                      <NextImage
                            loader={({ src, width, quality }: any) => {
                              return `${src}?w=${width}&q=${quality || 85}&?fm=webp`
                            }
                            }
                            layout='fill'
                            quality={20}
                            loading="lazy"
                            objectFit="scale-down"
                            src={"/categories/" + c.id + ".webp"}
                            alt={c.name}
                          />
                    </div>
                  </div>
                    <Subtitle className="text-center">{c.name}</Subtitle>
                </A>
              </Link>
            ))}
          </Slider>
        </div>
      </>
    );
  }
};

export default HomeCategories;
