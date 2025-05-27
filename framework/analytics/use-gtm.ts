import { Router, useRouter } from "next/router";
import { useEffect } from "react";
import { GTMPageView } from ".";

const useGTM = () => {
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      GTMPageView(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  // Initiate GTM
  useEffect(() => {
    const handleRouteChange = (url: string) => GTMPageView(url);
    Router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      Router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, []);
};

export default useGTM;
