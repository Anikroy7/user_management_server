const jwt = require("jsonwebtoken");
const logger = require("../utils/logger");

const verifyJwt = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const { email, role } = decoded;

    const user= {email, role}
    req.user= user
    next();
  } catch (error) {
    logger.error(error);
    next({
      message: "Forbidden Accesss",
      status: "401",
    });
  }
};

module.exports = verifyJwt;
