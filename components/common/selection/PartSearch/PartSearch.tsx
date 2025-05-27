import { Label } from "@components/typography";
import { Button, Select } from "@components/ui";
import useTranslation from "next-translate/useTranslation";

const PartSearch = () => {
  const { t } = useTranslation();
  return (
    <div
      className={`flex flex-col gap-2 mx-auto py-4`}
      style={{
        gridTemplateRows: "20px auto",
      }}
    >
      <Label htmlFor="partInfo" className="col-span-4 text-white">
        {t("common/selection:partLabel")}
      </Label>

      <div className="flex flex-col md:flex-row gap-2">
        <Select
          name="partInfo"
          placeholder={t("common/selection:partLabel")}
          containerClass="w-full md:w-3/4"
          options={[]}
        />
        <Button
          className="w-full md:w-1/4"
          style={{ minHeight: "50px" }}
        >
          {t("common/selection:actionText")}
        </Button>
      </div>
    </div>
  );
};

export default PartSearch;
