import "@assets/main.css";
import useLangDirection from "@utils/language/useLangDirection";
import { AppProps } from "next/app";
import { FunctionComponent, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "@common/store";
import App from "@components/App";
import { SingletonHooksContainer } from "react-singleton-hook";
import { useGTM } from "framework/analytics";
import { useLanguage } from "@common/hooks";
import Maintenance from "components/Maintenance";
import TagManager from "react-gtm-module";
// export const GTM_ID = process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_ID;

// Global CSS
import "../pages/account/my-account.css";

type AppPropsWithLayout = AppProps & {
  Component: { Layout: FunctionComponent<{ categories?: any }> };
};

const RafrafApp = ({ Component, pageProps, ...rest }: AppPropsWithLayout) => {
  useGTM();
  useLanguage();
  const dir = useLangDirection();

  useEffect(() => {
    if (!document) return;
    document.body.dir = dir.rtl ? "rtl" : "ltr";
  }, [dir]);

  useEffect(() => {
    TagManager.initialize({ gtmId: "GTM-TBG77DG6" }); // Replace with your GTM ID
  }, []);

  return (
    <>
      <Provider store={store}>
        <App Component={Component} pageProps={pageProps} {...rest} />
        <SingletonHooksContainer />
      </Provider>
    </>
  );
};

export default RafrafApp;
