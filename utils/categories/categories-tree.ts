import { Category } from "@common/types/category";
import actualCategories from "@assets/data/actual-categories.json";

const fitmentCategoriesTree = (categories: Category[] = []): Category[] => {
  if (!categories.length) return [];

  const cats = categories
    .filter((c) => !actualCategories.includes(c.id))
    .sort((a, b) => b!.level! - a!.level!);

  const rootest = Math.min(...cats.map((c) => c.level || 1000));

  cats.forEach(
    (cat, idx) =>
      (cats[idx].children = cats.filter((c) => c.parentId === cat.id))
  );
  return cats.filter((c) => c.level && c.level <= rootest);
};

export default fitmentCategoriesTree;
