import { Label } from "@components/typography";
import {
  FunctionComponent,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { ThemeAllColors } from "theme/theme-colors";
import { useRouter } from "next/router";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  validationFunction?: (v: string) => boolean;
  errorMessage?: string;
  onValueChange?: ({ value, valid }: { value: string; valid: boolean }) => void;
  borderColor?: `border-${ThemeAllColors}`;
  containerClass?: string;
}

const Input: FunctionComponent<Props> = ({
  label,
  validationFunction = (_) => true,
  errorMessage = "",
  onValueChange = (v) => {},
  borderColor = "border-darkgrey",
  containerClass = "",
  ...props
}) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const { locale } = useRouter();

  useEffect(() => {
    const valid =
      validationFunction(value.replaceAll(" ", "").trim()) || !value;
    onValueChange({ value, valid });
    if (valid) {
      setError("");
    } else {
      setError(errorMessage);
    }
  }, [value]);

  return (
    <div className={containerClass}>
      {label ? (
        <Label
          className={`my-2 ${error ? "text-red" : "text-blue"}`}
          htmlFor={props.id}
        >
          {label}
        </Label>
      ) : (
        ""
      )}
      <input
        type={props.type}
        name={props.name}
        id={props.id}
        className={`w-full shadow-md  bg-grey-op-20   ${
          locale === "ar" ? "rounded-r" : "rounded-l"
        } px-4 py-3 ${error ? "border-red" : borderColor} ${props.className}`}
        placeholder={props.placeholder}
        onChange={(e) => setValue(e.target.value)}
        {...props}
      />
      {error && <div className="text-red pt-6">{error}</div>}
    </div>
  );
};

export default Input;
