export interface SearchResultRoot {
  hits: SearchResultDataPy;
  timestamp: number;
}

export interface SearchResultDataPy {
  hits: SearchResultDataPy1[];
  schema: SearchResultSchema;
}

export interface SearchResultDataPy1 {
  _source: SearchResultDaum[];
  schema: SearchResultSchema;
}

export interface SearchResultDaum {
  category_id : string;
  description: string;
  sku: string;
  name: string;
  Picture: string;
  price_0_1: number;
  url_key: string;
  type : string;
  // index: number;
  // lang: string;
   //oem: string;
  part_manufacturer_store_value: string;
  // Make: string;
  // Make_Arabic: string;
  // Model: string;
  // Model_Arabic: string;
  // Year: string;
  status_value: string;
}

export interface SearchFilters {
  isGenuineFilter: string;
  isAltFilter: string;
  manufacturerHyundaiFilter: string;
  manufacturerToyotaFilter: string;
  manufacturerMotorcraftFilter: string;
  manufacturerACDelcoFilter: string;
  manufacturerUSstarFilter: string;
  manufacturerDeluxFilter: string;
  manufacturerAvonFilter: string;
  sortBy: string;
}


export interface SearchResultSchema {
  fields: SearchResultField[];
  pandas_version: string;
  primaryKey: string[];
}

export interface SearchResultField {
  name: string;
  type: string;
}

export interface SearchAnalyticsRecord {
  searched_query: string;
  results_clicked_on: string;
  part_number: string;
  userID: string;
  email: string;
  name: string;
  language: string;
  behavior: string;
}

export interface API_Records {
  behaviour: string;
  source: string;
  product?: string;
}