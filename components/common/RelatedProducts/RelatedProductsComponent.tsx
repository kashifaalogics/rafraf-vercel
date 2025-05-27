import { A } from "@components/typography";
import { Image, TOP_Z_INDEX } from "@components/ui";
import { WHATSAPP_LINK, API_URL } from "@framework/const";
import { FunctionComponent, useEffect, useState } from "react";
import { useCustomer, useSearchEngine } from "@common/hooks";
import { useRouter } from "next/router";
import { getConfig } from "@framework/api/config";
import { RelatedProducts } from "@common/types/product";
import useTranslation from "next-translate/useTranslation";
import { RelatdProduct } from "@components/home";
import { getProductByPartnumber } from "@framework/product";
import { current } from "immer";


interface Props {
  related_products: RelatedProducts[];
}

const RelatedProductsComponent: FunctionComponent<Props> = ({related_products}) => {
  const router = useRouter();
  const { searchCookie, recordAnalytic, recordAPI } = useSearchEngine();
  const { locale } = useRouter();
  const { customer } = useCustomer();
  const [relatedProducts, setRelatedProducts] : any = useState([]);
  const { t } = useTranslation();




  useEffect(() => {
    const fetchRelatedProductsData = async () => {
      const locale = router.locale as string
      const config_convert = getConfig({
        locale: router.locale === "ar" ? "ar" : "en",
      });
      const newArray : any = [];
      const relatedSkus1 = related_products.map(async (x) => {
        const getProductBySku:any = await getProductByPartnumber({
          apiConfig: config_convert,
          variables: { sku: x?.sku },
        });
        // debugger
        if (getProductBySku !== null) {
          setRelatedProducts((current:any) => [...current, getProductBySku])
          // newArray.push(getProductBySku);
          
        }
      })
      

      // setRelatedProducts(newArray)

    }
    fetchRelatedProductsData()
  }, [related_products])

  return (
    <>
      <RelatdProduct

          products={relatedProducts || []}
          title={t("common:relatedProducts")}

          routerId={"parts/7442"}
        />
    </>
  );
};

export default RelatedProductsComponent;
