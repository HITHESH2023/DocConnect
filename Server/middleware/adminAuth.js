const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Import User model to potentially fetch user details if needed

module.exports = async function (req, res, next) {
  // Get token from header
  const token = req.header("Authorization");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);

    // Attach user from token to request
    req.user = decoded;

    // Check if user is admin
    if (req.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied. Admin privileges required." });
    }

    next(); // Proceed to the next middleware/route handler
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};
