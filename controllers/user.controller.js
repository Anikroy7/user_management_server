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
const logger = require("../utils/logger");
const setCorelationId = require("../middlewares/setConRelationId");
const getOrSetCache = require("../cacheServices/getOrSetCache.service");
const deleteCache = require("../cacheServices/deleteCache.service");

exports.getAllUsers = async (req, res) => {
  const corelationId = req.headers["x-co-relation-id"] || '';
  try {
    const { _start, _limit } = req.query;
    const start = parseInt(_start, 10) || 0;
    const limit = parseInt(_limit, 10) || 10;
    const key = `users:_start=${start}&_limit=${limit}`;
    const users = await getOrSetCache(async () => {
      const data = await getAllUsersServices(start, limit);
      return data || [];
    }, key);
    res.status(200).json({
      status: "success",
      data: users,
    });
  } catch (error) {
    logger.error(error.message);
    res.status(400).json({
      status: "error",
      message: error.message,
      corelationId,
    });
  }
};

module.exports.createUser = async (req, res) => {
  const corelationId = req.headers["x-co-relation-id"] || '';
  try {
    if (req.query.adminKey === process.env.ADMIN_KEY) {
      req.body.role = "admin";
    } else {
      req.body.role = "user";
    }
    const result = await createUserServices(req.body, req.file);

    res.status(200).json({
      status: "success",
      message: "user post successfully",
      data: result,
    });
    deleteCache({
      pattern: "users:_start=*",
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
      logger.error(errors);
      return res.status(400).json({
        status: "Failed",
        message: "User validation failed",
        errors: errors,
        corelationId,
      });
    } else {
      logger.error(error.message);
      return res.status(500).json({
        status: "Failed",
        message: "Internal server error",
        error: error.message,
        corelationId,
      });
    }
  }
};

module.exports.loginUser = async (req, res) => {
  const corelationId = req.headers["x-co-relation-id"];
  try {
    const user = await userLoginServices(req.body.email);
    if (user && user.length > 0) {
      const isValidPassword = comparePassword(
        req.body.password,
        user[0].password
      );

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
        logger.info(`Invalid crediantial!!`);
        res.status(403).json({
          status: "failed",
          message: "Authentication failed!",
          corelationId,
        });
      }
    } else {
      logger.info(`Invalid crediantial!!. co-relation-id: ${corelationId}`);
      res.status(403).json({
        status: "failed",
        message: "Authentication failed!",
        corelationId,
      });
    }
  } catch (error) {
    logger.error(error);
    res.status(403).json({
      status: "failed",
      message: "Failed to login",
      error: error.message,
      corelationId,
    });
  }
};

exports.getUserByEmail = async (req, res) => {
  const corelationId = req.headers["x-co-relation-id"];
  try {
    const email = req.params.email;
    console.log("fdf", email);
    const key = `users:${req.params.email}`;
    const user = await getOrSetCache(async () => {
      const data = await getUserByEmailServices(email);
      return data;
    }, key);

    res.status(200).json({
      status: "success",
      data: user,
    });
  } catch (error) {
    logger.error(error);
    res.status(400).json({
      status: "error",
      message: error.message,
      corelationId,
    });
  }
};

module.exports.updateUser = async (req, res) => {
  const corelationId = req.headers["x-co-relation-id"];
  try {
    const { email } = req.params;
    const result = await updateUserServices(email, req.body, req.file);

    res.status(200).json({
      status: "success",
      message: "User updated successfully",
      data: result,
    });

    deleteCache({
      keys: [`users:${req.params.email}`],
      pattern: "users:_start=*",
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
      logger.error(errors);
      return res.status(400).json({
        status: "Failed",
        message: "User validation failed",
        errors: errors,
        corelationId,
      });
    } else {
      logger.error(error.message);
      return res.status(400).json({
        status: "Failed",
        message: "Failed to update user!",
        error: error.message,
        corelationId,
      });
    }
  }
};

exports.deleteUser = async (req, res) => {
  const corelationId = req.headers["x-co-relation-id"];
  try {
    const { email } = req.params;

    const result = await deleteUserServices(email);
    res.status(200).json({
      status: "success",
      message: "User deleted successfully",
      data: result,
    });
    deleteCache({
      keys: [`users:${email}`],
      pattern: "users:_start=*",
    });
  } catch (error) {
    logger.error(error);
    res.status(500).json({
      status: "error",
      message: error.message,
      corelationId,
    });
  }
};
