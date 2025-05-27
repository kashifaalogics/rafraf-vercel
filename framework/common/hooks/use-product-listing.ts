import { Category } from "@common/types/category";
import { Product, ProductsList } from "@common/types/product";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";

import actualCategories from "@assets/data/actual-categories.json";
import { ProductAttributeSortInput } from "@framework/schema";
import { AggregationOption } from "@common/types/aggregation";
import { SortOption } from "@common/types/sorting";
import { Paging } from "@common/types/paging";
import { useApiConfig } from ".";
import { useDispatch, useSelector } from "react-redux";
import { Dispatch, RootState } from "@common/store";
import { singletonHook } from "react-singleton-hook";

export interface UseProductListingResult {
  meta: {
    description: string;
    title: string;
    keywords: string;
  };
  partCategories: Category[];
  activePartCategories: AggregationOption[];
  partType: AggregationOption[];
  partManufacturer: AggregationOption[];

  sortOptions: SortOption[];
  defaultSort: string;

  products: Product[];
  productsPage: Paging;

  loading: boolean;

  handleCategoryFilterChange: (value: string, isAdd?: boolean) => void;
  handlePriceFilterChange: (value: { from: string; to: string }) => void;
  handlePartManufacturerFilterChange: (value: string, isAdd?: boolean) => void;
  handlePartTypeFilterChange: (value: string, isAdd?: boolean) => void;

  handleSortChange: (value: keyof ProductAttributeSortInput) => void;

  handlePrevPage: () => void;
  handleNextPage: () => void;
  handelGoToPage: (value: string, isAdd?: boolean) => void;
}

export interface UseProductListingParams {
  initialProducts: ProductsList;
  categoriesTree: Category[];
  mainCategory?: Category;
}

const initalState: UseProductListingResult = {
  meta: {
    description: "",
    title: "",
    keywords: "",
  },
  partCategories: [],
  activePartCategories: [],
  partType: [],
  partManufacturer: [],

  sortOptions: [],
  defaultSort: "",

  products: [],
  productsPage: {},

  loading: false,

  handleCategoryFilterChange: (value: string, isAdd?: boolean) => {},
  handlePriceFilterChange: (value: { from: string; to: string }) => {},
  handlePartManufacturerFilterChange: (value: string, isAdd?: boolean) => {},
  handlePartTypeFilterChange: (value: string, isAdd?: boolean) => {},

  handleSortChange: (value: keyof ProductAttributeSortInput) => {},

  handlePrevPage: () => {},
  handleNextPage: () => {},
  handelGoToPage: (value: string, isAdd?: boolean) => {},
};

const useProductListing = ({
  initialProducts,
  categoriesTree,
  mainCategory,
}: UseProductListingParams): UseProductListingResult => {
  const { locale, ...router } = useRouter();
  const apiConfig = useApiConfig();

  const dispatch = useDispatch<Dispatch>();
  const {
    getProducts,
    setProducts,
    setCategoryFilters,
    setPriceFilters,
    addPartManufacturerFilters,
    addPartTypeFilters,
    removePartManufacturerFilters,
    removePartTypeFilters,
    nextPage,
    prevPage,
    goToPage,
    setSort,
    setCategory,
  } = dispatch.productListing;

  const { variables, products } = useSelector(
    (state: RootState) => state.productListing
  );
  const { getProducts: loading } = useSelector(
    (state: RootState) => state.loading.effects.productListing
  );

  const [variablesUpdates, setVariablesUpdates] = useState<number>(0);
  const [changeFilter, setChangeFilter] = useState<boolean>(false);
  const [changePage, setChangePage] = useState<boolean>(false);
  const [changeManuFilter, setChangeManuFilter] = useState<boolean>(false);

  // Page meta data base (aggregation option)
  const metaAggergation = useMemo<AggregationOption | undefined>(
    () =>
      products?.aggregations
        ?.find((ag) => ag.attributeCode === "category_id")
        ?.options?.find(
          (op) =>
            op.value === (mainCategory?.id || router.query.categories || [])[0]
        ),
    [products?.aggregations]
  );

  // applicable part categories from current aggregation
  const partCategories = useMemo<Category[]>(() => {
    const categoriesAggregation = products?.aggregations?.find(
      (ag) => ag.attributeCode === "category_id"
    );

    if (!categoriesAggregation?.options) return [];

    const categoriesOptions = categoriesAggregation.options.filter((op) =>
      actualCategories.includes(op.value || "")
    );

    const categoriesOptionsIds = categoriesOptions
      .map((op) => op.value)
      .reduce<string[]>((array, cur) => {
        if (cur) {
          array.push(cur);
        }
        return array;
      }, []);

    const tree = categoriesTree.reduce<Category[]>((array, c1) => {
      if (categoriesOptionsIds.includes(c1.id || "")) {
        array.push(c1);
        if (!c1.children) {
          c1.children = [];
        }

        c1.children = c1.children.filter((c2) =>
          categoriesOptionsIds.includes(c2.id || "")
        );
      }
      return array;
    }, []);

    return tree;
  }, [products?.aggregations]);

  // activated part categories
  const activePartCategories = useMemo<AggregationOption[]>(() => {
    const active = variables.filter?.category_id?.in
      ?.filter((c) => c && actualCategories.includes(String(c)))
      .map(String);

    if (!active) return [];

    const categoriesAggergations = products?.aggregations?.find(
      (ag) => ag.attributeCode === "category_id"
    );

    if (!categoriesAggergations?.options) return [];

    return (
      categoriesAggergations.options.filter((op) =>
        active.includes(op.value || "")
      ) || []
    );
  }, [variables.filter?.category_id?.in]);

  // applicable part type filters
  const partType = useMemo<AggregationOption[]>(
    () =>
      products?.aggregations?.find((ag) => ag.attributeCode === "part_type_new")
        ?.options || [],
    [products?.aggregations]
  );

  // applicable part manufacturers filters
  const partManufacturer = useMemo<AggregationOption[]>(
    () =>
      products?.aggregations?.find(
        (ag) => ag.attributeCode === "part_manufacturer_store"
      )?.options || [],
    [changeManuFilter]
  );

  const sortOptions = useMemo<SortOption[]>(
    () => products?.sort?.options || [],
    [products?.sort?.options]
  );

  const defaultSort = useMemo<string>(
    () => products?.sort?.default || "",
    [products?.sort?.default]
  );

  // initialize products state
  useEffect(() => {
    setProducts(initialProducts);
  }, [initialProducts]);

  const carCategories = useMemo<string[]>(() => {
    const cats = mainCategory?.id || (router.query.categories as any) || [];
    if (cats.filter) {
      return (cats as string[]).filter((c) => !actualCategories.includes(c));
    } else {
      return [cats].filter((c) => !actualCategories.includes(c));
    }
  }, [router.query]);

  // get filters from route
  useEffect(() => {
    setChangeManuFilter(true);
    setCategoryFilters(
      ([mainCategory?.id || router.query.categories] as any) || []
    );
  }, [router.query, mainCategory]);

  useEffect(() => {
    const PAGE = JSON.parse(localStorage.getItem("PAGE") || "{}").pageNumber;
    const categFilterId = JSON.parse(localStorage.getItem("categFilter") || "{}").cateId;

    if (changeFilter && categFilterId && PAGE === "1") {
      setCategoryFilters([...carCategories, categFilterId])
    }
    else if (changeFilter && categFilterId && PAGE !== "1") {
      setCategoryFilters([...carCategories, categFilterId])
      goToPage(PAGE)
    }

    }, [changeFilter]);

    useEffect(() => {
      const PAGE = JSON.parse(localStorage.getItem("PAGE") || "{}").pageNumber;
      const categFilterId = JSON.parse(localStorage.getItem("categFilter") || "{}").cateId;

      if (changePage && !categFilterId && PAGE !== "1") {
        goToPage(PAGE)
      }
      }, [changePage]);

  // don't reload products on first component mount, they are already rendered by the server
  useEffect(() => {
    if (!initialProducts) return;
    setVariablesUpdates((variablesUpdates) => variablesUpdates + 1);
    if (variablesUpdates <= 1) return;

    getProducts({ apiConfig, variables });
  }, [variables]);

  useEffect(() => {
    const MAIN_CATEGORY = JSON.parse(localStorage.getItem("MAIN_CATEGORY") || "{}");

    if (MAIN_CATEGORY === mainCategory?.id) {
      setChangeFilter(true)
      setChangePage(true)
      return
    }
    else {
      localStorage.setItem("PAGE", JSON.stringify({"pageNumber":"1"}));
      localStorage.setItem("categFilter", JSON.stringify({"cateName":"", "cateId":""}));
      localStorage.setItem("MAIN_CATEGORY", JSON.stringify(mainCategory?.id));
    }
    
  }, [mainCategory?.id]);

  const handleCategoryFilterChange = useCallback(
    (value: string, isAdd: boolean = true) => {
      setCategoryFilters([...carCategories, ...(isAdd ? [value] : [])]);
    },
    [carCategories, setCategoryFilters]
  );

  const handlePriceFilterChange = useCallback(
    (value: { from: string; to: string }) => {
      setPriceFilters(value);
    },
    []
  );

  const handlePartManufacturerFilterChange = useCallback(
    (value: string, isAdd?: boolean) => {
      if (isAdd) {
        addPartManufacturerFilters(value);
      } else {
        removePartManufacturerFilters(value);
      }
    },
    []
  );

  const handlePartTypeFilterChange = useCallback(
    (value: string, isAdd?: boolean) => {
      if (isAdd) {
        addPartTypeFilters(value);
      } else {
        removePartTypeFilters(value);
      }
    },
    []
  );

  const handleSortChange = useCallback(
    (
      value: keyof ProductAttributeSortInput,
      direction: "ASC" | "DESC" = "ASC"
    ) => {
      setSort({ value, direction });
    },
    []
  );

  const handleNextPage = useCallback(() => {
    nextPage();
  }, []);

  const handlePrevPage = useCallback(() => {
    prevPage();
  }, []);

  const handelGoToPage = useCallback((value: string, isAdd?: boolean) => {
    goToPage(value);
  }, []);


  return {
    // web page meta data
    meta: {
      description:
        mainCategory?.meta?.description || metaAggergation?.label || "",
      title: mainCategory?.meta?.title || metaAggergation?.label || "",
      keywords: mainCategory?.meta?.keywords || metaAggergation?.label || "",
    },

    // filteration
    partCategories,
    activePartCategories,
    partType,
    partManufacturer,

    // sorting
    sortOptions,
    defaultSort,

    // products
    products: products?.products || [],
    productsPage: products?.page || {},

    // loading state
    loading,

    // filter change handlers
    handleCategoryFilterChange,
    handlePriceFilterChange,
    handlePartManufacturerFilterChange,
    handlePartTypeFilterChange,

    // sorting change handlers
    handleSortChange,

    // paging handlers
    handleNextPage,
    handlePrevPage,
    handelGoToPage,
  };
};

export default (params: UseProductListingParams) =>
  singletonHook(initalState, () => useProductListing(params));
