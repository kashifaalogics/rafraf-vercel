import { FunctionComponent, HTMLAttributes } from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLHeadingElement> {}

const H3: FunctionComponent<Props> = ({ className, children, ...props }) => {
  return (
    <h3 className={cn("font-bold text-3xl", className)} {...props}>
      {children}
    </h3>
  );
};

export default H3;
