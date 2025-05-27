import { FunctionComponent, DetailedHTMLProps, HTMLProps } from "react";

import cn from "classnames";

interface Props
  extends DetailedHTMLProps<HTMLProps<HTMLDivElement>, HTMLDivElement> {}

const ProductCardSkeleton: FunctionComponent<Props> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn("bg-white border-2 shadow-md rounded-md", className)}
      {...props}
      style={{ height: "373px", minWidth: "256px" }}
    >
      <div className="h-1/2 flex justify-center items-end">
        <div className="h-28 w-28 rounded-md bg-grey animate-pulse"></div>
      </div>
      <div className="h-1/2 flex flex-col justify-evenly items-center">
        <div className="w-2/3 h-7 rounded-sm bg-grey animate-pulse"></div>
        <div className="w-2/3 h-7 rounded-sm bg-grey animate-pulse"></div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
