export const loadEnv = (relativePath: string = "/../.env") => {
  if (process.env.TS_NODE_DEV) {
    require("dotenv").config();
  } else {
    const path = __dirname + relativePath;
    console.log("env path", path);
    const result = require("dotenv").config({
      path,
    });
    if (result.error) {
      throw result.error;
    }
  }
};
