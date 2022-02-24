const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

exports.registerUser = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  User.find({
    email: email,
  })
    .exec()
    .then((user) => {
      if (user.length >= 1) {
        return res.status(409).json({
          Message: "Email is already exist",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err,
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              name: req.body.name,
              email: req.body.email,
              phonenumber: req.body.phonenumber,
              password: hash,
            });
            user
              .save()
              .then((result) => {
                res.status(201).json({
                  Message: "User Created Successfully",
                });
              })
              .catch((err) => {
                res.status(500).json({
                  error: err,
                });
              });
          }
        });
      }
    });
};

exports.loginUser = (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  User.find({ email: email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message:
            "Auth failed!! either the account does't exist or you entered a wrong account",
        });
      }
      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth Fail!!",
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userid: user[0]._id,
            },
            `${process.env.JWT_SECRET_KEY}`,
            {
              expiresIn: "1h",
            }
          );
          return res.status(200).json({
            message: "Auth Successful",
            token: token,
          });
        }
        return res.status(200).json({
          message: "Auth Failed",
        });
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};

exports.deleteUser = (req, res) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then((result) => {
      res.status(200).json({
        Message: "User Deleted Successfully",
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: err,
      });
    });
};
