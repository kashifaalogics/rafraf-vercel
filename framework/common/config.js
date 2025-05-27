const path = require("path");
const fs = require("fs");
const merge = require("deepmerge");

const SUPPORTED_FRAMEWORKS = ["magento"];

module.exports = function withFrameworkConfig(defaultNextConfig) {
  const framework = defaultNextConfig?.framework?.name;

  if (!framework) {
    throw new Error(
      "The framework api is missing in `framework.name`, please add a valid provider"
    );
  }

  if (!SUPPORTED_FRAMEWORKS.includes(framework)) {
    throw new Error(
      `The framework ${framework} is not supported, please choose one of [${SUPPORTED_FRAMEWORKS.join(
        ", "
      )}] or write your own framework api`
    );
  }

  // merge framework next config with default next config
  const frameworkNextConfig = require(path.join(
    process.cwd(),
    "framework",
    framework,
    "next.config"
  ));
  const finalConfig = merge(defaultNextConfig, frameworkNextConfig);

  // modify tsConfig to match the chosen framework
  const tsPath = path.join(process.cwd(), "tsconfig.json");
  const tsConfig = require(tsPath);
  tsConfig.compilerOptions.paths["@framework"] = [`framework/${framework}`];
  tsConfig.compilerOptions.paths["@framework/*"] = [
    `framework/${framework}/*`,
  ];
  // write tsConfig changes
  fs.writeFileSync(
    path.join(process.cwd(), "tsconfig.json"),
    JSON.stringify(tsConfig, null, 2)
  );

  return finalConfig;
};
