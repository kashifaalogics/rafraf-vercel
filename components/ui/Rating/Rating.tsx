import { Star } from "@components/icons";
import { range } from "@utils/common";
import { FunctionComponent, DetailedHTMLProps, HTMLAttributes } from "react";
import { colors } from "theme/themeColors.config";
import cn from "classnames";

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  rating: number;
  size?: "12" | "22";
}

const Rating: FunctionComponent<Props> = ({
  rating,
  size = "12",
  className,
  ...props
}) => {
  return (
    <div className={cn("flex", className)} {...props}>
      {range({ e: 5 }).map((v) => (
        <div className="flex-shrink-0" key={v}>
          <Star
            size={size}
            color={v + 1 <= rating ? colors.yellow : colors.grey}
          />
        </div>
      ))}
    </div>
  );
};

export default Rating;
