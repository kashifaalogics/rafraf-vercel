import { ButtonHTMLAttributes, FunctionComponent, ReactNode } from "react";
import cn from "classnames";
import { Loading } from "..";
import { ThemeAllColors, ThemeMainColors } from "theme/theme-colors";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  color?: ThemeMainColors;
  textColor?: ThemeAllColors;
  loadingColor?: ThemeAllColors;
}

const Button: FunctionComponent<Props> = ({
  children,
  className,
  color = "blue-800",
  textColor = "white",
  loading = false,
  disabled = false,
  loadingColor = "add-blue",
  ...rest
}) => {
  return (
    <button
      className={cn(
        `shadow-md rounded flex justify-center items-center bg-${color} text-${textColor} font-bold text-lg leading-5 uppercase text-center hover:bg-${color}-dark active:bg-${color}-darker disabled:bg-grey disabled:text-darkgrey disabled:cursor-default transition-all ${className}`,
      )}
      type="button"
      disabled={loading || disabled}
      {...rest}
    >
      {children}
      {loading && (
        <Loading
          color={
            (loadingColor
              ? loadingColor
              : `${color}-lighter`) as ThemeAllColors
          }
          className="mx-2"
        />
      )}
    </button>
  );
};

export default Button;
