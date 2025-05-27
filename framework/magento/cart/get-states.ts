import states from "@assets/data/states.json";
import { ApiConfig } from "@common/types/api";
import { CountryState } from "@common/types/coutries";

const getStates = async (
  apiConfig: ApiConfig,
  variables: { countryCode: string }
): Promise<CountryState[]> => {
  return Promise.resolve(states.map((s) => ({ name: s.label, code: s.value })));
};

export default getStates;
