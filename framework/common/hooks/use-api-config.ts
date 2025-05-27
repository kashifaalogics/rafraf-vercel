import { RootState } from "@common/store";
import { ApiConfig } from "@common/types/api";
import { getConfig } from "@framework/api/config";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { singletonHook } from "react-singleton-hook";

const initialResult: ApiConfig = getConfig({ locale: "ar", token: null });

const useApiConfig = (): ApiConfig => {
  const { locale } = useRouter();
  const { token, loggedIn } = useSelector((state: RootState) => state.customer);
  
  const [config, setConfig] = useState(
    getConfig({ locale: locale || "ar", token: token || localStorage.getItem("TOKEN") })
  );

  useEffect(() => {
    console.log("tokenn:", token || localStorage.getItem("TOKEN"))
    setConfig(getConfig({ locale: locale || "ar", token: token || localStorage.getItem("TOKEN") }));
  }, [token, locale, loggedIn]);

  return config;
};

export default singletonHook(initialResult, useApiConfig);
