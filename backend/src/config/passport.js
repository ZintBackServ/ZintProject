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
        const email = profile.emails[0].value;

        // Check if user already exists with this Google ID
        let user = await userModel.findOne({ googleId: profile.id });

        if (user) {
          return done(null, user);
        }

        // Check if a local account exists with same email → link it
        user = await userModel.findOne({ email });

        if (user) {
          // Link Google to existing local account
          user.googleId = profile.id;
          user.authProvider = "google";
          user.avatar = profile.photos?.[0]?.value || null;
          user.isEmailVerified = true; // Google emails are already verified
          await user.save();
          return done(null, user);
        }

        // Create brand-new Google user
        user = await userModel.create({
          firstName: profile.name.givenName || profile.displayName,
          lastName: profile.name.familyName || "",
          email,
          googleId: profile.id,
          avatar: profile.photos?.[0]?.value || null,
          authProvider: "google",
          isEmailVerified: true,
          role: "user",
          // contactNo and password intentionally left empty for Google users
        });

        return done(null, user);
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