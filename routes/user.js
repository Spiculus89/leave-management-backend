const express = require("express");
const { register, login } = require("../controllers/auth.controller.js");
const {
  validateUserSignUp,
  validateUserSignIn,
} = require("../userValidator.js");

const router = express.Router();

// Register route
router.route("/register").post(validateUserSignUp, register);

// Login route
router.route("/login").post(validateUserSignIn, login);

module.exports = router;
