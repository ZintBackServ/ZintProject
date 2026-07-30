const logger = require("../utils/logger");

const authorization = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.userRole)) {
        return res
          .status(403)
          .json({ success: false, msg: "Access Denied! You are not authorized." });
      }
      next();
    } catch (error) {
      logger.error("authorization middleware error:", error);
      return res.status(500).json({ success: false, msg: "Internal Server Error" });
    }
  };
};

module.exports = authorization;
