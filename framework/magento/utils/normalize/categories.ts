import { Category } from "@common/types/category";
import { CategoriesResponse } from "@framework/categories/get-categories";

export const normalizeCategory = (
  categoriesResponse: CategoriesResponse
): Category | null => {
  
  if (
    !categoriesResponse?.categories?.items?.length ||
    !categoriesResponse?.categories?.items[0]!.id
  )
    return null;

  const c = categoriesResponse?.categories?.items[0];
  return {
    name: c?.name || "",
    id: String(c?.id || 0),
    level: c?.level || undefined,
    visible: c?.include_in_menu ? c?.include_in_menu === 1 : undefined,
    path: c?.url_path || "",
    parentId:
      categoriesResponse?.categories?.items?.length &&
      categoriesResponse.categories.items[0]?.id
        ? String(categoriesResponse.categories.items[0].id)
        : undefined,
    meta: {
      title: c?.meta_title || "",
      description: c?.meta_description || "",
      keywords: c?.meta_keywords || "",
    },
  };
};

export const normalizeCategories = (
  categoriesResponse: CategoriesResponse
): Category[] => {
  if (!categoriesResponse?.categories?.items?.length) return [];
  return (
    categoriesResponse.categories.items[0]?.children?.map((c) => ({
      name: c?.name || "",
      id: String(c?.id || 0),
      level: c?.level || undefined,
      visible: c?.include_in_menu ? c?.include_in_menu === 1 : undefined,
      path: c?.url_path || "",
      parentId:
        categoriesResponse?.categories?.items?.length &&
        categoriesResponse.categories.items[0]?.id
          ? String(categoriesResponse.categories.items[0].id)
          : undefined,
      meta: {
        title: c?.meta_title || "",
        description: c?.meta_description || "",
        keywords: c?.meta_keywords || "",
      },
    })) || []
  );
};

export const normalizeCategoriesTree = (
  categoriesResponse: CategoriesResponse
): Category[] => {
  if (!categoriesResponse?.categories?.items?.length) return [];
  return (
    categoriesResponse.categories.items[0]?.children?.map((c) => ({
      name: c?.name || "",
      id: String(c?.id || 0),
      path: c?.canonical_url || "",
      children: c?.children?.map(
        (c1) =>
          ({
            id: c1?.id ? String(c1.id) : "",
            name: c1?.name || "",
          } as Category)
      ),
    })) || []
  );
};
