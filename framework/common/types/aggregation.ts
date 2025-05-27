export interface AggregationOption {
  count?: number;
  label?: string;
  value?: string;
}

export interface Aggregation {
  label?: string;
  attributeCode?: AggregationAttributeCode;
  count?: number;
  options?: AggregationOption[];
}

export type AggregationAttributeCode = 
| "category_id"
| "price"
| "part_manufacturer_store"
| "part_type_new"
| "featured";
