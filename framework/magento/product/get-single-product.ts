import {
  Products as MagentoProducts,
  SingleProducts as MagentoSingleProduct,
  ProductAttributeFilterInput as MagentoProductAttributeFilterInput,
  ProductAttributeSortInput as MagentoProductAttributeSortInput,
} from "../schema";
import { normalizeProductList, normalizeSingleProductList } from "../utils";
import { ProductsList, SingleProductsList } from "@common/types/product";
import { ApiConfig } from "@common/types/api";
import { getSingleProductsQuery } from "@framework/utils/graphql/product";

type ProductsResponse = {
  products: MagentoSingleProduct;
};

export interface ProductOptions {
  filter?: MagentoProductAttributeFilterInput;
}

const getSingleProduct = async (
  apiConfig: ApiConfig,
  variables: ProductOptions,

): Promise<SingleProductsList> => {
  const products = await apiConfig.fetch<ProductsResponse>({
    query: getSingleProductsQuery,
    locale: apiConfig.locale,
    variables,
    token: apiConfig.token,
  });
  return normalizeSingleProductList(products.data.products);
};

export default getSingleProduct;
