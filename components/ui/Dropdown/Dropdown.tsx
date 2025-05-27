import { FunctionComponent, useState } from "react";

interface Props {
  open: boolean;
}

const Dropdown: FunctionComponent<Props> = ({open, children}) => {
  
  if(!open) return <></>



  return (
    <div
      className="w-full min-w-max overflow-y-auto absolute bg-white z-40 rounded-sm animate__animated animate__fadeIn animate__faster"
      style={{
        filter: "drop-shadow(0px 1px 6px rgba(0, 0, 0, 0.2))",
        top: "110%",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "white",
        maxHeight: "80vh",
      }}
    >
      {children}
    </div>
  );
};

export default Dropdown;
