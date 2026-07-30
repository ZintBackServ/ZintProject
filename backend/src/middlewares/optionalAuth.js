const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

// Unlike authMiddleware, this NEVER blocks the request.
// If a valid token is present, req.user is populated.
// If no token or an invalid token is present, req.user stays undefined
// and the request continues as a guest.
const optionalAuth = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return next();

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }
    if (!token) return next();

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) return next();

    const user = await userModel.findById(decodedToken.userId);
    if (user) {
      req.userId = decodedToken.userId;
      req.userRole = user.role;
      req.user = user;
    }

    next();
  } catch (error) {
    // invalid/expired token — treat as guest rather than failing the request
    next();
  }
};

module.exports = optionalAuth;