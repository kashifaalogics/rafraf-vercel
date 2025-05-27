import React, { useEffect } from "react";
import { useStore } from "@common/state";
import { Cross } from "@components/icons";
import { useRouter } from "next/router";
import CarIcon from "../CarICon/CarIcon";
import urlMapper from "@assets/data/UrlMapperCars.json";


export default function CarSelected() {
  const carSelected = useStore((state) => state.carSelected);
  const clearCarSelected = useStore((state) => state.clearCarSelected);
  const isCarSelected = !carSelected.isEmpty;

  const router = useRouter();
  const locale = router.locale || 'en';
  const handleCarSelection = () => {
    const url  =  `${carSelected.cars?.[1].name}/${
      carSelected.cars?.[1].name
    }${carSelected.cars?.[0].name?.replace("-", "")}/${
      carSelected.cars?.[1].name
    }${carSelected.cars?.[0].name?.replace("-", "")}${
      carSelected.cars?.[2].year
    }`
    router.push("cars/" + urlMapper[String(url.toLowerCase().replaceAll(" ", "")) as keyof typeof urlMapper])
  };
  const deleteCar = () => {
    localStorage.removeItem("MAIN_CATEGORY");
  };

  const handleDeleteCar = () => {
    deleteCar();
    clearCarSelected();
  };
  return (
    <>
      <div className="border-2 border-grey-500 text-blue-800 hover:bg-blue-800 hover:text-blue-100 hover:text-white duration-300 flex items-center p-2 bg-white border rounded-lg border-solid cursor-pointer">
        <div className="flex items-center space-x-2 ">
          {/* <CarIcon className="text-green-500" /> */}
          <span className="text-sm font-semibold " onClick={handleCarSelection}>
            {carSelected.cars?.[0].name} {carSelected.cars?.[2].year}
          </span>
        </div>
        <CarIcon />
        <div className="flex-grow border-l ml-2 pl-2" />
        <Cross className="bg-grey-100" onClick={handleDeleteCar}></Cross>
      </div>
    </>
  );
}
