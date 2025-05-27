import cars from "@assets/data/cars.json";

interface Props {
  value: {
    car: Boolean;
    maker: String;
    model: String;
    year: string;
  };
  dir: {
    rtl: boolean;
    ltr: boolean;
  };
}

const getCarLocalized = ({ value, dir }: Props) => {
  const { rtl } = dir;
  const full_array = cars.filter(
    (e) => e.makerEn.toLocaleLowerCase() === value.maker.toLocaleLowerCase()
  );
  const maker = rtl
    ? full_array.length
      ? full_array[0].makerAr
      : ""
    : full_array.length
    ? full_array[0].makerEn
    : "";

  const model = rtl
    ? full_array.length
      ? full_array[0].models.filter(
          (e) =>
            e.modelEn.toLowerCase().replaceAll(" ", "").replaceAll("-", "") ===
            value.model.toLowerCase().replaceAll(" ", "").replaceAll("-", "")
        )[0]?.modelAr
      : ""
    : full_array.length
    ? full_array[0].models.filter(
        (e) =>
          e.modelEn.toLowerCase().replaceAll(" ", "").replaceAll("-", "") ===
          value.model.toLowerCase().replaceAll(" ", "").replaceAll("-", "")
      )[0]?.modelEn
    : "";

  return {
    maker: maker,
    model: model,
    year: value.year.replaceAll("-", ""),
  };
};

export { getCarLocalized };
