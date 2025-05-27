import { Products as MagentoProducts } from "../schema";
import { normalizeProduct, SLUG_SLASH_REPLACEMENT } from "../utils";
import { Product } from "@common/types/product";
import { ApiConfig } from "@common/types/api";
import { getProductQuery } from "@framework/utils/graphql/product";

type ProductsResponse = {
  products: MagentoProducts;
};

const getProduct = async (options: {
  apiConfig: ApiConfig;
  variables: { slug: string };
}): Promise<Product | null> => {
  const { apiConfig, variables } = options;
  const products = await apiConfig.fetch<ProductsResponse>({
    query: getProductQuery,
    variables: { slug: variables.slug.replaceAll(SLUG_SLASH_REPLACEMENT, "/") },
    locale: apiConfig.locale,
    token: apiConfig.token,
  });
  return (
    products.data.products.items?.map((p) => normalizeProduct(p))[0] || null
  );
};

export default getProduct;
