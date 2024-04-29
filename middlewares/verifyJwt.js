const jwt = require("jsonwebtoken");

const verifyJwt = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
    const { email, role } = decoded;
    console.log(email, role);
    const user= {email, role}
    req.user= user
    next();
  } catch (error) {
    console.log(error);
    next({
      message: "Forbidden Accesssf",
      status: "401",
    });
  }
};

module.exports = verifyJwt;
