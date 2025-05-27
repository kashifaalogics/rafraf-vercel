import { init, RematchDispatch, RematchRootState } from "@rematch/core";
import immerPlugin from "@rematch/immer";
import loading, { ExtraModelsFromLoading } from "@rematch/loading";
import { models, RootModel } from "./state-models";

export type FullModel = ExtraModelsFromLoading<RootModel>;

export const store = init<RootModel, FullModel>({
  models,
  plugins: [immerPlugin(), loading()],
});

export type Store = typeof store;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel, FullModel>;

export const reset = (dispatch: Dispatch) => {
  dispatch.customer.reset();
  dispatch.cart.reset();
  dispatch.car.reset();
  dispatch.productListing.reset();
};