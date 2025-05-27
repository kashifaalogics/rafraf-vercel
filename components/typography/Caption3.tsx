import {
  FunctionComponent,
  ElementType,
  HTMLAttributes,
  ComponentType,
} from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLElement> {
  el?:
    | ComponentType<HTMLAttributes<HTMLElement>>
    | ElementType<HTMLAttributes<HTMLElement>>;
}

const Caption3: FunctionComponent<Props> = ({
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

export default Caption3;
