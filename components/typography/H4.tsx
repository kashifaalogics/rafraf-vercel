import { FunctionComponent, HTMLAttributes } from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLHeadingElement> {}

const H4: FunctionComponent<Props> = ({ className, children, ...props }) => {
  return (
    <h4 className={cn("font-bold text-2xl", className)} {...props}>
      {children}
    </h4>
  );
};

export default H4;
