
const {transports, format}= require("winston");
const { combine, timestamp, json } = format;
require("winston-daily-rotate-file");

const fileTransport = (level, filename) => {
  return new transports.DailyRotateFile({
    level: level || "http",
    format: combine(timestamp(), json()),
    filename: filename || "logs/info/info.log",
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });
};

const infoFileTransport = fileTransport("info", "logs/info/info.log");
const errorFileTransport = fileTransport("error", "logs/error/error.log");

module.exports = { infoFileTransport, errorFileTransport };
