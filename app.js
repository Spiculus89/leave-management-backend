const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const user = require("./routes/user");
const leave = require("./routes/leave");
const admin = require("./routes/admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const { createAdmin } = require("./controllers/auth.controller");

dotenv.config();

let PORT = process.env.DEV_PORT;
let MONGO_URI = process.env.MONGO_URI;

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "*",
  })
);

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

app.use("/user", user);
app.use("/leave", leave);
app.use("/admin", admin);

// Check if admin exists, if not create the admin automatically
createAdmin();

mongoose.set("strictQuery", false);
mongoose.connect(MONGO_URI, () => {
  console.log("Connected to MongoDB");
});
