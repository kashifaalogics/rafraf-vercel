import { FunctionComponent, HTMLAttributes } from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLHeadingElement> {}

const H1: FunctionComponent<Props> = ({ className, children, ...props }) => {
  return (
    <h1 className={cn("font-bold text-5xl", className)} {...props}>
      {children}
    </h1>
  );
};

export default H1;
