import { Aggregation } from "./aggregation";
import { Category } from "./category";
import { CurrencyEnum } from "./currency";
import { Paging } from "./paging";
import { HtmlHeaderContent } from "./seo";
import { SortFields } from "./sorting";
import manufacturers from "@assets/data/manufacturers.json";
import { Money } from "./payment";

export interface ProductImage {
  url: string;
  alt?: string;
}

export interface ProductPrice {
  regular?: Money;
  final?: Money;
}

export interface ProductRating {
  summary?: number;
}

export interface ProductReviews {
  count?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  oem: string | null;
  COD: any;
  description: string;
  slug: string;
  path: string;
  images: ProductImage[];
  price: ProductPrice;
  header?: HtmlHeaderContent;
  rating?: ProductRating;
  reviews?: ProductReviews;
  categories?: Category[];
  manufacturer?: string | null;
  variants: ProductVariant[];
  stock_status: string | undefined;
  type?: "genuine" | "aftermarket" | null;
  related_products?: RelatedProducts[] | [];
}

export interface SingleProduct {
  sku: string;
}

export interface ProductsList {
  products?: Product[];
  page?: Paging;
  aggregations?: Aggregation[];
  sort?: SortFields;
}

export interface SingleProductsList {
  products?: SingleProduct[];
}

export interface ProductSearchList {
  product?: Product[];
  page?: number;
  aggregations?: Aggregation[];
  sort?: SortFields;
}

export interface ProductVariant {
  attributes: {
    code?: string;
    uid?: string;
    value?: string;
    label?: string;
  }[];
}

export interface RelatedProducts {
  // map(arg0: (x: any) => string): unknown;
  id?: any;
  name?: any;
  sku?: any;
  url_key?: any;
}
