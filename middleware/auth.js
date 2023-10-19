const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    // Get the token from the request headers
    const token = req.headers.authorization.split(" ")[1];

    // Verify the token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decodedToken.userId;

    // Call the next middleware
    next();
  } catch (err) {
    // If the token is invalid, return an unauthorized error
    return res.status(401).json({ message: "Unauthorized" });
  }
};
