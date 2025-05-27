import { CategoryResult as MagentoCategories } from "../schema";
import { ApiConfig } from "@common/types/api";
import { getCategoryByIdQuery } from "@framework/utils/graphql/categories";
import { normalizeCategory } from "@framework/utils";
import { Category } from "@common/types/category";

export type CategoriesResponse = {
  categories: MagentoCategories;
};

const getCategoryByPath = async (
  apiConfig: ApiConfig,
  id: string
): Promise<Category | null> => {

  try {
    const categories = await apiConfig.fetch<CategoriesResponse>({
      query: getCategoryByIdQuery,
      variables: { id },
      locale: apiConfig.locale,
      token: apiConfig.token,
    });
  
    return normalizeCategory(categories.data) || null;
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return {
      name: "",
      id: String( 0),
      level: undefined,
      visible: undefined,
      path: "",
      parentId: undefined,
      meta: {
        title: "",
        description: "",
        keywords: "",
      }
    }
  }

};

export default getCategoryByPath;
