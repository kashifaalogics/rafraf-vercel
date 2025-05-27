import { A } from "@components/typography";
import { Image, TOP_Z_INDEX } from "@components/ui";
import { WHATSAPP_LINK } from "@framework/const";
import { FunctionComponent } from "react";
import { useCustomer, useSearchEngine } from "@common/hooks";
import { useRouter } from "next/router";

interface Props {}

const WhatsAppSticky: FunctionComponent<Props> = (props) => {
  const { searchCookie, recordAnalytic, recordAPI } = useSearchEngine();
  const { locale } = useRouter();
  const { customer } = useCustomer();

  return (
    <div
      className="fixed bottom-3 right-3 h-16 w-16 p-2"
      style={{ zIndex: TOP_Z_INDEX }}
      onClick={() => {
        recordAnalytic({
          email: customer?.email || "",
          name: `${customer?.firstname || ""} ${
            customer?.lastname || ""
          }`.trim(),
          searched_query: "",
          userID: searchCookie,
          results_clicked_on: "",
          language: locale || "",
          part_number: "",
          behavior: "Whatsapp",
        });
      }}
      
    >
      
      <A
        href={WHATSAPP_LINK}
        target="_blank"
        title="تواصل على الواتسآب"
        
      >
        <div className="relative w-full h-full animate-bounce" 
        // onClick={() => recordAPI({ behaviour: "whatsapp", source: "navbar"})}
        >
          <Image src={"/images/whatsapp.webp"} />
        </div>
      </A>
      
    </div>
  );
};

export default WhatsAppSticky;
