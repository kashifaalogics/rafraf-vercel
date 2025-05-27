import { H2 } from "@components/typography";
import Container from "../Container";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import PlayButton from "@components/ui/playButton/PlayButton";
import { useState } from "react";
import ModalThree from "@components/ui/modalThree/ModalThree";
import YoutubeModal from "@components/ui/youtubeModal/youtubeModal";

function Lazyoutube() {
  const { t } = useTranslation();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isActive, setIsActive] = useState(false);

  const handleClick = () => {
    setIsActive((prevIsActive) => !prevIsActive);
    setTimeout(() => {
      setIsModalOpen(true);
    }, 300);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Container>
      <H2
        className="gap-6 bg-gradient-to-br hover:from-blue-700 hover:to-red-700 hover:font-extrabold hover:text-transparent bg-clip-text duration-150 mb-3"
        style={{ display: "flex", alignItems: "center" }}
      >
        {router.locale === "ar"
          ? t("home:youtube.text")
          : t("home:youtube.text")}
        <span
          className="bg-blue-700"
          style={{ flex: "1", height: "1px", margin: "0 10px" }}
        ></span>
      </H2>

      <div className="flex items-center justify-center my-8 flex-wrap">
        <div className="w-full lg:w-2/3 xl:w-1/2 relative">
          <img
            src="/images/Gearboxworth.webp"
            alt=""
            className="w-full md:w-full bg-black"
          />
          <PlayButton
            onClick={handleClick}
            className={`cursor-pointer ${isActive ? "animate-ping-once" : ""}`}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        <div className="my-8 mx-8">
          <div
            className="box-content h-64 w-64 p-6 shadow-md rounded-md mb-4 transition duration-300 ease-in-out transform bg-gradient-to-r from-white to-blue-300 hover:scale-105"
            onClick={() => router.push("/parts/all/product/20-bs405cus")}
          >
            <img
              src="/images/20k.webp"
              alt=""
              className="mx-auto block max-w-full h-auto"
            />
          </div>
          <div
            className="box-content h-64 w-64 p-6 shadow-md rounded-md transition duration-300 ease-in-out transform bg-gradient-to-r from-white to-blue-300 hover:scale-105"
            onClick={() => router.push("/parts/all/product/40-bs406cus")}
          >
            <img
              src="/images/40k.webp"
              alt=""
              className="mx-auto block max-w-full h-auto"
            />
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ModalThree open={isModalOpen} onClose={handleCloseModal}>
          <YoutubeModal />
        </ModalThree>
      )}
    </Container>
  );
}

export default Lazyoutube;
