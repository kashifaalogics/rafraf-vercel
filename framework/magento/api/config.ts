import { ApiConfig } from "@common/types/api";
import { fetchApi } from "../utils";

class Config {
  constructor(private config: ApiConfig) {}

  getConfig(): ApiConfig {
    return this.config;
  }

  setLocale(locale: string) {
    this.config.locale = locale;
  }

  setToken(token: string | null) {
    this.config.token = token;
  }
}

const configWrapper = new Config({
  fetch: fetchApi,
  locale: "ar",
  token: null,
});

export function getConfig({ locale, token = null }: { locale: string; token?: string | null }) {
  configWrapper.setLocale(locale);
  configWrapper.setToken(token);
  return configWrapper.getConfig();
}
