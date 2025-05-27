import { RefObject, useEffect, useRef } from "react";
import { useApiConfig } from ".";
import { Category } from "@common/types/category";
import { useSelector, useDispatch } from "react-redux";
import { Dispatch, RootState } from "@common/store";
import { SelectRefType } from "@components/ui/Select/Select";
import { singletonHook } from "react-singleton-hook";
import { useRouter } from "next/router";

type FinalHandle = (category: Category | null) => void;

export interface UseCarSelectionResult {
  // car brand
  carBrands: Category[];
  carBrandsLoading: boolean;
  carBrandsRef: RefObject<SelectRefType> | null;
  selectedCarBrand: Category | null;
  handleCarBrandsChange: (v: Category) => void;

  // car models
  carModels: Category[];
  carModelsLoading: boolean;
  carModelsRef: RefObject<SelectRefType> | null;
  selectedCarModel: Category | null;
  handleCarModelsChange: (v: Category) => void;

  // car years
  carYears: Category[];
  carYearsLoading: boolean;
  carYearsRef: RefObject<SelectRefType> | null;
  selectedCarYear: Category | null;
  handleCarYearsChange: (v: Category) => void;

  // final handle
  handleShowResult: FinalHandle;
}

const initialResult: UseCarSelectionResult = {
  // car brand
  carBrands: [],
  carBrandsLoading: false,
  carBrandsRef: null,
  selectedCarBrand: null,
  handleCarBrandsChange: (v: Category) => {},

  // car models
  carModels: [],
  carModelsLoading: false,
  carModelsRef: null,
  selectedCarModel: null,
  handleCarModelsChange: (v: Category) => {},

  // car years
  carYears: [],
  carYearsLoading: false,
  carYearsRef: null,
  selectedCarYear: null,
  handleCarYearsChange: (v: Category) => {},

  // final handle
  handleShowResult: (c: Category | null) => {},
};

const useCarSelection = (
  handleShowResult: FinalHandle
): UseCarSelectionResult => {
  const apiConfig = useApiConfig();
  const router = useRouter();

  const dispatch = useDispatch<Dispatch>();

  const carState = useSelector((state: RootState) => state.car);

  const { carBrands, carModels, carYears, selectedCar } = carState;

  const {
    brand: selectedCarBrand,
    model: selectedCarModel,
    year: selectedCarYear,
  } = selectedCar;

  const carLoadingState = useSelector(
    (state: RootState) => state.loading.effects.car
  );
  const {
    getCarBrands: carBrandsLoading,
    getCarModels: carModelsLoading,
    getCarYears: carYearsLoading,
  } = carLoadingState;

  const handleCarBrandsChange = (v: any) => {
    // dispatch.car.selectCarBrand(v);
    if (v) {
      carBrandsRef.current?.blur();
      carModelsRef.current?.openMenu("first");
      carModelsRef.current?.focusInput();
    }
  };

  const handleCarYearsChange = (v: Category) => {
    // dispatch.car.selectCarYear(v);
    if (v) {
      handleShowResult(v);
    }
  };

  const handleCarModelsChange = (v: any) => {
    // dispatch.car.selectCarModel(v);
    if (v) {
      carModelsRef.current?.blur();
      carYearsRef.current?.openMenu("first");
      carYearsRef.current?.focusInput();
    }
  };

  // car brand
  const carBrandsRef = useRef<SelectRefType>(null);
  useEffect(() => {
    dispatch.car.getCarBrands(apiConfig);
  }, [router.locale]);
  // end car brand

  // car models
  const carModelsRef = useRef<SelectRefType>(null);
  useEffect(() => {
    dispatch.car.selectCarModel(null);
    dispatch.car.setCarModels([]);
    carModelsRef.current?.clearValue();
    if (!selectedCarBrand) {
      return;
    }
    dispatch.car.getCarModels({ apiConfig, selectedCarBrand });
  }, [selectedCarBrand]);
  // end car models

  // car years
  const carYearsRef = useRef<SelectRefType>(null);
  useEffect(() => {
    dispatch.car.selectCarYear(null);
    dispatch.car.setCarYears([]);
    carYearsRef.current?.clearValue();
    if (!selectedCarModel) {
      dispatch.car.setCarYears([]);
      return;
    }
    dispatch.car.getCarYears({ apiConfig, selectedCarModel });
  }, [selectedCarModel]);

  return {
    // car brand
    carBrands,
    carBrandsLoading,
    carBrandsRef,
    selectedCarBrand,
    handleCarBrandsChange,

    // car models
    carModels,
    carModelsLoading,
    carModelsRef,
    selectedCarModel,
    handleCarModelsChange,

    // car years
    carYears,
    carYearsLoading,
    carYearsRef,
    selectedCarYear,
    handleCarYearsChange,

    // final handle
    handleShowResult,
  };
};

export default (finalHandle: FinalHandle) => singletonHook(initialResult, () => useCarSelection(finalHandle));
