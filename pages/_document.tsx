import { GtmBase, GtmNoScript } from "framework/analytics";
import Document, { Head, Html, Main, NextScript, DocumentContext, DocumentInitialProps } from "next/document";

class RafrafDocument extends Document {
  static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
    try {
      const initialProps = await Document.getInitialProps(ctx);

      // Implement a size check for rendered content
      const content = initialProps.html;
      if (content && content.length > 1024 * 1024) { // 1MB limit
        console.warn(`Large page content detected (${content.length} bytes) for ${ctx.pathname}`);
        // You might want to log this to your monitoring system
      }

      return {
        ...initialProps,
        // Ensure we're not exceeding Node's string size limits
        html: content.slice(0, Math.min(content.length, 512 * 1024 * 1024)), // 512MB max (Node's string size limit)
      };
    } catch (error) {
      console.error(`Error in document getInitialProps for ${ctx.pathname}:`, error);
      // Return minimal valid document props in case of error
      return {
        html: '',
        head: [],
        styles: [],
      };
    }
  }

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
          {/* Add meta tags to help with large content */}
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
          <meta httpEquiv="x-ua-compatible" content="ie=edge" />
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
