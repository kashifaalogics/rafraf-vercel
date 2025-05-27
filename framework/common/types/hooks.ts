import { ApiFetcher } from "./api";

export type MutationHookContext<T= any> = {
  fetch: (input: T) => any;
};

export type FetcherHookContext<T = any> = {
  input: T;
  fetch: ApiFetcher;
  locale: string;
};

export type MutationHook<T = any> = {
  fetcher: (context: FetcherHookContext<T>) => any;
  useHook(context: MutationHookContext<T>): (input: T) => any;
  locale?: string;
};
