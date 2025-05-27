import { FunctionComponent, HTMLAttributes } from "react";
import cn from "classnames";

interface Props extends HTMLAttributes<HTMLParagraphElement> {}

const P: FunctionComponent<Props> = ({ className, children, ...props }) => {
  return (
    <>
    <p className={cn("font-normal text-black leading-5", className)} {...props}>
      {children}
    </p>
    </>
  );
};

export default P;
