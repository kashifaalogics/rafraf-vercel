import { FunctionComponent } from "react";
import { GTM_ID } from ".";

interface Props {}

const GtmNoScript: FunctionComponent<Props> = (props) => {
  return (
    <noscript>
      <iframe
        src={`https://www.googletagmanager.com/ns.html?id=GTM-TBG77DG6`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
};

export default GtmNoScript;
