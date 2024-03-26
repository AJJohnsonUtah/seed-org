var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
require("./mongoDbConnection");
var bodyParser = require("body-parser");

// Configure properties. Get 'em from both of 'em
require("dotenv").config({ path: ["./../.env", "./../.env.local"] });

var authRouter = require("./routes/auth");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var seedDetailsRouter = require("./routes/seedDetails");
var plantingsRouter = require("./routes/plantings");
var ordersRouter = require("./routes/orders");
var { verifyToken } = require("./middleware/verifyToken");
var app = express();

app.use(
  cors({
    origin: process.env.NODE_ENV === "production" ? /flowerboy.app$/ : /(localhost)|(192.168.86.68)/,
    credentials: true,
  })
);
app.use(logger("dev"));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// /auth endpoints don't require authentication
app.use("/auth", authRouter);

// All endpoints after THIS do require auth
app.use(verifyToken);

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/seedDetails", seedDetailsRouter);
app.use("/plantings", plantingsRouter);
app.use("/orders", ordersRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.status(err.status || 500).body(err);
  // res.render("error");
});

module.exports = app;
