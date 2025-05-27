import { Products as MagentoProducts } from "../schema";
import { normalizeProduct } from "../utils";
import { Product } from "@common/types/product";
import { ApiConfig } from "@common/types/api";
import { getProductsByOemQuery } from "@framework/utils/graphql/product";

type ProductsResponse = {
  products: MagentoProducts;
};

const getProductsByOem = async ({
  apiConfig,
  variables,
}: {
  apiConfig: ApiConfig;
  variables: { oem: string };
}): Promise<Product[]> => {
  const products = await apiConfig.fetch<ProductsResponse>({
    query: getProductsByOemQuery,
    locale: apiConfig.locale,
    variables,
    token: apiConfig.token,
  });
  return products.data.products.items?.map(normalizeProduct) || [];
};

export default getProductsByOem;
