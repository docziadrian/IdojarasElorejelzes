const config = {
  development: {
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN || "http://127.0.0.1:5500/",
    logLevel: process.env.LOG_LEVEL || "debug",
    enableHelmet: false,
    enableCompression: false,
  },
  production: {
    port: process.env.PORT || 3000,
    corsOrigin: process.env.CORS_ORIGIN || "*",
    logLevel: process.env.LOG_LEVEL || "error",
    enableHelmet: true,
    enableCompression: true,
  },
};

const environment = process.env.NODE_ENV || "development";

module.exports = {
  ...config[environment],
  environment,
};
