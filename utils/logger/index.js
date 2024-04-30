const { createLogger } = require("winston");
const { infoFileTransport, errorFileTransport } = require("./transport");


const logger = createLogger({
  transports: [infoFileTransport, errorFileTransport],
});

module.exports = logger;
