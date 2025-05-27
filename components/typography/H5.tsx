import { FunctionComponent, HTMLAttributes } from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLHeadingElement> {}

const H5: FunctionComponent<Props> = ({ className, children, ...props }) => {
  return (
    <h5 className={cn("font-bold text-lg", className)} {...props}>
      {children}
    </h5>
  );
};

export default H5;
