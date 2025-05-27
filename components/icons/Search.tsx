import { useRouter } from "next/router";
import { useSearchEngine, useCustomer } from "@common/hooks";

const Search = ({ ...props }) => {
  const router = useRouter();
  const { search, recordAnalytic, searchCookie, recordAPI } = useSearchEngine();
  const { locale } = useRouter();
  const { customer } = useCustomer();

  const {
    setPageNumber,
    setIsAltFilter,
    setIsGenuineFilter,
    setManufacturerACDelcoFilter,
    setManufacturerAvonFilter,
    setManufacturerDeluxFilter,
    setManufacturerHyundaiFilter,
    setManufacturerMotorcraftFilter,
    setManufacturerToyotaFilter,
    setManufacturerUSstarFilter,
    setSortBy
  } = useSearchEngine();

  return (
    <button onClick={()=> {
      // recordAPI({behaviour: "searchquery", source: "navbar"})
      router.push('/search?q=' + props.searched_query);
      setPageNumber(1);
      setSortBy("");
      setIsAltFilter(false);
      setIsGenuineFilter(false);
      setManufacturerACDelcoFilter(false);
      setManufacturerAvonFilter(false);
      setManufacturerDeluxFilter(false);
      setManufacturerHyundaiFilter(false);
      setManufacturerMotorcraftFilter(false);
      setManufacturerToyotaFilter(false);
      setManufacturerUSstarFilter(false);

      recordAnalytic({
        email: customer?.email || "",
        name: `${customer?.firstname || ""} ${
          customer?.lastname || ""
        }`.trim(),
        searched_query: search,
        userID: searchCookie,
        results_clicked_on: "",
        language: locale || "",
        part_number: "",
        behavior: "Icon click",
      });

    }}>
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 20L15.4286 15.4286M10.8571 17.7143C7.07005 17.7143 4 14.6442 4 10.8571C4 7.07005 7.07005 4 10.8571 4C14.6442 4 17.7143 7.07005 17.7143 10.8571C17.7143 14.6442 14.6442 17.7143 10.8571 17.7143Z"
        stroke="#3C425A"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
    </svg>
    </button>
  );
};

export default Search;
