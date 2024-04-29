const verifyAdmin = (req, res, next) => {
  //  if user is an admin
  if (req.user.email && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({
      status: "error",
      message:
        "Unauthorized: Only admin users are allowed to access this resource.",
    });
  }
};

module.exports = verifyAdmin;
