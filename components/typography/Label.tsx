import { FunctionComponent, HTMLProps } from "react";
import cn from "classnames";

interface Props extends HTMLProps<HTMLLabelElement> {}

const Label: FunctionComponent<Props> = ({ className, children, ...props }) => {
  return (
    <label
      className={cn("capitalize text-xs leading-4 font-bold", className)}
      {...props}
    >
      {children}
    </label>
  );
};

export default Label;
