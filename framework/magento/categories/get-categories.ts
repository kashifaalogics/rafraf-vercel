import { CategoryResult as MagentoCategories } from "../schema";
import { ApiConfig } from "@common/types/api";
import { getCategoriesQuery } from "@framework/utils/graphql/categories";
import { Category } from "@common/types/category";
import { normalizeCategories } from "@framework/utils";

export type CategoriesResponse = {
  categories: MagentoCategories;
};

// OILS & OIL_FILTERS
const order = ["9524", "7442"];

const getCategories = async (
  apiConfig: ApiConfig,
  parentId: string
): Promise<Category[]> => {

  try {
    const categories = await apiConfig.fetch<CategoriesResponse>({
      query: getCategoriesQuery,
      variables: { parent: parentId },
      locale: apiConfig.locale,
      token: apiConfig.token,
    });
    return normalizeCategories(categories.data).sort((a, b) => order.includes(a.id) ? -1 : 0);
  }
  catch(e) {
    console.log('ERROR 500')
    console.log(e)

    return []
  }

};

export default getCategories;
