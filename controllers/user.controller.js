const {
  createUserServices,
  userLoginServices,
  updateUserServices,
  deleteUserServices,
  getUserByEmailServices,
  getAllUsersServices,
} = require("../services/user.service");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const fs = require("fs");
const { comparePassword } = require("../utils/helpers");

exports.getAllUsers = async (req, res) => {
  try {

    const users = await getAllUsersServices();
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


module.exports.createUser = async (req, res) => {
  try {
    // console.log(req.file);
    // console.log(req.body);
    const result = await createUserServices(req.body, req.file);

    res.status(200).json({
      status: "success",
      message: "user post successfully",
      data: result,
    });
  } catch (error) {
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        status: "Failed",
        message: "User validation failed",
        errors: errors,
      });
    } else {
      return res.status(500).json({
        status: "Failed",
        message: "Internal server error",
        error: error.message,
      });
    }
  }
};

module.exports.loginUser = async (req, res) => {
  // res.send("hitted");

  try {
    const user = await userLoginServices(req.body.email);
    if (user && user.length > 0) {
      const isValidPassword = comparePassword(req.body.password, user[0].password)

      if (isValidPassword) {
        // IF Valid Password
        const token = jwt.sign(
          {
            email: user[0].email,
            role: user[0].role,
          },
          process.env.ACCESS_TOKEN,
          {
            expiresIn: "1h",
          }
        );
        res.status(200).json({
          status: "success",
          message: "Loing successfull",
          token,
          data: user,
        });
      } else {
        res.status(403).json({
          status: "failed",
          message: "Authentication failed!",
        });
      }
    } else {
      res.status(403).json({
        status: "failed",
        message: "Authentication failed!",
      });
    }
  } catch (error) {
    res.status(403).json({
      status: "failed",
      message: "Failed to login",
      error: error.message,
    });
  }
};

exports.getUserByEmail = async (req, res) => {
  try {
    const email  = req.params.email;
    const user = await getUserByEmailServices(email);
    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};


module.exports.updateUser = async (req, res) => {
  try {
    const { email } = req.params;
    const result = await updateUserServices(email, req.body, req.file);

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: result,
    });
  } catch (error) {
    // Delete uploaded file if an error occurs and it exists
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error("Error deleting file:", err);
        }
      });
    }
    // Handle different types of errors
    if (error.name === "ValidationError") {
      const errors = {};
      for (let field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return res.status(400).json({
        status: "Failed",
        message: "User validation failed",
        errors: errors,
      });
    } else {
      return res.status(400).json({
        status: "Failed",
        message: "Failed to update user!",
        error: error.message,
      });
    }
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { email } = req.params;

    const result = await deleteUserServices(email);
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
};

