import React, {
  AnchorHTMLAttributes,
  ForwardedRef,
} from "react";
import cn from "classnames";

interface Props extends AnchorHTMLAttributes<HTMLAnchorElement> {}

const A = (
  { className, children, ...props }: Props,
  ref: ForwardedRef<HTMLAnchorElement>
) => {
  return (
    <a
      ref={ref}
      className={cn("hover:underline cursor-pointer", className)}
      {...props}
    >
      {children}
    </a>
  );
};

export default React.forwardRef(A);
