export const loadEnv = (relativePath: string = "/../../.env") => {
  if (process.env.NODE_ENV === "development") {
    require("dotenv").config();
  } else {
    const path = __dirname + relativePath;
    const result = require("dotenv").config({
      path,
    });
    if (result.error) {
      throw result.error;
    }
  }
};
