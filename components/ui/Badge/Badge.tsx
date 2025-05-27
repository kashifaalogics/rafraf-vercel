import { FunctionComponent } from "react";
import cn from "classnames";
import useLangDirection from "@utils/language/useLangDirection";

interface Props {
  value: number | string;
  className?: string;
}

const Badge: FunctionComponent<Props> = ({
  value,
  className = "",
  children,
}) => {
  const dir = useLangDirection();
  // console.log(cartCount.cart.items.length)

  return (
    <div className="relative">
      {children}
      {!value ? (
        <></>
      ) : (
        <span
          className={cn(
            `flex items-center justify-center absolute top-0 ${
              dir.rtl ? "left" : "right"
            }-0 rounded-full bg-red text-xs text-white px-1 text-transparent font-bold`,
            className
          )}
        >
          {value}
        </span>
      )}
    </div>
  );
};

export default Badge;
