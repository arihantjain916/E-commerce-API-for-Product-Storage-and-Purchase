const express = require("express");
const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

// MiddleWare
// app.use(express.json());
app.use(morgan("dev"));
// app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// Products Routes
const productsroutes = require("./api/routes/products");
const orderroutes = require("./api/routes/orders");
const userroutes = require("./api/routes/users");

// Database Connection
mongoose.connect(
  "mongodb+srv://arihantjain916:" +
    process.env.MONGO_ATLAS_PW +
    "@cluster0.freil.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
);
mongoose.Promise = global.Promise;

// CORS
// app.use((res, req, next) => {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header(
//     "Access-Control-Allow-Headers",
//     "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//   );
//   if (req.method === "Options") {
//     res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
//     return res.status(200).json({});
//   }
// });

// Routes which should handle request
app.use("/api/products", productsroutes);
app.use("/api/orders", orderroutes);
app.use("/api/user", userroutes);

// Handling Error
app.use((req, res, next) => {
  const error = new Error("Page Not Found");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message,
  });
});

module.exports = app;