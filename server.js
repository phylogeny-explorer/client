const express = require("express");
const next = require("next");
const path = require("path");
const glob = require("glob");
const accepts = require("accepts");
const fs = require("fs");
const morgan = require("morgan");
const helmet = require("helmet");

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Get the supported languages by looking for translations in the `lang/` dir.
const supportedLanguages = glob
  .sync("./lang/*.json")
  .map(f => path.basename(f));

// We need to expose React Intl's locale data on the request for the user's
// locale. This function will also cache the scripts by lang in memory.
const localeDataCache = new Map();
const getLocaleDataScript = locale => {
  const lang = locale.split("-")[0];
  if (!localeDataCache.has(lang)) {
    const localeDataFile = require.resolve(`react-intl/locale-data/${lang}`);
    const localeDataScript = fs.readFileSync(localeDataFile, "utf8");
    localeDataCache.set(lang, localeDataScript);
  }
  return localeDataCache.get(lang);
};

// We need to load and expose the translations on the request for the user's
// locale. These will only be used in production, in dev the `defaultMessage` in
// each message description in the source code will be used.
const getMessages = locale => {
  return require(`./lang/${locale}.json`);
};

app.prepare().then(() => {
  const server = express();

  server.use(helmet());
  server.use(morgan("combined", {}));

  server.use((req, res, next) => {
    const accept = accepts(req);
    const locale =
      accept.language(accept.languages(supportedLanguages))[0] || "en";
    req.locale = locale;
    req.localeDataScript = getLocaleDataScript(locale);
    req.messages = dev ? {} : getMessages(locale);
    next();
  });

  server.get("/", (req, res) => {
    return app.render(req, res, "/home", req.query);
  });

  server.get("/pages/:pageId", (req, res) => {
    return app.render(req, res, "/pages", {
      pageId: req.params.page_id,
      ...req.query
    });
  });

  server.get("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, err => {
    if (err) throw err;
    console.log(`> Ready on http://localhost:${port}`);
  });
});
