const { check } = require("express-validator/check");

exports.validateUserSignUp = [
  check("username", "Please enter a valid Username!").not().isEmpty(),
  check("email", "Please enter a valid email!").isEmail(),
  check("email", "Only WalterCode emails are allowed!").contains(
    "waltercode.com"
  ),
  check("password", "Please enter a valid password!").isLength({
    min: 6,
  }),
];

exports.validateUserSignIn = [
  check("email", "Please enter a valid email!").isEmail(),
  check("password", "Please enter a valid password!").isLength({
    min: 6,
  }),
];
