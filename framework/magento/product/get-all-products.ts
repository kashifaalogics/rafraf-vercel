import {
  Products as MagentoProducts,
  ProductAttributeFilterInput as MagentoProductAttributeFilterInput,
  ProductAttributeSortInput as MagentoProductAttributeSortInput,
} from "../schema";
import { normalizeProductList } from "../utils";
import { ProductsList } from "@common/types/product";
import { ApiConfig } from "@common/types/api";
import { getAllProductsQuery } from "@framework/utils/graphql/product";

type ProductsResponse = {
  products: MagentoProducts;
};

export interface ProductOptions {
  filter?: MagentoProductAttributeFilterInput;
  search?: string;
  currentPage?: string;
  sort?: MagentoProductAttributeSortInput;
}

const getAllProducts = async (apiConfig: ApiConfig, variables: ProductOptions): Promise<ProductsList> => {
  try {
    const products = await apiConfig.fetch<ProductsResponse>({
      query: getAllProductsQuery,
      locale: apiConfig.locale,
      variables,
      token: apiConfig.token,
    });
    return normalizeProductList(products.data.products);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {}
  }

};

export default getAllProducts;
