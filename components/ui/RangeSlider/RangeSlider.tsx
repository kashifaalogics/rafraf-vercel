import { FunctionComponent, useEffect, useState } from "react";

interface Props {
  /**
   * accepts array of ranges, each range is in form of xxx_yyy where x is min and y is max
   */
  ranges: string[];
  label?: string;
  onChange?: (value: { from: string; to: string }) => void;
}

const RangeSlider: FunctionComponent<Props> = ({
  ranges,
  onChange = () => {},
}) => {
  const [selectedMax, setSelectedMax] = useState<number>();
  const [selectedMin, setSelectedMin] = useState<number>();

  useEffect(() => {
    onChange({
      from: String(selectedMin || 0),
      to: String(selectedMax || 1000000),
    });
  }, [selectedMin, selectedMax]);

  return (
    <div>
      <div>
        <label>
          من
          <select
            className="bg-transparent"
            onChange={(e) => setSelectedMin(+e.target.value)}
          >
            {ranges
              .map((r) => +r.split("_")[0])
              .map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
          </select>
        </label>
      </div>
      <div>
        <label>
          إلى
          <select
            className="bg-transparent"
            onChange={(e) => setSelectedMax(+e.target.value)}
          >
            {ranges
              .map((r) => +r.split("_")[1])
              .map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
          </select>
        </label>
      </div>
    </div>
  );
};

export default RangeSlider;
