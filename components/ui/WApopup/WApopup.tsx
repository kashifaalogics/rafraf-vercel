import React from "react";
import { Image } from "@components/ui";

function WApopup() {
  return (
    <>
      <Image
      className="rounded"
      src="images/home/wapopups.webp"
      alt=""
      onClick={() => window.location.href = "https://wa.me/send?phone=966536722255"}
      />
    </>
  );
}

export default WApopup;
