const authorization = (...roles) => {
  return (req, res, next) => {
    try {
      if (!roles.includes(req.userRole)) {
        return res
          .status(403)
          .json({ msg: "Access Denied !!! You are Not Authorized" });
      }
      next();
    } catch (error) {
      console.log(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  };
};

module.exports = authorization;
