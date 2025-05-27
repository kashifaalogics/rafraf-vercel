import { FunctionComponent, HTMLAttributes } from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLHeadingElement> {}

const H6: FunctionComponent<Props> = ({ className, children, ...props }) => {
  return (
    <h6 className={cn("font-bold text-base", className)} {...props}>
      {children}
    </h6>
  );
};

export default H6;
