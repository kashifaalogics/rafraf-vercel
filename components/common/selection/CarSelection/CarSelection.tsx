import { useState, useEffect, FunctionComponent } from "react";
import {
  useCarSelection,
  useSearchEngine,
  useCustomer,
  useEffectV2,
} from "@common/hooks";
import { Category } from "@common/types/category";
import { Label } from "@components/typography";
import { Button, Select, Popup, Input } from "@components/ui";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import useLangDirection from "@utils/language/useLangDirection";
import { H3, Subtitle, Caption3 } from "@components/typography";
import toast from "react-hot-toast";
import { colors } from "theme/themeColors.config";
import cars from "@assets/data/cars.json";
import urlMapper from "@assets/data/UrlMapperCars.json";
import Image from "next/image";
import { recordAPI } from "framework/analytics";
import { useStore } from "@common/state";

interface Props {
  open: boolean;
}

const CarSelection = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { locale } = useRouter();
  const { customer } = useCustomer();
  const [btnLoading, setBtnLoading] = useState(false);
  const [carForm, setCarForm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [vinNumber, setVinNumber] = useState("");
  const [partInfo, setPartInfo] = useState("");
  const [selectedCarBrand, setSelectedCarBrand] = useState({
    name: "",
    id: "",
  });

  const [carModels, setCarModels] = useState([
    { modelAr: "", modelEn: "", years: [""], id: "" },
  ]);
  const [selectedCarModel, setSelectedCarModel] = useState({
    name: "",
    id: "",
  });

  const [carYears, setCarYears] = useState([""]);
  const [selectedCarYears, setSelectedCarYears] = useState({ year: "" });

  const [Form, setForm] = useState("");
  // selectedCarBrand
  const { recordAnalytic, searchCookie } = useSearchEngine();
  const { rtl } = useLangDirection();

  const handleShowResult = (category: Category | null) => {
    if (!category) return;

    setBtnLoading(true);
    router.push(`/${category.path}`);
  };

  const setSelectedCar = useStore((state) => state.setCarSelected);
  const carSelection = useCarSelection(handleShowResult)();

  const POPUP_IMAGE = "/images/free_shipping.webp";
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    setShowPopup(false)
  }, [])

  useEffect(() => {
    if (carSelection.selectedCarBrand?.name === t("home:hondaForm")) {
      setCarForm(true);
      setForm("Honda Form");
    } else if (carSelection.selectedCarBrand?.name === t("home:MGForm")) {
      setCarForm(true);
      setForm("MG Form");
    }
  }, [carSelection.selectedCarBrand]);

  useEffect(() => {
    if (selectedCarBrand.id) {
      // console.log("i.id:", i.id)
      console.log("selectedCarBrand.id:", selectedCarBrand.id)

      const model = cars.filter((i) => {
        if (i.id === selectedCarBrand.id) return i;
      })[0].models;
      console.log("model:", model)
      setCarModels(model);
    }
  }, [selectedCarBrand]);

  useEffect(() => {
    console.log("selectedCarModel.id:", selectedCarModel.id)
    if (selectedCarModel.id) {
      const year = carModels.filter((i) => {
        if (i.modelEn === selectedCarModel.name) return i;
      })[0].years;
      setCarYears(year);
    }
  }, [selectedCarModel]);

  useEffect(() => {
    if (selectedCarYears.year) {
      const url = `${selectedCarBrand.name}/${
        selectedCarBrand.name
      }${selectedCarModel.name.replace("-", "")}/${
        selectedCarBrand.name
      }${selectedCarModel.name.replace("-", "")}${selectedCarYears.year}`;
      // recordAPI({behaviour: "car_selection", source: "homepage"})
      router.push(
        "cars/" +
          urlMapper[
            String(
              url.toLowerCase().replaceAll(" ", "")
            ) as keyof typeof urlMapper
          ]
      );
    }
  }, [selectedCarYears]);

  useEffectV2(() => {
    // Check if localStorage is available (client-side)
    if (typeof window !== "undefined" && window.localStorage) {
      const CarsinStorages = [
        selectedCarModel,
        selectedCarBrand,
        selectedCarYears,
      ];
      // localStorage.setItem("SELECTED_CAR", JSON.stringify(CarsinStorages));
      console.log("car setting mounted");
      setSelectedCar(CarsinStorages);
    }
  }, [selectedCarModel, selectedCarBrand, selectedCarYears]);
  // const CarsinStorages = [selectedCarModel, selectedCarBrand, selectedCarYears];

  // localStorage.setItem("SELECTED_CAR", JSON.stringify(SELECTED_CAR));

  return (
    <div
      className={`flex flex-col md:flex-row md:items-end gap-4 mx-auto pb-4 z-50 relative`}
      style={{
        gridTemplateRows: "20px auto",
      }}
    >
      {/* markting popup */}
      {showPopup ? (
        <div>
          {/* Mobile popup */}
          <div className="relative block md:hidden">
            <div
              className="absolute bg-white z-40 rounded-sm animate__animated animate__fadeIn animate__faster"
              style={{
                filter: "drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))",
                top: "-200%",
                left: "50%",
                height: "300px",
                width: "300px",
                transform: "translateX(-50%)",
              }}
            >
              <div className="absolute left-0">
                <div
                  dir="ltr"
                  className="pb-3 relative"
                  style={{ alignItems: "center" }}
                >
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 460.775 460.775"
                    className="w-4 h-4 m-2 cursor-pointer absolute top-0 z-10"
                    onClick={() => setShowPopup(false)}
                  >
                    <path
                      d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                      c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                      c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                      c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                      l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                      c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                  </svg>
                  <Image height="600" width="600" src={POPUP_IMAGE} alt="" />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop popup */}
          <div className="hidden md:block">
            <div
              className="absolute top-0  bg-white z-40 rounded-sm animate__animated animate__fadeIn animate__faster"
              style={{
                filter: "drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))",
                top: "-400%",
                left: "50%",
                height: "600px",
                width: "600px",
                transform: "translateX(-50%)",
              }}
            >
              <div className="absolute left-0">
                <div
                  dir="ltr"
                  className="pb-3 relative"
                  style={{ alignItems: "center" }}
                >
                  <svg
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    viewBox="0 0 460.775 460.775"
                    className="w-4 h-4 m-2 cursor-pointer absolute top-0 z-10"
                    onClick={() => setShowPopup(false)}
                  >
                    <path
                      d="M285.08,230.397L456.218,59.27c6.076-6.077,6.076-15.911,0-21.986L423.511,4.565c-2.913-2.911-6.866-4.55-10.992-4.55
                      c-4.127,0-8.08,1.639-10.993,4.55l-171.138,171.14L59.25,4.565c-2.913-2.911-6.866-4.55-10.993-4.55
                      c-4.126,0-8.08,1.639-10.992,4.55L4.558,37.284c-6.077,6.075-6.077,15.909,0,21.986l171.138,171.128L4.575,401.505
                      c-6.074,6.077-6.074,15.911,0,21.986l32.709,32.719c2.911,2.911,6.865,4.55,10.992,4.55c4.127,0,8.08-1.639,10.994-4.55
                      l171.117-171.12l171.118,171.12c2.913,2.911,6.866,4.55,10.993,4.55c4.128,0,8.081-1.639,10.992-4.55l32.709-32.719
                      c6.074-6.075,6.074-15.909,0-21.986L285.08,230.397z"
                    />
                  </svg>
                  <Image height="600" width="600" src={POPUP_IMAGE} alt="" />
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      {carForm ? (
        <div>
          <div className="relative block md:hidden">
            <div
              className="p-7 absolute bg-white z-40 rounded-sm animate__animated animate__fadeIn animate__faster"
              style={{
                filter: "drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))",
                top: "-200%",
                left: "50%",
                height: "485px",
                width: "350px",
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="pb-3"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div>
                  {carSelection.selectedCarBrand?.name === t("home:MGForm") ? (
                    <H3>{t("home:mgFormRequst")}</H3>
                  ) : carSelection.selectedCarBrand?.name ===
                    t("home:hondaForm") ? (
                    <H3>{t("home:hondaFormRequst")}</H3>
                  ) : (
                    <div></div>
                  )}

                  {/* {carSelection.selectedCarBrand?.name === t("home:MGForm")?setForm("MG Form"):
                  carSelection.selectedCarBrand?.name === t("home:hondaForm")?setForm("Honda Form")
                  :<div></div>}
 */}
                </div>
                <div className="px-2">
                  {carSelection.selectedCarBrand?.name === t("home:MGForm") ? (
                    <img
                      style={{
                        height: "50px",
                        width: "auto",
                      }}
                      src="https://s3.me-south-1.amazonaws.com/images.rafraf.com/manufacturer/mg-logo.png"
                      alt="honda form image"
                    />
                  ) : carSelection.selectedCarBrand?.name ===
                    t("home:hondaForm") ? (
                    <img
                      style={{
                        height: "50px",
                        width: "auto",
                      }}
                      src="https://s3.me-south-1.amazonaws.com/images.rafraf.com/manufacturer/honda-logo.png"
                      alt="honda form image"
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>

              <div className="pb-2">
                <Subtitle>{t("home:phoneNumberForm")}</Subtitle>
              </div>
              <div className="pb-4">
                <input
                  style={{ fontSize: "14px" }}
                  type="text"
                  className="w-full border-2 rounded px-4 py-3 border-darkgrey"
                  placeholder="05XXXXXXXX"
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                />
              </div>

              <div className="pb-2">
                <Subtitle>{t("home:vinForm")}</Subtitle>
              </div>
              <div className="pb-4">
                <input
                  style={{ fontSize: "14px" }}
                  type="text"
                  className="w-full border-2 rounded px-4 py-3 border-darkgrey"
                  placeholder={t("home:vinFormPlaceholder")}
                  onChange={(e) => {
                    setVinNumber(e.target.value);
                  }}
                />
              </div>

              <div className="pb-2">
                <Subtitle>{t("home:partInfoForm")}</Subtitle>
              </div>
              <div className="pb-6">
                <input
                  style={{ fontSize: "14px" }}
                  type="text"
                  className="w-full border-2 rounded px-4 py-3 border-darkgrey"
                  onChange={(e) => {
                    setPartInfo(e.target.value);
                  }}
                />
              </div>

              <div className="pb-2">
                <Caption3>{t("home:formCaption")}</Caption3>
              </div>

              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  disabled={
                    (vinNumber.length === 17 ? false : true) ||
                    (phoneNumber.length > 0 ? false : true) ||
                    (partInfo.length > 0 ? false : true)
                  }
                  onClick={() => {
                    recordAnalytic({
                      email: customer?.email || "",
                      name: `${customer?.firstname || ""} ${
                        customer?.lastname || ""
                      }`.trim(),
                      searched_query: vinNumber,
                      userID: searchCookie,
                      results_clicked_on: phoneNumber,
                      language: locale || "",
                      part_number: partInfo,
                      behavior: Form,
                    });

                    setCarForm(false);

                    toast(t("home:successFormSubmission"), {
                      position: "bottom-center",
                      style: {
                        backgroundColor: "#4BB543",
                        color: colors.white,
                      },
                    });
                  }}
                  style={{ height: "50px" }}
                  className="w-full mt-5 md:mt-0 mx-1"
                >
                  {t("home:submit")}
                </Button>

                <Button
                  onClick={() => setCarForm(false)}
                  style={{ height: "50px" }}
                  className="w-full mt-5 md:mt-0 mx-1"
                >
                  {t("home:exit")}
                </Button>
              </div>
            </div>
          </div>

          <div className="hidden md:block">
            <div
              className="p-7 absolute bg-white z-40 rounded-sm animate__animated animate__fadeIn animate__faster"
              style={{
                filter: "drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))",
                top: "-200%",
                left: "50%",
                height: "485px",
                width: "450px",
                transform: "translateX(-50%)",
              }}
            >
              <div
                className="pb-3"
                style={{ display: "flex", alignItems: "center" }}
              >
                <div>
                  {carSelection.selectedCarBrand?.name === t("home:MGForm") ? (
                    <H3>{t("home:mgFormRequst")}</H3>
                  ) : carSelection.selectedCarBrand?.name ===
                    t("home:hondaForm") ? (
                    <H3>{t("home:hondaFormRequst")}</H3>
                  ) : (
                    <div></div>
                  )}

                  {/* {carSelection.selectedCarBrand?.name === t("home:MGForm")?setForm("MG Form"):
                  carSelection.selectedCarBrand?.name === t("home:hondaForm")?setForm("Honda Form")
                  :<div></div>} */}
                </div>
                <div className="px-2">
                  {carSelection.selectedCarBrand?.name === t("home:MGForm") ? (
                    <img
                      style={{
                        height: "50px",
                        width: "auto",
                      }}
                      src="https://s3.me-south-1.amazonaws.com/images.rafraf.com/manufacturer/mg-logo.png"
                      alt="honda form image"
                    />
                  ) : carSelection.selectedCarBrand?.name ===
                    t("home:hondaForm") ? (
                    <img
                      style={{
                        height: "50px",
                        width: "auto",
                      }}
                      src="https://s3.me-south-1.amazonaws.com/images.rafraf.com/manufacturer/honda-logo.png"
                      alt="honda form image"
                    />
                  ) : (
                    <div></div>
                  )}
                </div>
              </div>

              <div className="pb-2">
                <Subtitle>{t("home:phoneNumberForm")}</Subtitle>
              </div>
              <div className="pb-4">
                <input
                  type="text"
                  className="w-full border-2 rounded px-4 py-3 border-darkgrey"
                  placeholder="05XXXXXXXX"
                  required={true}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value);
                  }}
                />
              </div>

              <div className="pb-2">
                <Subtitle>{t("home:vinForm")}</Subtitle>
              </div>
              <div className="pb-4">
                <input
                  type="text"
                  className="w-full border-2 rounded px-4 py-3 border-darkgrey"
                  placeholder={t("home:vinFormPlaceholder")}
                  onChange={(e) => {
                    setVinNumber(e.target.value);
                  }}
                />
              </div>

              <div className="pb-2">
                <Subtitle>{t("home:partInfoForm")}</Subtitle>
              </div>
              <div className="pb-6">
                <input
                  type="text"
                  className="w-full border-2 rounded px-4 py-3 border-darkgrey"
                  onChange={(e) => {
                    setPartInfo(e.target.value);
                  }}
                />
              </div>
              <div className="pb-2">
                <Caption3>{t("home:formCaption")}</Caption3>
              </div>

              <div style={{ display: "flex", justifyContent: "space-around" }}>
                <Button
                  disabled={
                    (vinNumber.length === 17 ? false : true) ||
                    (phoneNumber.length > 0 ? false : true) ||
                    (partInfo.length > 0 ? false : true)
                  }
                  onClick={() => {
                    recordAnalytic({
                      email: customer?.email || "",
                      name: `${customer?.firstname || ""} ${
                        customer?.lastname || ""
                      }`.trim(),
                      searched_query: vinNumber,
                      userID: searchCookie,
                      results_clicked_on: phoneNumber,
                      language: locale || "",
                      part_number: partInfo,
                      behavior: Form,
                    });
                    setCarForm(false);
                    toast(t("home:successFormSubmission"), {
                      position: "bottom-center",
                      style: {
                        backgroundColor: "#4BB543",
                        color: colors.white,
                      },
                    });
                  }}
                  style={{ height: "50px" }}
                  className="w-full mt-5 md:mt-0 mx-1"
                >
                  {t("home:submit")}
                </Button>

                <Button
                  onClick={() => setCarForm(false)}
                  style={{ height: "50px" }}
                  className="w-full mt-5 md:mt-0 mx-1"
                >
                  {t("home:exit")}
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex-1">
        {/* <Label htmlFor="carBrand" className="text-white">
          {t("common/selection:carBrandLabel")}
        </Label> */}
        <Select
          name="carBrand"
          placeholder={t("common/selection:carBrandLabel")}
          options={cars.map((cb) => ({
            value: JSON.stringify(cb),
            label: rtl ? cb.makerAr : cb.makerEn,
          }))}
          loading={false}
          selectRef={carSelection.carBrandsRef}
          onChange={(v) => {
            setSelectedCarBrand({
              name: JSON.parse(String(v)).makerEn,
              id: JSON.parse(String(v)).id,
            });
            carSelection.handleCarBrandsChange(JSON.parse(String(v)));
          }}
          // defaultValue={JSON.stringify(carSelection.selectedCarBrand)}
        />
      </div>

      <div className="flex-1">
        {/* <Label htmlFor="carModel" className="text-white">
          {t("common/selection:carModelLabel")}
        </Label> */}
        <Select
          name="carModel"
          placeholder={t("common/selection:carModelLabel")}
                options={carModels.map((cb) => ({
            value: JSON.stringify(cb),
            label: rtl ? cb.modelAr : cb.modelEn,
          }))}
          loading={false}
          selectRef={carSelection.carModelsRef}
          onChange={(v) => {
            setSelectedCarModel({
              name: JSON.parse(String(v)).modelEn,
              id: JSON.parse(String(v)).id,
            });
            carSelection.handleCarModelsChange(JSON.parse(String(v)));
          }}
          disabled={!selectedCarBrand.name}
          defaultValue={JSON.stringify(carSelection.selectedCarModel)}
        />
      </div>

      <div className="flex-1">
        {/* <Label htmlFor="manufacturingYear" className="text-white">
          {t("common/selection:manufacturerYearLabel")}
        </Label> */}
        <Select
          name="manufacturingYear"
          placeholder={t("common/selection:manufacturerYearLabel")}
          options={carYears.map((cb) => ({
            value: JSON.stringify(cb),
            label: cb,
          }))}
          loading={false}
          selectRef={carSelection.carYearsRef}
          onChange={(v) => {
            setSelectedCarYears({
              year: JSON.parse(String(v)),
            });
          }}
          disabled={!selectedCarModel.name}
          defaultValue={JSON.stringify(carSelection.selectedCarYear)}
        />
      </div>

      <div className="flex-1 hidden flex-col md:flex homeBannerImgButtonNone">
        <Button
          disabled={!carSelection.selectedCarYear}
          loading={btnLoading}
          onClick={() =>
            carSelection.handleShowResult(carSelection.selectedCarYear)
          }
          style={{ height: "50px" }}
          className="w-full mt-5 md:mt-0 hidden "
        >
          {t("common/selection:actionText")}
        </Button>
      </div>
    </div>
  );
};

export default CarSelection;
