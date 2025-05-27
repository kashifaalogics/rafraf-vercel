export interface SortOption {
  label?: string;
  value?: string;
}

export interface SortFields {
  default?: string;
  options?: SortOption[];
}
