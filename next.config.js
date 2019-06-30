const withCSS = require("@zeit/next-css");
const path = require("path");

module.exports = withCSS({
  cssModules: true,
  useFileSystemPublicRoutes: false,
  webpack(config, options) {
    config.resolve.alias["@src"] = path.join(__dirname, "src");
    return config;
  }
});
