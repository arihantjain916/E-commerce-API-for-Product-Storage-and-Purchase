const express = require("express");
const router = express.Router();
const Usercontrollers = require("../controllers/user");

// Register User
router.post("/signup", Usercontrollers.registerUser);

// Login User
router.post("/login", Usercontrollers.loginUser);

// Delete User
router.delete("/:userId", Usercontrollers.deleteUser);

module.exports = router;
