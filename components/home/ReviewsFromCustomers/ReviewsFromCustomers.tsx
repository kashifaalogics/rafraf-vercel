import { A, H2, Subtitle } from "@components/typography";
import { FunctionComponent, useState } from "react";
import useTranslation from "next-translate/useTranslation";
import Slider from "@ant-design/react-slick";
import { Image, Link } from "@components/ui";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useRef } from "react";
import { Button } from "@components/ui";
import useLangDirection from "@utils/language/useLangDirection";
import { Arrow } from "@components/icons";
import { Category } from "@common/types/category";
import cn from "classnames";
import s from "./ReviewsFromCustomers.module.css";
import { useViewport, useSearchEngine } from "@common/hooks";
import { useRouter } from 'next/router';
import Cat from '@assets/data/Reviews.json';
import ModalToo from "@components/ui/ModalToo";

interface Props {
}

const ReviewsFromCustomers: FunctionComponent<Props> = () => {
  const { t } = useTranslation();
  const dir = useLangDirection();
  const { recordAPI } = useSearchEngine();
  const { breakpoint: bp } = useViewport();
  const sliderRef = useRef<Slider>(null);
  const router = useRouter();

  // State for modal
  const [openModal, setOpenModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState('');

  if (bp === "sm") {
    return (
      <>
        <div className="my-28">
          <div className="flex justify-between gap-6 items-center mb-12">
            <H2>
              {t("home:Reviews.text")}{" "}
            </H2>
          </div>
  
          <div className="flex-col"> 
            {Cat.map((c, i) => (
              <div className="flex-1 p-1" key={i}> 
                <A 
                // onClick={() => recordAPI({behaviour: "onmaker", source: "homepage"})}
                >
                  <div className="px-10 flex flex-col justify-center items-center">
                    <div className="relative w-80 h-80 -m-12"> 
                      <Image
                        className="block"
                        src={c.image}
                        fallbackSrc={"/categories/" + c.nameEng + ".png"}
                        alt={c.nameEng}
                        layout="fill"
                        objectFit="scale-down"
                      />
                    </div>
                  </div>
                </A>
              </div>
            ))}
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
              {t("home:Reviews.text")}
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
                  "h-8 w-8 shadow-none mx-2, ",
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
            slidesToShow={3}
            rtl={dir.rtl}
            className={s.slider}
            arrows={false}
          >
            {Cat.map((c, i) => (
              <A key={i}>
                <div className="px-100 flex flex-col justify-center items-center mr--20">
                  <div
                    className="relative rounded-full flex items-center justify-evenly"
                    style={{
                      width: "400px",
                      height: "200px",
                    }}
                  >
                    <Image
                      onClick={() => {
                        setModalImageSrc(c.image);
                        setOpenModal(true);
                      }}
                      className="block w-[300px]"
                      src={c.image}
                      fallbackSrc={`/Reviews/${c.nameEng}`}
                      alt={c.nameEng}
                      layout="fill"
                      objectFit="scale-down"
                    />
                  </div>
                  <Subtitle className="text-center">
                    {/* {router.locale === 'ar' ? c.nameArabic : c.nameEng} */}
                  </Subtitle>
                </div>
              </A>
            ))}
          </Slider>
        </div>

        {openModal && (
          <ModalToo open={openModal} onClose={() => setOpenModal(false)}>
            <Image src={modalImageSrc} alt="Image in modal"/>
          </ModalToo>
        )}
      </>
    );
  }
};

export default ReviewsFromCustomers;
