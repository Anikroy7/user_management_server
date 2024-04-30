const express = require("express");
const app = express();
const cors = require("cors");
const logger = require("./utils/logger");

const userRouter = require("./routes/user.route");

//Winston Express Logger
const {
  winstonExpressInfoLogger,
  winstonExpressErrorLogger,
} = require("./middlewares/wintonExpressLogger");
const conrelationId = require("./middlewares/setConRelationId");

// middleware
app.use(express.json());
app.use(cors());
app.use(conrelationId);



//routes

app.use(winstonExpressInfoLogger);
app.use("/api/v1/user", userRouter);
app.use(winstonExpressErrorLogger);

app.get("/", (req, res, next) => {
  try {
    throw new Error("My custom error");
  } catch (error) {
    next(error);
  }
});

//Global Middleware
app.use((err, req, res, next) => {
  const errorObj = {
    message: err?.message || "Something went wrong",
    corelationId: req.headers['x-co-relation-id'],
    status: err?.status || 500,
  };
  logger.error(errorObj)
  res.status(errorObj.status).json(errorObj);
});

module.exports = app;
