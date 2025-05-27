import { useEffect, useState } from "react";
import { singletonHook } from "react-singleton-hook";
import Router from "next/router";
import Progress from "@badrap/bar-of-progress";
import { colors } from "theme/themeColors.config";

const progress = new Progress({
  className: "z-50",
  color: colors.blue,
  delay: 300,
  size: 2,
});

Router.events.on("routeChangeStart", progress.start);
Router.events.on("routeChangeComplete", progress.finish);
Router.events.on("routeChangeError", progress.finish);

interface UseRouterLoadingResult {
  loading: boolean;
}

const initialState: UseRouterLoadingResult = {
  loading: false,
};

const useRouterLoading = (): UseRouterLoadingResult => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const start = () => {
      setLoading(true);
    };
    const end = () => {
      setLoading(false);
    };
    Router.events.on("routeChangeStart", start);
    Router.events.on("routeChangeComplete", end);
    Router.events.on("routeChangeError", end);
    return () => {
      Router.events.off("routeChangeStart", start);
      Router.events.off("routeChangeComplete", end);
      Router.events.off("routeChangeError", end);
    };
  }, []);

  return { loading };
};

export default singletonHook(initialState, useRouterLoading);
