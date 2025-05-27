import React from "react";

function WApopup() {
  return (
    <>
      <img 
      className="rounded"
      src="images/home/wapopups.webp" 
      alt="" 
      onClick={() => window.location.href = "https://wa.me/send?phone=966536722255"}
      />
    </>
  );
}

export default WApopup;
