import { CategoryResult as MagentoCategories } from "../schema";
import { ApiConfig } from "@common/types/api";
import { getCategoryByPathQuery } from "@framework/utils/graphql/categories";
import { normalizeCategory } from "@framework/utils";
import { Category } from "@common/types/category";

export type CategoriesResponse = {
  categories: MagentoCategories;
};

const getCategoryByPath = async (
  apiConfig: ApiConfig,
  path: string
): Promise<Category | null> => {

  try {
    const categories = await apiConfig.fetch<CategoriesResponse>({
      query: getCategoryByPathQuery,
      variables: { path },
      locale: apiConfig.locale,
      token: apiConfig.token,
    });
    
    return normalizeCategory(categories.data) || null;
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {id: '', name: ''}
  }

};

export default getCategoryByPath;
