import React from "react";
import { Image } from "@components/ui";

const AcdelcoFilters = () => {
  return (
    <>
    <div className="max-w-2xl w-100 h-96 rounded overflow-hidden shadow-lg">
            <Image src='./maker/NISSAN.png' className="w-full h-2/3" alt="Maker Image"/>
      <div className="px-6 py-4">
        <div className="font-bold text-2xl mb-2">Title</div>
        <p className="text-gray-700 text-base">desc</p>
      </div>
      <div className="px-6 py-4">
        <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">
        </span>
      </div>
    </div>
    </>
  );
};

export default AcdelcoFilters;
