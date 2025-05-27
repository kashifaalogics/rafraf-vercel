import { CurrencyEnum } from "@common/types/currency";
import {
  Product,
  ProductImage,
  ProductPrice,
  ProductsList,
  SingleProductsList,
  ProductVariant,
  SingleProduct
} from "@common/types/product";
import { IMAGES_STORAGE_URL } from "@framework/const";
import {
  ConfigurableVariant as MagentoConfigurableVariant,
  Maybe,
  PriceRange as MagentoPriceRange,
  ProductImage as MagentoProductImage,
  ProductInterface as MagentoProductInterface,
  Products as MagentoProducts,
  SingleProducts as MagentoSingleProduct,
  ConfigurableProduct as MagentoConfigurableProduct,
} from "../../schema";
import manufacturers from "@assets/data/manufacturers.json";

export const SLUG_SLASH_REPLACEMENT = "__";

export const normalizeProductImage = (
  image: Maybe<MagentoProductImage>
): ProductImage => {
  return {
    url: `${IMAGES_STORAGE_URL}/${image?.url}` ?? "",
    alt: image?.label ?? "",
  };
};

export const normalizeProductPrice = (
  priceRange: MagentoPriceRange
): ProductPrice => {
  const final = {
    value: priceRange?.minimum_price?.final_price?.value ?? 0,
    currencyCode:
      priceRange?.minimum_price?.final_price?.currency ?? CurrencyEnum.Sar,
  };
  const regular = {
    value: priceRange?.minimum_price?.regular_price?.value ?? 0,
    currencyCode:
      priceRange?.minimum_price?.regular_price?.currency ?? CurrencyEnum.Sar,
  };

  const price: ProductPrice = {
    final,
  };

  if (regular.value > final.value) {
    price.regular = regular;
  }

  return price;
};

export const normalizeProductVariant = (
  magentoVariant: MagentoConfigurableVariant
): ProductVariant => {
  return {
    attributes:
      magentoVariant.attributes?.map<ProductVariant["attributes"][number]>(
        (v) => ({
          code: v?.code || undefined,
          value: v?.value_index ? String(v.value_index) : undefined,
          label: v?.label || undefined,
          uid: v?.uid || undefined,
        })
      ) || [],
  };
};


export const normalizeProduct = (
  magentoProduct: Maybe<MagentoConfigurableProduct>
): Product => {
  return {
    id: magentoProduct?.id ? String(magentoProduct?.id) : "",
    name: magentoProduct?.name ?? "",
    oem: magentoProduct?.oem ? String(magentoProduct?.oem) : null,
    COD: magentoProduct?.COD ?? 0,
    description: String(magentoProduct?.description?.html) ?? "",
    slug: magentoProduct?.url_key
      ? `${magentoProduct?.url_key}`.replaceAll("/", SLUG_SLASH_REPLACEMENT)
      : "",
    path: magentoProduct?.url_key ? `${magentoProduct?.url_key}` : "",
    images: [normalizeProductImage(magentoProduct?.image || null)],
    price: normalizeProductPrice(
      magentoProduct?.price_range || ({} as MagentoPriceRange)
    ),
    sku: magentoProduct?.sku ?? "",
    header: {
      description: magentoProduct?.meta_description ?? "",
      keywords: magentoProduct?.meta_keyword ?? "",
      title: magentoProduct?.meta_title ?? "",
    },
    rating: {
      summary: magentoProduct?.rating_summary || 0,
    },
    reviews: {
      count: magentoProduct?.review_count || 0,
    },
    related_products:
      magentoProduct?.related_products?.map((x) => ({
        id: x?.id,
        name: x?.name,
        sku: x?.sku,
        url_key: x?.url_key
      })) || [],
    categories:
      magentoProduct?.categories?.map((c) => ({
        level: c?.level || 0,
        name: c?.name || "",
        id: String(c?.id || 0),
        parentId: c?.path?.split("/").reverse()[1],
      })) || [],
    manufacturer:
      manufacturers[
        String(
          magentoProduct?.part_manufacturer_store || "123"
        ) as keyof typeof manufacturers
      ] || null,

    variants:
      magentoProduct?.variants?.reduce<ProductVariant[]>((array, v) => {
        if (v) {
          array.push(normalizeProductVariant(v));
        }
        return array;
      }, []) || [],
    type: magentoProduct?.part_type_new
      ? magentoProduct?.part_type_new === 862588
        ? "genuine"
        : "aftermarket"
      : null,
      stock_status: magentoProduct?.stock_status || "OUT_OF_STOCK"
  };
};

export const normalizeSingleProduct = (
  magentoProduct: Maybe<MagentoConfigurableProduct>
): SingleProduct => {
  return {
    sku: magentoProduct?.sku ?? "",
  };
};


export const normalizeProductList = (
  magentoProducts: MagentoProducts
): ProductsList => {
  return {
    products: magentoProducts.items?.map(normalizeProduct),
    // aggregations: magentoProducts.aggregations?.map(
    //   (ma) =>
    //     ({
    //       attributeCode: ma?.attribute_code,
    //       count: ma?.count,
    //       label: ma?.label,
    //       options: ma?.options?.map(
    //         (mo) =>
    //           ({
    //             count: mo?.count,
    //             label: mo?.label,
    //             value: mo?.value,
    //           } as AggregationOption)
    //       ),
    //     } as Aggregation)
    // ),
    page: {
      currentPage: magentoProducts.page_info?.current_page || 1,
      pageSize: magentoProducts.page_info?.page_size || 0,
      totalPages: magentoProducts.page_info?.total_pages || 1,
      totalCount: magentoProducts.total_count || 0,
    },
    sort: {
      default: magentoProducts.sort_fields?.default || "",
      options:
        magentoProducts.sort_fields?.options?.map((op) => ({
          label: op?.label || "",
          value: op?.value || "",
        })) || [],
    },
  };
};

export const normalizeSingleProductList = (
  magentoProducts: MagentoSingleProduct
): SingleProductsList => {
  return {
    products: magentoProducts.items?.map(normalizeSingleProduct),
  };
};
