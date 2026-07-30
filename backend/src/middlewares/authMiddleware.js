const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const logger = require("../utils/logger");

const authentication = async (req, res, next) => {
  try {
    // Read token from httpOnly cookie first, fall back to Authorization header
    // for backward compatibility during migration
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers["authorization"];
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({ success: false, msg: "Authorization token is required." });
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await userModel.findById(decodedToken.userId);
    if (!user) {
      return res.status(401).json({ success: false, msg: "User not found." });
    }

    req.userId   = decodedToken.userId;
    req.userRole = user.role;
    req.user     = user;

    next();
  } catch (error) {
    logger.error("Auth middleware error:", error.message);
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, msg: "Token expired. Please log in again." });
    }
    return res.status(401).json({ success: false, msg: "Invalid token." });
  }
};

module.exports = authentication;
