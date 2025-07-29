import config from "../config";
import passport from "passport";
import {
  Profile as GoogleProfile,
  Strategy as GoogleStrategy,
  VerifyCallback as GoogleCallback,
} from "passport-google-oauth20";
import { User } from "../modules/user/user.model";
import { USER_AUTH_PROVIDER, USER_ROLE } from "../modules/user/user.constant";
import { Strategy as FacebookStrategy, Profile as FacebookProfile } from "passport-facebook";

// Google OAuth Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL: config.GOOGLE_CALLBACK_URL,
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: GoogleProfile,
      cb: GoogleCallback
    ) => {
      try {
        // console.log("Google Profile:", profile);
        const email = profile.emails?.[0]?.value;
        if (!email) return cb(null, false, { message: "No email found in Google profile" });

        let user = await User.findOne({ email }).lean();
        if (!user)
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            role: USER_ROLE.USER,
            isVerified: profile.emails?.[0]?.verified || false,
            auths: [{ provider: USER_AUTH_PROVIDER.GOOGLE, providerId: profile.id }],
          });

        return cb(null, user);
      } catch (error) {
        // console.log("Google Strategy Error:", error);
        return cb(error);
      }
    }
  )
);

// Facebook OAuth Strategy
passport.use(
  new FacebookStrategy(
    {
      clientID: config.FACEBOOK_APP_ID,
      clientSecret: config.FACEBOOK_APP_SECRET,
      callbackURL: config.FACEBOOK_CALLBACK_URL,
      profileFields: ["displayName", "emails", "photos"],
    },
    async (_accessToken: string, _refreshToken: string, profile: FacebookProfile, cb) => {
      try {
        // console.log("Facebook Profile:", profile);
        const email = profile.emails?.[0]?.value;
        if (!email) return cb(null, false, { message: "No email found in Google profile" });

        let user = await User.findOne({ email }).lean();
        if (!user)
          user = await User.create({
            email,
            name: profile.displayName,
            picture: profile.photos?.[0]?.value,
            role: USER_ROLE.USER,
            isVerified: true,
            auths: [{ provider: USER_AUTH_PROVIDER.FACEBOOK, providerId: profile.id }],
          });

        return cb(null, user);
      } catch (error) {
        // console.log("Facebook Strategy Error:", error);
        return cb(error);
      }
    }
  )
);

// Serialize and deserialize user for session management
// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, cb: (err: any, id?: unknown) => void): void => {
  cb(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, cb: (err: any, user?: any) => void): Promise<void> => {
  try {
    const user = await User.findById(id).select("-password").lean();
    cb(null, user);
  } catch (error) {
    cb(error);
  }
});
