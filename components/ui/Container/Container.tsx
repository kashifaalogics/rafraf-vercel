import {
  ComponentType,
  ElementType,
  FunctionComponent,
  HTMLAttributes,
} from "react";
import { DetailedHTMLProps } from "react";
import cn from "classnames";
import s from "./Container.module.css";

interface Props extends DetailedHTMLProps<HTMLAttributes<any>, any> {
  el?:
    | ComponentType<HTMLAttributes<HTMLElement>>
    | ElementType<HTMLAttributes<HTMLElement>>;
}

const Container: FunctionComponent<Props> = ({
  children,
  el: El = "div",
  className = "",
  ...props
}) => {
  return <El className={cn(s.container, className)}>{children}</El>;
};

export default Container;
