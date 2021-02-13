let appEnvRuntime = "";
const path = require("path");
if (
  !Object.keys(process.env).includes("NODE_APP_ENV") ||
  !process.env["NODE_APP_ENV"] ||
  process.env["NODE_APP_ENV"] === "moonmoon" ||
  process.env["NODE_APP_ENV"] === "production"
) {
  appEnvRuntime = "moon";
  console.info("loading default env...");
  require("dotenv").config();
}

if (
  Object.keys(process.env).includes("NODE_APP_ENV") &&
  process.env["NODE_APP_ENV"] === "local"
) {
  appEnvRuntime = "local";
  console.info("loading " + process.env["NODE_APP_ENV"] + " env...");
  require("dotenv").config({ path: path.resolve(".env.local") });
}

if (
  Object.keys(process.env).includes("NODE_APP_ENV") &&
  process.env["NODE_APP_ENV"] === "replit"
) {
  require("dotenv").config({ path: path.resolve(".env.replit") });
  appEnvRuntime = `replit:${process.env["CHANNEL"]}`;
  console.info("loading " + appEnvRuntime + " env...");
}

module.exports = {
  ...process.env,
  appEnvRuntime,
  NODE_EVAL_ENABLED:
    Object.keys(process.env).includes("NODE_EVAL_ENABLED") &&
    Boolean(process.env.NODE_EVAL_ENABLED),
};
