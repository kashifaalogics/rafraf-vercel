import { FunctionComponent, useMemo, Ref } from "react";
import ReactSelect, {
  GroupBase,
  OptionsOrGroups,
  StylesConfig,
  SelectInstance,
} from "react-select";
import useTranslation from "next-translate/useTranslation";
import { Label } from "@components/typography";

export interface SelectOption {
  value: string;
  label: string;
}

export type SelectRefType = SelectInstance<SelectOption>;

interface Props {
  label?: string;
  className?: string;
  name?: string;
  placeholder?: string;
  options?: SelectOption[];
  height?: string;
  loading?: boolean;
  selectRef?: Ref<SelectInstance<SelectOption>>;
  onChange?: (value: string | null) => void;
  disabled?: boolean;
  defaultValue?: string;
  id?: string;
  containerClass?: string;
  borderColor?: string;
}

const Select: FunctionComponent<Props> = ({
  label,
  name,
  placeholder,
  options,
  height = "40px",
  className = "",
  loading = false,
  selectRef,
  onChange = (v) => {},
  disabled = false,
  defaultValue = undefined,
  containerClass,
  borderColor = "hsl(0, 0%, 80%)",
  ...props
}) => {
  const { t } = useTranslation();
  const selectStyles = useMemo<StylesConfig<SelectOption>>(
    () => ({
      input: (provided) => ({
        ...provided,
        height,
      }),
      control: (provided) => ({
        ...provided,
        borderColor,
      }),
    }),
    [height, borderColor]
  );
  return (
    <div className={containerClass}>
      {label ? (
        <Label className={`my-2 text-blue`} htmlFor={props.id}>
          {label}
        </Label>
      ) : (
        ""
      )}
      <ReactSelect<SelectOption>
        id={props.id}
        styles={selectStyles}
        name={name}
        instanceId={name + "-react-select"}
        placeholder={placeholder}
        options={options}
        className={className}
        isLoading={loading}
        ref={selectRef}
        onChange={(v) => onChange(v?.value || null)}
        isDisabled={disabled}
        loadingMessage={() => t("common:loading")}
        defaultValue={options?.find((op) => op.value === defaultValue)}
      />
    </div>
  );
};

export default Select;
