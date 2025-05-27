import { CategoryResult as MagentoCategories } from "../schema";
import { ApiConfig } from "@common/types/api";
import { getCategoriesTreeQuery } from "@framework/utils/graphql/categories";
import { Category } from "@common/types/category";
import { normalizeCategoriesTree } from "@framework/utils";

export type CategoriesResponse = {
  categories: MagentoCategories;
};

const getCategoriesTree = async (
  apiConfig: ApiConfig,
  parentId: string
): Promise<Category[]> => {
  try {
    const categories = await apiConfig.fetch<CategoriesResponse>({
      query: getCategoriesTreeQuery,
      variables: { parent: parentId },
      locale: apiConfig.locale,
      token: apiConfig.token,
    });
    return normalizeCategoriesTree(categories.data);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return []
  }

};

export default getCategoriesTree;
