const jwt = require("jsonwebtoken");
require("dotenv").config();

module.exports = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, `${process.env.JWT_SECRET_KEY}`);
    req.userData = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      error:error,
      message: "Auth Failed",
    });
  }
};
