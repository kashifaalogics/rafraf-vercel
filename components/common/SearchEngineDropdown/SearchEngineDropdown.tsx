import { useCustomer, useSearchEngine } from "@common/hooks";
import { FunctionComponent } from "react";
import { IMAGES_STORAGE_URL } from "@framework/const";
import Link from "next/link";
import { A, Label } from "@components/typography";
import { useRouter } from "next/router";
import useTranslation from "next-translate/useTranslation";
import manuImg from "../../../assets/data/manufacturersImages.json";
import manuLabel from "../../../assets/data/manufacturers.json";
import { Button } from "@components/ui";
import { useStore } from "@common/state";

interface Props {}

const SearchEngineDropdown: FunctionComponent<Props> = (props) => {
  const { result, search, searchCookie, recordAPI, setPageSize } =
    useSearchEngine();
  const { locale } = useRouter();
  const { customer } = useCustomer();
  const { t } = useTranslation();
  const router = useRouter();
  const carSelected = useStore((state) => state.carSelected);
  var cutresult = result.slice(0, 9);
  cutresult.map((r: any) => {
    if (r.hasOwnProperty("category_id")) {
      // Check if code is running on the client side
      if (typeof window !== "undefined") {
        const mainCategory = localStorage.getItem("MAIN_CATEGORY");
        if (mainCategory !== null) {
          r.category_id = mainCategory
        }
      }
    } else {
      r.category_id = "";
    }
    if (r.hasOwnProperty("image")) {
      r.Picture = r.image.url
        ? "" + r.image.url
        : "catalog/product/placeholder/default/Rafraf-small.jpg";
    } else {
      r.Picture = "catalog/product/placeholder/default/Rafraf-small.jpg";
    }
    if (r.hasOwnProperty("price_range")) {
      r.price_0_1 = r.price_range.minimum_price.final_price.value
        ? r.price_range.minimum_price.final_price.value
        : null;
    } else {
      r.price_0_1 = null;
    }
    if (r.hasOwnProperty("part_manufacturer_store")) {
      r.part_manufacturer_store_value =
        manuLabel[r.part_manufacturer_store as keyof typeof manuLabel];
    }
  });

  const showMoreButton = () => {
    {
      router.push("/search?q=" + [search]);
    }
  };
  return (
    <>
      {cutresult.map((r, i) => (
        <div
          key={i}
          // onClick={() => {
          //   // recordAPI({behaviour: "dropdownsearch", source: "navbar", product: r.PN})
          //   recordAnalytic({
          //     email: customer?.email || "",
          //     name: `${customer?.firstname || ""} ${
          //       customer?.lastname || ""
          //     }`.trim(),
          //     searched_query: search,
          //     userID: searchCookie,
          //     results_clicked_on: r.description,
          //     language: locale || "",
          //     part_number: r.sku,
          //     behavior: "Drop down",
          //   });
          // }}
        >
          <Link
            href={`/parts/all/product/${
              Array.isArray(r["url_key"]) ? r["url_key"][0] : r["url_key"] 
            }`}
          >
            <A>
              <div
                className={`flex flex-row-reverse gap-2 justify-between flex-wrap border-b-2 px-2 ${
                  r.sku !== "" ? "" : "hidden"
                }`}
              >
                <div className="flex flex-1 flex-col">
                  <div>
                    {Array.isArray(r["name"]) ? r["name"][0] : r["name"]}
                    {"- " + r["sku"] + r["category_id"]}
                  </div>
                  {r.price_0_1 ? (
                    <div className="font-bold">
                      {"SAR "} {Number(r["price_0_1"]).toFixed(2)}
                    </div>
                  ) : (
                    ""
                  )}
                  {r.part_manufacturer_store_value
                    ? r.part_manufacturer_store_value && (
                        <>
                          <div className="col-span-2">
                            <img
                              src={
                                IMAGES_STORAGE_URL +
                                manuImg[
                                  r.part_manufacturer_store_value as keyof typeof manuImg
                                ]
                              }
                              className="h-6"
                              alt="Logo Image"
                            />
                          </div>
                        </>
                      )
                    : ""}
                </div>
                <div className="w-14 relative h-14">
                  <img
                    src={`https://s3.me-south-1.amazonaws.com/images.rafraf.com/${r.Picture}`}
                    alt="Rafraf Image"
                    // layout="fill"
                    // objectFit="scale-down"
                    onError={(e: any) =>
                      (e.target.src =
                        "https://s3.me-south-1.amazonaws.com/images.rafraf.com/catalog/product/placeholder/default/Rafraf-small.jpg")
                    }
                  />
                </div>
              </div>
            </A>
          </Link>
        </div>
      ))}
      <div>
        <h6>
          <Button
            className="btn btn-search-showall"
            style={{ backgroundColor: "#1D4ED8" }}
            onClick={showMoreButton}
          >
            {locale === "ar" ? "عرض الكل" : "Show All"}
          </Button>
        </h6>
      </div>
    </>
  );
};

export default SearchEngineDropdown;
