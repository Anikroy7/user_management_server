const logger = require("../utils/logger");

const verifyAdmin = (req, res, next) => {
  const corelationId = req.headers["x-co-relation-id"];
  //  if user is an admin
  if (req.user.email && req.user.role === "admin") {
    next();
  } else {
    logger.info("Unauthorized user want to access admin rousources.");
    res.status(401).json({
      status: "error",
      message:
        "Unauthorized: Only admin users are allowed to access this resource.",
      corelationId,
    });
  }
};

module.exports = verifyAdmin;
