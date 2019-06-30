import Document, { Head, Main, NextScript } from "next/document";

export default class IntlDocument extends Document {
  static async getInitialProps(context) {
    const props = await super.getInitialProps(context);

    const {
      req: { locale, localeDataScript }
    } = context;

    return { ...props, locale, localeDataScript };
  }

  render() {
    // Polyfill Intl API for older browsers
    const polyfill = `https://cdn.polyfill.io/v2/polyfill.min.js?features=Intl.~locale.${
      this.props.locale
    }`;

    return (
      <html>
        <Head />
        <body>
          <Main />
          <script src={polyfill} />
          <script
            dangerouslySetInnerHTML={{ __html: this.props.localeDataScript }}
          />
          <NextScript />
        </body>
      </html>
    );
  }
}
