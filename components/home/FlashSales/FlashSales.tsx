import { H2 } from "@components/typography";
import { FunctionComponent } from "react";
import useTranslation from "next-translate/useTranslation";
import Slider from "@ant-design/react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";
import { Button } from "@components/ui";
import useLangDirection from "@utils/language/useLangDirection";
import { Arrow } from "@components/icons";
import cn from "classnames";
import { Product } from "@common/types/product";
import { ProductCard } from "@components/product";
import s from "./FlashSales.module.css";
import { useViewport } from "@common/hooks";
import { useRouter } from 'next/router'
import { useState, useEffect } from "react";

interface Props {
  products: Product[];
  title: string;
  routerId: string;
}

const FlashSales: FunctionComponent<Props> = ({ products, title, routerId }) => {
  const { t } = useTranslation();
  const dir = useLangDirection();
  const { breakpoint } = useViewport();
  const sliderRef = useRef<Slider>(null);
  const router = useRouter()

  const [avaliableProducts, setAvaliableProducts] = useState([]) as any
  useEffect(() => {
    if(routerId !== "parts/7442") {
      setAvaliableProducts(products)
      return
    }
    const filtered = products.filter((p) => {
      if(p.stock_status === "IN_STOCK") {
        return p
      }
    })
    console.log("filtered:", filtered.slice(0, 8))
    setAvaliableProducts(filtered.slice(0, 8))
  }, [])

  if (breakpoint === "sm") {
    return (
      <>
        <div className="mb-12">
          <div className="flex justify-between items-center gap-6">
            <H2>{title}</H2>
            
          </div>

          <div
            className="flex flex-wrap gap-2 py-6"
          >
            {avaliableProducts.map((p: any) => (
              <div className="flex-1" key={p.id}>
                <ProductCard product={p} />
              </div>
            ))}
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <div className="mt-6">
          <div className="flex justify-between items-center gap-6 mb-12">
            <H2 className="bg-gradient-to-br hover:from-blue-700 hover:to-red-700 hover:font-extrabold hover:text-transparent bg-clip-text duration-150">
              {title}
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
            slidesToShow={4}
            rtl={dir.rtl}
            className={s.slider}
            draggable={true}
            centerMode={true}
            arrows={false}
          >
            {avaliableProducts.map((p: any) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </Slider>
        </div>
      </>
    );
  }
};

export default FlashSales;
