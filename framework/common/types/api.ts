export type ApiFetcherOptions<V = { [key: string]: any }> = {
  query: string;
  variables?: Variables<V>;
  locale?: string;
  token: string | null;
};

export type Variables<V> = V;

export type ApiFetcherResults<T> = {
  data: T;
};

export type ApiFetcher = <T>(
  options: ApiFetcherOptions
) => Promise<ApiFetcherResults<T>>;

export interface ApiConfig {
  fetch: ApiFetcher;
  locale: string;
  token: string | null;
}

export interface ApiHooks {
  cart: {
    useAddItem: any;
  };
}

export interface ApiProviderContext {
  hooks: ApiHooks;
  fetcher: ApiFetcher;
  locale: string;
}
