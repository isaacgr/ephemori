const fs = require("fs");

const loadEnv = (path) => {
  const filePath =
    path ||
    (process.env.NODE_ENV === "development"
      ? ".env.development"
      : process.env.NODE_ENV === "test"
      ? ".env.testing"
      : null);
  if (!filePath) {
    console.log("No .env file loaded.");
    return;
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    const environmentVariables = {};
    data.split("\n").map((variable) => {
      const [key, value] = variable.trim().split("=");
      environmentVariables[key] = value;
    });
    Object.keys(environmentVariables || {}).map((key) => {
      if (!process.env[key] && process.env[key] !== environmentVariables[key]) {
        process.env[key] = environmentVariables[key];
      }
    });
  } catch (e) {
    console.log(e);
  }
};

module.exports = loadEnv;
