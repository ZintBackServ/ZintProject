const express = require("express");
const router = express.Router();
const passport = require("../config/passport");

const {
  signUpUser,
  loginUser,
  verifyOTP,
  resendOTP,
  googleAuthCallback,
  getAllUser,
  getUserById,
  getUsersByIDs,
  UpdateUser,
  deleteUser,
} = require("../controllers/userController");

const authentication = require("../middlewares/authMiddleware");
const authorization = require("../middlewares/authorization");

// Public Routes 
router.post("/newUser", signUpUser);          // Register → sends OTP email
router.post("/login", loginUser);             // Local login

//  OTP Routes 
router.post("/verify-otp", verifyOTP);        // Verify OTP → returns JWT
router.post("/resend-otp", resendOTP);        // Resend OTP to email

//  Google OAuth Routes 
// Step 1: Redirect user to Google login page
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

// Step 2: Google redirects back here after login
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`,
    session: false,
  }),
  googleAuthCallback
);

//  Protected Routes 
router.get("/allUsers",       authentication, authorization("admin"), getAllUser);
router.get("/getUserById/:id",authentication, authorization("admin"), getUserById);
router.get("/getUsersByIDs",  authentication, authorization("admin"), getUsersByIDs);
router.put("/UpdateUser/:id", authentication, UpdateUser);

// Delete Routes 
router.delete("/deleteUser/:id", authentication, authorization("admin"), deleteUser);
router.delete("/user/:userId",   authentication, authorization("admin"), deleteUser);

module.exports = router;