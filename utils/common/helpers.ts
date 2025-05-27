import { Product } from "@common/types/product";
import { Category } from "@common/types/category";

const productFormatter = (product: Product, fitmentCategories: Category[]) => {

    if (
    fitmentCategories && (
    !fitmentCategories.length ||
    !fitmentCategories[0].children)
  )
    return product.name;

  if (
    fitmentCategories &&
    fitmentCategories.length &&
    fitmentCategories[0].children &&
    fitmentCategories[0].children.length &&
    fitmentCategories[0].children[0].children &&
    (fitmentCategories[0].children.length > 1 ||
      fitmentCategories[0].children[0].children.length > 1)
  )
    return product.name;

  return `
        ${product.name.split("-")[0]} ${
    !fitmentCategories.length && fitmentCategories[0].children
      ? ""
      : fitmentCategories[0].children?.map((c1) =>
          c1.children?.map(
            (c2) =>
              c1.name +
              " " +
              c2.name +
              " " +
              c2.children
                ?.map((child) => child.name)
                .sort()
                .join(" - ")
          )
        )
  } ${
    product.name.split("-").length === 2 ? "|" + product.name.split("-")[1] : ""
  }
      `;
};

export { productFormatter };