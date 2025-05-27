import { useInitialCalls, useRouterLoading } from "@common/hooks";
import { AppProps } from "next/app";
import { FunctionComponent } from "react";
import { UIProvider } from "./ui/constext";
import { Toaster } from "react-hot-toast";
import { Image, Loading } from "./ui";

const logo = "/images/logo/rafraf.png"

const NoOp: FunctionComponent<{ categories: any }> = ({
  categories,
  children,
}) => <>{children}</>;

type AppPropsWithLayout = AppProps & {
  Component: any;
  pageProps: any
};
const App: FunctionComponent<AppPropsWithLayout> = ({
  Component,
  pageProps,
}) => {
  useInitialCalls();
  const { loading } = useRouterLoading();

  const Layout = Component.Layout ?? NoOp;
  return (
    <UIProvider>
      <Toaster />
      {loading ? (
        <div className="flex flex-col gap-5 justify-center items-center min-h-screen">
          <div
            className="relative h-full w-full animate-bounce"
            style={{ maxWidth: "100px", minHeight: "100px" }}
          >
            <Image src={logo} layout="fill" objectFit="contain" />
          </div>
          <Loading size={40} />
        </div>
      ) : (
        <Layout categories={pageProps.categories ? pageProps.categories : []}>
          <Component {...pageProps} />
        </Layout>
      )}
    </UIProvider>
  );
};

export default App;
