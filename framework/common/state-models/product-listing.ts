import { Dispatch } from "@common/store";
import { ApiConfig } from "@common/types/api";
import { Category } from "@common/types/category";
import { ProductsList } from "@common/types/product";
import { ProductOptions } from "@framework/product/get-all-products";
import { createModel } from "@rematch/core";
import type { RootModel } from ".";
import { getAllProducts } from "@framework/product";
import { ProductAttributeSortInput, SortEnum } from "@framework/schema";

export interface ProductListingState {
  variables: ProductOptions;
  products: ProductsList;
  category: Category;
}

const initalState: ProductListingState = {
  variables: {
    currentPage: "1",
    filter: {
      category_id: {
        in: [],
      },
      featured: {
        in: [],
      },
      part_manufacturer_store: {
        in: [],
      },
      price: {},
      part_type_new: {
        in: [],
      },
    },
    sort: {},
  },
  products: {},
  category: {
    name: "",
    id: ""
  }
};

export const productListing = createModel<RootModel>()({
  state: initalState,
  reducers: {
    reset(state: ProductListingState) {
      state = initalState;
    },

    setProducts(state: ProductListingState, payload: ProductsList) {
      state.products = payload;
    },

    setCategoryFilters(state: ProductListingState, payload: string[]) {
      state.variables.currentPage = "1"
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.category_id?.in) {
        state.variables.filter.category_id = { in: [] };
      }
      if (state.variables.filter?.category_id?.in) {
        state.variables.filter.category_id.in = payload;
      }
    },

    addCategoryFilters(state: ProductListingState, payload: string) {
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.category_id?.in) {
        state.variables.filter.category_id = { in: [] };
      }
      state.variables.filter.category_id.in?.push(payload);
    },

    removeCategoryFilters(state: ProductListingState, payload: string) {
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.category_id?.in) {
        state.variables.filter.category_id = { in: [] };
      }
      state.variables.filter.category_id.in =
        state.variables.filter.category_id.in?.filter((c) => c !== payload) ||
        [];
    },

    setPriceFilters(
      state: ProductListingState,
      payload: { from: string; to: string }
    ) {
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.price) {
        state.variables.filter = { price: {} };
      }
      state.variables.filter.price = payload;
    },

    setPartTypeFilters(state: ProductListingState, payload: string[]) {
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.part_type_new) {
        state.variables.filter.part_type_new = { in: [] };
      }
      state.variables.filter.part_type_new.in = payload;
    },

    addPartTypeFilters(state: ProductListingState, payload: string) {
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.part_type_new) {
        state.variables.filter.part_type_new = { in: [] };
      }
      state.variables.filter.part_type_new.in?.push(payload);
    },

    removePartTypeFilters(state: ProductListingState, payload: string) {
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.part_type_new) {
        state.variables.filter.part_type_new = { in: [] };
      }
      state.variables.filter.part_type_new.in =
        state.variables.filter.part_type_new.in?.filter((c) => c !== payload) ||
        [];
    },

    setPartManufacturerFilters(state: ProductListingState, payload: string[]) {
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.part_manufacturer_store) {
        state.variables.filter.part_manufacturer_store = { in: [] };
      }
      state.variables.filter.part_manufacturer_store.in = payload;
    },

    addPartManufacturerFilters(state: ProductListingState, payload: string) {
      state.variables.currentPage = "1"
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.part_manufacturer_store) {
        state.variables.filter.part_manufacturer_store = { in: [] };
      }
      state.variables.filter.part_manufacturer_store.in?.push(payload);
    },

    removePartManufacturerFilters(state: ProductListingState, payload: string) {
      state.variables.currentPage = "1"
      if (!state.variables.filter) {
        state.variables.filter = {};
      }
      if (!state.variables.filter.part_manufacturer_store) {
        state.variables.filter.part_manufacturer_store = { in: [] };
      }
      state.variables.filter.part_manufacturer_store.in =
        state.variables.filter.part_manufacturer_store.in?.filter(
          (c) => c !== payload
        ) || [];
    },

    nextPage(state: ProductListingState) {
      state.variables.currentPage = String(
        +(state.variables.currentPage || "1") + 1
      );
    },

    prevPage(state: ProductListingState) {
      state.variables.currentPage = String(
        +(state.variables.currentPage || "1") - 1
      );
    },

    goToPage(state: ProductListingState, payload: string) {
      state.variables.currentPage = payload
    },

    setSort(
      state: ProductListingState,
      {
        value,
        direction = "ASC",
      }: { value: keyof ProductAttributeSortInput; direction: "ASC" | "DESC" }
    ) {
      if (!state.variables.sort) {
        state.variables.sort = {};
      }
      state.variables.sort[value] = direction as SortEnum;
    },

    setCategory(state: ProductListingState, category: Category) {
      state.category = category;
    }
  },

  effects: (dispatch: Dispatch) => {
    const { productListing } = dispatch;

    const effects = {
      async getProducts({
        apiConfig,
        variables,
      }: {
        apiConfig: ApiConfig;
        variables: ProductOptions;
      }) {
        const products = await getAllProducts(apiConfig, variables);
        productListing.setProducts(products);
      },
    };

    return effects;
  },
});
