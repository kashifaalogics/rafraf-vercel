import { FunctionComponent, useEffect } from "react";
import cn from "classnames";
import useLangDirection from "@utils/language/useLangDirection";
import { H3, Subtitle } from "@components/typography";
import { useRouter } from 'next/router';
import cars from "@assets/data/cars.json";

interface Props {
    value: {      
        car: Boolean;
        maker: String;
        model: String;
        year: string;
      };
};

const Breadcrumbs: FunctionComponent<Props> = ({
  value,
  children,
}) => {
    const full_array = cars.filter((e) => (e.makerEn.toLocaleLowerCase() === value.maker.toLocaleLowerCase()))
    const maker = full_array[0].makerAr
    const model = full_array[0].models.filter((e) => (e.modelEn.toLowerCase().replaceAll(" ", "").replaceAll("-", "") === value.model.toLowerCase().replaceAll(" ", "").replaceAll("-", "")))[0]?.modelAr
    const router = useRouter();
    const dir = useLangDirection();
  return (
    <div className="text-gray-500 p-4">
        {value.car?
         <div className="flex gap-5 pt-3 relative">
            <Subtitle className="hover:text-gray-300 duration-200 cursor-pointer" onClick={() => router.push(`/`)}>
                {dir? "الصفحة الرئيسية" : "Home"}
            </Subtitle>
            <div className="relative">
                <svg className="top-1/4 absolute " width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path className="" d="M1 1L6 6L1 11" stroke="#C4C4C4" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
            </div>

            <Subtitle className="hover:text-gray-300 duration-200 cursor-pointer">
                {dir? maker : value.maker.charAt(0).toLocaleUpperCase() + value.maker.slice(1)}
            </Subtitle>
            {value.model?
            <>
            <div className="relative">
                <svg className="top-1/4 absolute  " width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 1L6 6L1 11" stroke="#C4C4C4" strokeWidth="1.6" strokeLinecap="round"/>
                </svg>
            </div>
                <Subtitle className="hover:text-gray-300 duration-200 cursor-pointer">
                    {dir? model : value.model.replaceAll('-', '').charAt(0).toLocaleUpperCase() + value.model.replaceAll('-', '').slice(1)}
                </Subtitle>
                </>
            : ""}
            {value.year? 
            <>
                <div className="relative">
                    <svg className="top-1/4 absolute rotate-180" width="8" height="12" viewBox="0 0 8 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path className="rotate-180" d="M1 1L6 6L1 11" stroke="#C4C4C4" strokeWidth="1.6" strokeLinecap="round"/>
                    </svg>
                </div>
            
                <Subtitle>
                    {value.year.replaceAll("-", "")}
                </Subtitle>
            </> 
            : ""}
         </div> 
         :
         <></>
          }
    </div>
  );
};

export default Breadcrumbs;
