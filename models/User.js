const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["employee", "admin"],
  },
  maxLeaveDays: {
    type: Number,
    required: true,
    default: 20,
  },
});

userSchema.pre("save", function (next) {
  if (this.email.includes("admin")) {
    this.role = "admin";
  } else {
    this.role = "employee";
  }
  next();
});

module.exports = mongoose.model("User", userSchema);
