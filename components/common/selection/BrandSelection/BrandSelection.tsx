import { Label } from "@components/typography";
import { Button, Select } from "@components/ui";
import useTranslation from "next-translate/useTranslation";

const BrandSelection = () => {
  const { t } = useTranslation();
  return (
    <div
      className={`grid grid-flow-col grid-cols-4 gap-2 mx-auto py-4`}
      style={{
        gridTemplateRows: "20px auto",
      }}
    >
      <Label htmlFor="brand" className="col-span-4 text-white">
        {t("common/selection:carBrandLabel")}
      </Label>

      <Select
        name="brand"
        placeholder={t("common/selection:carBrandLabel")}
        className="col-span-3"
        options={[
          { value: "1", label: "Toyota" },
          { value: "2", label: "Huenday" },
          { value: "3", label: "GMC" },
        ]}
      />
      <Button>{t("common/selection:actionText")}</Button>
    </div>
  );
};

export default BrandSelection;
