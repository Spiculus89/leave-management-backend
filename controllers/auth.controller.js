const User = require("../models/User");
const { validationResult } = require("express-validator/check");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { username, email, password } = req.body;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }
    // Check if user with the same email or username already exists
    const userExists = await User.findOne({
      $or: [{ email }, { username }],
    });
    if (userExists) {
      console.log(userExists);
      return res.status(409).json({ message: "User already exists" });
    }
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the user
    const role = email === "admin@waltercode.com" ? "admin" : "employee";
    const user = new User({
      username: username,
      email: email,
      password: hashedPassword,
      role: role,
    });

    console.log(user);

    await user.save();

    // Respond with success
    res.json({ message: "User created successfully" });
  } catch (err) {
    // Forward the error to the next middleware
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const { email, password } = req.body;

    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ errors: errors.array().map((err) => err.msg) });
    }

    // Check if user with the provided email exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if password is correct
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Create JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "8760h",
    });

    // Respond with success and token
    res.json({ token: token, user });
  } catch (err) {
    // Forward the error to the next middleware
    next(err);
  }
};

exports.createAdmin = async () => {
  const adminExists = await User.findOne({ email: "admin@waltercode.com" });
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    const admin = new User({
      email: "admin@waltercode.com",
      password: hashedPassword,
      role: "admin",
      username: "admin",
    });
    await admin.save();
    console.log("Admin created successfully.");
  }
};
