import React from "react";
import { useRouter } from "next/router";

const Oil = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col  px-1 md:flex-row md:space-x-2 pt-16">
      {/* First Rectangle */}
      <div
        className="cursor-pointer relative group w-full md:w-1/2 h-96 rounded overflow-hidden shadow-lg flex flex-col justify-between items-center bg-white hover:bg-grey transition duration-300 ease-in-out"
        onClick={() => {
          window.location.href = "ar/parts/7442/";
        }}
      >
        <img
          src="/images/aboutus/american-oils.webp"
          className="h-96 w-96 flex items-center justify-center"
        />
        <div className="px-6 py-4">
          <div>
            <img
              src="/images/aboutus/oils.png"
              className="absolute left-0 top-0 h-17 w-16 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in"
            />
          </div>
        </div>
      </div>

      {/* Second Rectangle */}
      <div
        className="cursor-pointer relative group w-full md:w-1/2 h-96 rounded overflow-hidden shadow-lg flex flex-col justify-between items-center bg-white hover:bg-grey transition duration-300 ease-in-out"
        onClick={() => {
          window.location.href = "ar/featured/acdelco";
        }}
      >
        <img
          src="/images/aboutus/filter.webp"
          className="h-96 w-96 flex items-center justify-center"
        />
        <div className="px-6 py-4">
          <div>
            <img
              src="/images/aboutus/xD.png"
              className="absolute left-0 top-0 h-17 w-14 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Oil;
