const expressLogger = require("express-winston");
const logger = require("../utils/logger");
const { format } = require("winston");

const winstonExpressLogger = (level) => {
  return expressLogger.logger({
    level: level,
    winstonInstance: logger,
    format: format.combine(format.colorize(), format.json()),
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}} {res.statusCode}} {{req.method}} {{res.responseTime}}ms",
    expressFormat: true,
    colorize: false,
  });
};

const winstonExpressInfoLogger = winstonExpressLogger("info");
const winstonExpressErrorLogger = winstonExpressLogger("error");

module.exports= {winstonExpressErrorLogger, winstonExpressInfoLogger}

