import { useRouter } from "next/router";
import { useEffect } from "react";
import { singletonHook } from "react-singleton-hook";

const useLanguage = () => {
  const { locale, defaultLocale } = useRouter();

  useEffect(() => {
    if (locale !== defaultLocale) {
      const date = new Date();
      const expireMs = 100 * 24 * 60 * 60 * 1000; // 100 days
      date.setTime(date.getTime() + expireMs);
      document.cookie = `NEXT_LOCALE=${locale};expires=${date.toUTCString()};path=/`;
    }
  }, [locale, defaultLocale]);
};

export default singletonHook(null, useLanguage);
