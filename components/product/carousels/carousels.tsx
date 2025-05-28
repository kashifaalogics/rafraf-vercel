import React, { useState } from "react";
import { Arrow } from "@components/icons";
import { Image } from "@components/ui";

const images = [
  "AcDelco10.webp",
  "desktop-american-oils-banner.webp",
  "topbanner.webp",
];

const Carousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const nextImage = () => {
    setCurrentIndex((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((currentIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="relative">
      <div className="w-full h-32 md:h-48 lg:h-64 overflow-hidden">
        <Image
          src={`/images/aboutus/${images[currentIndex]}`}
          alt="Carousel Image"
          className="object-cover w-full h-full"
        />
      </div>
      <button
        onClick={prevImage}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-0.5 mb-1 ml-2 text-white bg-blue hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-xs px-2 py-1.5 text-center"
      >
        <Arrow direction="left" color="#ffffff" className="w-4 h-4" />
      </button>
      <button
        onClick={nextImage}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-0.5 mb-1 mr-2 text-white bg-blue hover:bg-gradient-to-br shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-xs px-2 py-1.5 text-center"
      >
        <Arrow direction="right" color="#ffffff" className="w-4 h-4" />
      </button>
    </div>
  );
};

export default Carousel;
