const path = require("path");
const fs = require("fs");
const merge = require("deepmerge");

const SUPPORTED_FRAMEWORKS = ["magento"];

function withFrameworkConfig(framework, defaultNextConfig) {
  if (!framework) {
    throw new Error(
      "The framework name is missing. Please pass a valid provider name as the first argument."
    );
  }

  if (!SUPPORTED_FRAMEWORKS.includes(framework)) {
    throw new Error(
      `The framework "${framework}" is not supported. Supported frameworks: [${SUPPORTED_FRAMEWORKS.join(", ")}]`
    );
  }

  // merge framework next config with default config
  const frameworkNextConfig = require(path.join(
    process.cwd(),
    "framework",
    framework,
    "next.config"
  ));
  const finalConfig = merge(defaultNextConfig, frameworkNextConfig);

  // update tsconfig.json paths
  const tsPath = path.join(process.cwd(), "tsconfig.json");
  const tsConfig = require(tsPath);
  tsConfig.compilerOptions.paths["@framework"] = [`framework/${framework}`];
  tsConfig.compilerOptions.paths["@framework/*"] = [`framework/${framework}/*`];
  fs.writeFileSync(tsPath, JSON.stringify(tsConfig, null, 2));

  return finalConfig;
}

module.exports = { withFrameworkConfig };
