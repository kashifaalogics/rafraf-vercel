import { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from "react";
import cn from "classnames";
import { ThemeAllColors } from "theme/theme-colors";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  size?: number;
  thickness?: number;
  color?: ThemeAllColors;
}

const Loading: FunctionComponent<Props> = ({
  size = 20,
  thickness = 2,
  color = "primary-lighter",
  className,
  ...rest
}) => {
  return (
    <div
      className={cn(`animate-spin border-primary-lighter`, className)}
      style={{
        height: size,
        width: size,
        borderWidth: thickness,
        borderRadius: "9999px",
        borderTopColor: "transparent",
        borderBottomColor: "transparent",
        opacity: 0.5,
        animationTimingFunction: "cubic-bezier(0.49, 0.01, 0.6, 0.88)",
      }}
    ></div>
  );
};

export default Loading;
