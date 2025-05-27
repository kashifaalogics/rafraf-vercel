import { Cross } from "@components/icons";
import { FunctionComponent } from "react";
import { colors } from "theme/themeColors.config";
import { Button } from "..";

interface Props {
  label: string;
  value?: string;
  onRemove?: (value: string) => void;
}

const Pill: FunctionComponent<Props> = ({
  label,
  value,
  onRemove = (_) => {},
}) => {
  return (
    <div
      className="flex justify-between items-center bg-transparent rounded p-1 px-2 gap-2"
      style={{ border: "1px solid #9A9898", color: "#9A9898" }}
    >
      {label}
      <Button
        color="white"
        className="rounded-full h-5 w-5 flex items-center justify-center shadow-none"
        onClick={() => onRemove(value || label)}
      >
        <div className="transform scale-50">
          <Cross color={colors.blue} />
        </div>
      </Button>
    </div>
  );
};

export default Pill;
