import React, {
  HTMLAttributes,
  DetailedHTMLProps,
  FunctionComponent,
  ForwardedRef,
  ForwardRefRenderFunction,
} from "react";
import cn from "classnames";
import s from "./HScrollable.module.css";

interface Props<T> extends DetailedHTMLProps<HTMLAttributes<T>, T> {
  // remove it temporiraly due to typing issues, used fixed `ul` tag instead
  // el?: ElementType<HTMLAttributes<T>>;
}

const HScrollable: ForwardRefRenderFunction<
  HTMLUListElement,
  Props<HTMLUListElement>
> = ({ className, children, ...rest }, ref) => (
  <ul
    className={cn(
      "flex whitespace-nowrap overflow-scroll categories",
      s.noScrollbar,
      className
    )}
    style={{
      scrollBehavior: "smooth",
    }}
    {...rest}
    ref={ref as ForwardedRef<any>}
  >
    {children}
  </ul>
);

export default React.forwardRef(HScrollable);
