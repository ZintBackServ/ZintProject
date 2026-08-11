const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userModel = require("../models/userModel");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();

        // 1. Check if user already exists with this Google ID
        let user = await userModel.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // 2. Check if account exists with same email → link Google ID to it
        if (email) {
          user = await userModel.findOne({ email });
          if (user) {
            user.googleId = profile.id;
            user.authProvider = "google";
            if (!user.avatar && profile.photos?.[0]?.value) {
              user.avatar = profile.photos[0].value;
            }
            user.isEmailVerified = true; // Google emails are already verified
            await user.save();
            return done(null, user);
          }
        }

        // 3. Create brand-new Google user
        try {
          user = await userModel.create({
            firstName: profile.name?.givenName || profile.displayName || "Google User",
            lastName: profile.name?.familyName || "",
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value || null,
            authProvider: "google",
            isEmailVerified: true,
            role: "user",
          });
          return done(null, user);
        } catch (createErr) {
          // Fallback if duplicate key error occurs on index
          if (createErr.code === 11000 && email) {
            const existingUser = await userModel.findOne({ email });
            if (existingUser) return done(null, existingUser);
          }
          throw createErr;
        }
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Not using sessions — only serialize/deserialize for passport compatibility
passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await userModel.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;