import {
  FunctionComponent,
  ElementType,
  HTMLAttributes,
  ComponentType,
} from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLSpanElement> {
  el?:
    | ComponentType<HTMLAttributes<HTMLElement>>
    | ElementType<HTMLAttributes<HTMLElement>>;
}

const Caption1: FunctionComponent<Props> = ({
  el: El = "p",
  className,
  children,
  ...props
}) => {
  return (
    <El className={cn("font-normal text-xs", className)} {...props}>
      {children}
    </El>
  );
};

export default Caption1;
