const withFrameworkConfig = require("./framework/common/config");
const nextTranslate = require("next-translate");

const defaultNextConfig = {
  framework: {
    name: process.env.NEXT_PUBLIC_FRAMEWORK,
  },
  i18n: {
    locales: ["ar", "en"],
    defaultLocale: "ar",
    localeDetection: false
  },
  webpackDevMiddleware: (config) => {
    // Solve compiling problem via vagrant
    config.watchOptions = {
      poll: 1000,   // Check for changes every second
      aggregateTimeout: 300,   // delay before rebuilding
    };
    return config;
  }
};

module.exports = nextTranslate(withFrameworkConfig(defaultNextConfig));
