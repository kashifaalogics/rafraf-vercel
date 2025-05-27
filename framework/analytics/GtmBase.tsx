import { FunctionComponent } from "react";
import { GA_TRACKING_ID, GTM_ID } from ".";

interface Props {}

const GtmBase: FunctionComponent<Props> = (props) => {
  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start': new
            Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
            j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
            'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-TBG77DG6');
            `,
        }}
      />
    </>
  );
};

export default GtmBase;
