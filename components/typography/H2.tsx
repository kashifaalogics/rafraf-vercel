import { FunctionComponent, HTMLAttributes } from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLHeadingElement> {}

const H2: FunctionComponent<Props> = ({ className, children, ...props }) => {
  return (
    <h2 className={cn("font-bold text-4xl", className)} {...props}>
      {children}
    </h2>
  );
};

export default H2;
