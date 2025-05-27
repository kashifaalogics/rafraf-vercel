import {
  GetStaticPathsContext,
  GetStaticPathsResult,
  GetStaticPropsContext,
  GetStaticPropsResult,
  InferGetServerSidePropsType,
} from "next";

import { CATEGORIES_ROOT_ID } from "constants/category-ids";
import { Layout } from "@components/common";
import { getConfig } from "@framework/api/config";
import { getCategories, getCategoriesTree } from "@framework/categories";
import { getAllProducts, getSingleProduct } from "@framework/product";
import { ProductListing } from "@components/product";

import { Category } from "@common/types/category";
import { ProductsList, SingleProductsList } from "@common/types/product";
import getCategoryByPath from "@framework/categories/get-category-by-path";
import { Container } from "@components/ui";
import { useEffect, useState } from "react";
import { useStore } from "@common/state";
import staticManufacturers from "./ManufacturerDropDown.json";
import staticProductType from "@assets/data/productType.json";
type StaticManufacturers = {
  [key: string]: string | null;
};
type staticProductType = {
  [key: string]: string | null;
};

interface Props {
  categories: Category[];
  products: ProductsList;
  categoriesTree: Category[];
  category: Category;
  breadcrumb: {
    car: Boolean;
    maker: String;
    model: String;
    year: string;
  };
}

export async function getStaticPaths(
  context: GetStaticPathsContext
): Promise<GetStaticPathsResult> {
  return {
    paths: [],
    fallback: "blocking",
  };
}

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<Props>> {
  try {
    let breadcrumb = {
      car: false,
      maker: "",
      model: "",
      year: "",
    };
    const apiConfig = getConfig({ locale: context.locale || "ar" });
    const categoriesPromise = getCategories(apiConfig, CATEGORIES_ROOT_ID);

    const categoriesTreePromise = await getCategoriesTree(
      apiConfig,
      CATEGORIES_ROOT_ID
    );

    const filterCategories = context.params?.categories as string[];
    console.log(filterCategories.slice(0, 3).join("/"));
    const carCategory = await getCategoryByPath(
      apiConfig,
      `cars/${filterCategories.slice(0, 3).join("/")}`
    );
    if (!carCategory) {
      if (
        filterCategories.length >= 3 &&
        filterCategories[1].includes(filterCategories[0]) &&
        filterCategories[2].includes(filterCategories[1])
      ) {
        return {
          redirect: {
            destination: `/cars/${
              filterCategories[0]
            }/${filterCategories[1].replace(
              filterCategories[0],
              ""
            )}/${filterCategories[2].replace(filterCategories[1], "")}`,
            permanent: false,
          },
        };
      }

      return {
        redirect: {
          destination: "/" + context.locale + "/404",
          permanent: false,
        },
      };
    }

    const categoriesInFilters: string[] = [];

    if (carCategory) {
      breadcrumb = {
        car: true,
        maker: filterCategories[0],
        model: filterCategories[1]?.replace(filterCategories[0], "") || "",
        year: filterCategories[2]?.replace(filterCategories[1], "") || "",
      };

      categoriesInFilters.push(carCategory.id);
    }
    const categoriesCategory = await getCategoryByPath(
      apiConfig,
      `parts/${filterCategories.slice(3).join("/")}`
    );

    if (categoriesCategory) {
      categoriesInFilters.push(categoriesCategory.id);
    }

    const productsPromise = getAllProducts(apiConfig, {
      filter: { category_id: { in: categoriesInFilters } },
    });

    const [categories, products, categoriesTree] = await Promise.all([
      categoriesPromise,
      productsPromise,
      categoriesTreePromise,
    ]);

    return {
      props: {
        categories,
        products,
        categoriesTree,
        category: carCategory,
        breadcrumb,
      },
      revalidate: 60 * 60 * 24,
    };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export default function PartListingPage({
  categories,
  products,
  categoriesTree,
  category,
  breadcrumb,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const [uniqueManufacturers, setUniqueManufacturers] = useState<String[]>([]);
  const {
    uniqueManufacturer,
    productType,
    setUniqueManufacturer,
    setProductType,
  } = useStore();

  useEffect(() => {
    if (products.products && products.products.length > 0) {
      const uniqueManufacturersArray: string[] = [];

      products.products.forEach((product: any) => {
        if (product.manufacturer && typeof product.manufacturer === "string") {
          const manufacturerName = product.manufacturer.toLowerCase();
          if (!uniqueManufacturersArray.includes(manufacturerName)) {
            uniqueManufacturersArray.push(manufacturerName);

            // console.log("manufacturerName (lowercase):", manufacturerName);
            // console.log("staticManufacturers:", staticManufacturers);

            // Get the ID from the imported static JSON using the utility function
            const manufacturerId = findManufacturerId(
              manufacturerName,
              staticManufacturers
            );

            // Now, you can use the manufacturerId as needed
            // console.log(`${manufacturerName}: ${manufacturerId}`);
          }
        }
      });

      // Create manufacturerOptions directly from uniqueManufacturersArray
      const manufacturerOptions = uniqueManufacturersArray.map((value) => ({
        value: findManufacturerId(value, staticManufacturers) || "", // Use the manufacturer ID or an empty string if not found
        label: value,
      }));

      // Update the store with manufacturerOptions
      setUniqueManufacturer(manufacturerOptions);
    }
  }, [products.products]);

  useEffect(() => {
    if (products.products && products.products.length > 0) {
      const uniqueProductType: string[] = [];

      products.products.forEach((product: any) => {
        if (product.type && typeof product.type === "string") {
          const typeName = product.type.toLowerCase();
          if (!uniqueProductType.includes(typeName)) {
            uniqueProductType.push(typeName);

            // console.log("manufacturerName (lowercase):", manufacturerName);
            // console.log("staticManufacturers:", staticManufacturers);

            // Get the ID from the imported static JSON using the utility function
            const typeId = findTypeId(typeName, staticProductType);

            setProductType(typeId);
          }
        }
      });

      // Create manufacturerOptions directly from uniqueManufacturersArray
      const typeOption = uniqueProductType.map((value) => ({
        value: findTypeId(value, staticProductType) || "", // Use the manufacturer ID or an empty string if not found
        label: value,
      }));

      // Update the store with manufacturerOptions
      setProductType(typeOption);
    }
  }, [products.products]);



  const findTypeId = (
    manufacturerName: string,
    type: staticProductType
  ): string | null => {
    for (const key in type) {
      if (type.hasOwnProperty(key)) {
        if (type[key]?.toLowerCase() === manufacturerName) {
          return key;
        }
      }
    }
    return null;
  };


  // Utility function to find manufacturer ID
  const findManufacturerId = (
    manufacturerName: string,
    manufacturers: StaticManufacturers
  ): string | null => {
    for (const key in manufacturers) {
      if (manufacturers.hasOwnProperty(key)) {
        if (manufacturers[key]?.toLowerCase() === manufacturerName) {
          return key;
        }
      }
    }
    return null;
  };
  return (
    <>
      <ProductListing
        key={"key"}
        categoriesTree={categoriesTree}
        category={category}
        products={products}
        showTopCategories={true}
        breadcrumb={breadcrumb}
      />
    </>
  );
}

PartListingPage.Layout = Layout;
