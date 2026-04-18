const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

const authentication = async (req, res, next) => {
  try {
    let token = req.headers["authorization"];

    if (!token) {
      return res.status(401).json({ msg: "Authorization Token is Required" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!decodedToken) {
      return res.status(401).json({ msg: "Invalid Token" });
    }

    const user = await userModel.findById(decodedToken.userId);

    if(!user){
        return res.status(401).json({msg:"user not found"});
    }

    req.userId = decodedToken.userId;
    req.userRole = user.role;

    next();
  } catch (error) {
    console.log(error);
    return res.status(403).json({ msg: "Token Expired" });
  }
};

module.exports = authentication;
