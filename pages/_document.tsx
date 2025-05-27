import { GtmBase, GtmNoScript } from "framework/analytics";
import Document, { Head, Html, Main, NextScript } from "next/document";


class RafrafDocument extends Document {
  render() {
    return (
      <Html
        dir={this.props.locale === "ar" ? "rtl" : "ltr"}
        lang={this.props.locale}
      >
        <Head>
                {/* <!-- Google tag (gtag.js) --> */}
                {/* <script async src="https://www.googletagmanager.com/gtag/js?id=G-W3H01D901F"></script>
                <script>
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());

                  gtag('config', 'G-W3H01D901F');
                </script> */}
          <GtmBase />
          <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
        </Head>
        <body style={{ overflowX: "hidden" }}>
            <GtmNoScript />
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default RafrafDocument;
