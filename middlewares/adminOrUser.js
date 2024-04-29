const adminOrUser = (req, res, next) => {
  const isAdmin = req.user.role === "admin";
  const isUser = req.params.email === req.user.email;
console.log('current ', req.user.email, req.params.email);
  // Check if user is admin or updating their own information
  if (!isAdmin && !isUser) {
    return res.status(401).json({
      status: "error",
      message:
        "Unauthorized: You are not allowed to update this user's information.",
    });
  } else {
    next();
  }
};

module.exports= adminOrUser;