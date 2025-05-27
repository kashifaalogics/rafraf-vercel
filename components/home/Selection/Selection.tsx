import React, {
  DetailedHTMLProps,
  FunctionComponent,
  HTMLAttributes,
  useState,
  useMemo,
} from "react";
import { CarSelection } from "@components/common/selection";
import useTranslation from "next-translate/useTranslation";
import { useUI } from "@components/ui/constext";

const tabs = [
  "selectionTabByCarProps",
] as const;

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {}

const Selection: FunctionComponent<Props> = ({ className, ...rest }) => {
  const { t } = useTranslation();
  const { openModal } = useUI();
  const [selected, setSelected] = useState<typeof tabs[number]>(
    "selectionTabByCarProps"
  );

  const VisibleTab = useMemo(() => {
    switch (selected) {
      case "selectionTabByCarProps":
        return CarSelection;
    }
  }, [selected]);

  return (
    <div className={className}>
      <div className="relative">
        <VisibleTab />
      </div>

      <div className="flex py-1">
        {tabs.map((b, i) => (
          <React.Fragment key={i}>
            {selected === b ? (
              <></>
            ) : (
              <button
                key={i}
                className={`flex-1 rounded-md uppercase text-center leading-5 text-lg font-bold text-white opacity-70 hover:opacity-100 ${
                  selected === b ? "opacity-100 underline" : ""
                }`}
                onClick={() => {
                  if (b === "selectionTabByCarProps") {
                    setSelected(b);
                  } else {
                    openModal(
                      <div className="text-blue text-lg">
                        {t("common:soon")}
                      </div>
                    );
                  }
                }}
              >
                {t(`home:${b}`)}
              </button>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Selection;
