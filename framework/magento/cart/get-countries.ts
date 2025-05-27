import countries from "@assets/data/countries.json";
import { ApiConfig } from "@common/types/api";
import { Country } from "@common/types/coutries";

const getCountries = async (
  apiConfig: ApiConfig
): Promise<Country[]> => {
  return Promise.resolve(
    countries.map((c) => ({ name: c.full_name_locale, code: c.id }))
  );
};

export default getCountries;
