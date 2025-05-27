import { Dispatch, RootState } from "@common/store";
import { ApiConfig } from "@common/types/api";
import { Car } from "@common/types/car";
import { Category } from "@common/types/category";
import { getCategories } from "@framework/categories";
import { createModel } from "@rematch/core";
import { CAR_BRANDS_ID, CATEGORIES_ROOT_ID } from "constants/category-ids";
import type { RootModel } from ".";

export interface CarState {
  carBrands: Category[];
  carModels: Category[];
  carYears: Category[];
  partCategories: Category[];
  selectedCar: Car;
}

const initalState: CarState = {
  carBrands: [],
  carModels: [],
  carYears: [],
  partCategories: [],
  selectedCar: {
    brand: null,
    model: null,
    year: null,
    engine: null,
  },
};

export const car = createModel<RootModel>()({
  state: initalState,
  reducers: {
    reset(state: CarState) {
      state = initalState;
    },

    setCarBrands(state: CarState, payload: Category[]) {
      state.carBrands = payload;
    },
    setCarModels(state: CarState, payload: Category[]) {
      state.carModels = payload.sort((m1, m2) => (m1.name > m2.name ? 1 : -1));
    },
    setCarYears(state: CarState, payload: Category[]) {
      state.carYears = payload.sort((y1, y2) => (y1.name > y2.name ? 1 : -1));
    },
    setPartCategories(state: CarState, payload: Category[]) {
      state.partCategories = payload;
    },
    selectCarBrand(state: CarState, payload: Category | null) {
      state.selectedCar.brand = payload;
    },
    selectCarModel(state: CarState, payload: Category | null) {
      state.selectedCar.model = payload;
    },
    selectCarYear(state: CarState, payload: Category | null) {
      state.selectedCar.year = payload;
    },
  },

  effects: (dispatch: Dispatch) => {
    const { car } = dispatch;

    const effects = {
      async getCarBrands(apiConfig: ApiConfig, ...args: any[]) {
        const [state] = args as [RootState];
        const brands = await getCategories(apiConfig, CAR_BRANDS_ID);
        car.setCarBrands(brands.filter((b) => b.visible));
      },

      async getCarModels({
        apiConfig,
        selectedCarBrand,
      }: {
        apiConfig: ApiConfig;
        selectedCarBrand: Category;
      }) {
        const models = await getCategories(apiConfig, selectedCarBrand.id);
        car.setCarModels(models);
      },

      async getCarYears({
        apiConfig,
        selectedCarModel,
      }: {
        apiConfig: ApiConfig;
        selectedCarModel: Category;
      }) {
        const years = await getCategories(apiConfig, selectedCarModel.id);
        car.setCarYears(years);
      },

      async getPartCategories(apiConfig: ApiConfig) {
        const partCategories = await getCategories(
          apiConfig,
          CATEGORIES_ROOT_ID
        );
        car.setPartCategories(partCategories);
      },
    };

    return effects;
  },
});
