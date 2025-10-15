//خاصه بتسجيل الدخول عن طريق جوجل
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy; // <--- إضافة هذا السطر
const TwitterStrategy = require("passport-twitter").Strategy;

const User = require("../models/userModel");
//نستدعي الملف اللي هانرفع بيه الصور للكلاود
const uploadAvatarToCloudinary = require("../utils/uploadAvatarToCloudinary.js");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        let user =
          (await User.findOne({ googleId: profile.id })) ||
          (profile.emails?.length
            ? await User.findOne({ email: profile.emails[0].value })
            : null);

        // الحصول على الصورة بأعلى جودة ممكنة
        const rawAvatar = profile.photos?.[0]?.value
          ? profile.photos[0].value.replace(/=s\d+-c$/, "=s800-c")
          : "";

        // رفعها على Cloudinary
        const avatarUrl = rawAvatar
          ? await uploadAvatarToCloudinary(rawAvatar, `google_${profile.id}`)
          : "";

        if (user) {
          user.googleId = profile.id;
          if (avatarUrl) user.avatar = avatarUrl;
        } else {
          user = await User.create({
            googleId: profile.id,
            fullName: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            avatar: avatarUrl,
            providers: ["google"],
          });
        }

        if (!user.providers.includes("google")) user.providers.push("google");
        user.lastLogin = new Date();
        await user.save();

        return cb(null, user);
      } catch (error) {
        console.error("Error in Google Strategy:", error);
        return cb(error, null);
      }
    }
  )
);
//======================================================================================================================
//======================================================================================================================
//======================================================================================================================

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "displayName", "photos", "email"],
    },
    async (accessToken, refreshToken, profile, cb) => {
      try {
        // ✅ نجيب الصورة الأصلية الكبيرة من Graph API
      const fetch = (await import("node-fetch")).default;
const fbPhotoUrl = `https://graph.facebook.com/${profile.id}/picture?type=large&redirect=false&access_token=${accessToken}`;
const fbResponse = await fetch(fbPhotoUrl);
const fbData = await fbResponse.json();
const highResUrl = fbData?.data?.url;


        // ✅ نرفع الصورة دي على Cloudinary (بدون streamifier)
        const uploadedUrl = await uploadAvatarToCloudinary(
          highResUrl,
          `fb_${profile.id}`
        );

        let user = await User.findOne({ facebookId: profile.id });

        if (!user) {
          if (profile.emails && profile.emails.length > 0) {
            user = await User.findOne({ email: profile.emails[0].value });
          }

          if (user) {
            user.facebookId = profile.id;
            user.avatar = uploadedUrl;
          } else {
            user = await User.create({
              facebookId: profile.id,
              fullName: profile.displayName,
              email: profile.emails?.[0]?.value,
              avatar: uploadedUrl,
              providers: ["facebook"],
            });
          }
        }

        if (!user.providers.includes("facebook")) user.providers.push("facebook");
        user.lastLogin = new Date();
        await user.save();

        return cb(null, user);
      } catch (error) {
        console.error("Error in Facebook Strategy:", error);
        return cb(error, null);
      }
    }
  )
);
//======================================================================================================================
//======================================================================================================================
//======================================================================================================================
// استراتيجية منصة X (تويتر)
passport.use(
  new TwitterStrategy(
    {
      consumerKey: process.env.X_CONSUMER_KEY,
      consumerSecret: process.env.X_CONSUMER_SECRET,
      callbackURL: "/auth/x/callback",
      userProfileURL:
        "https://api.x.com/1.1/account/verify_credentials.json?include_email=true",
    },
    async (token, tokenSecret, profile, cb) => {
      try {
        let user =
          (await User.findOne({ xId: profile.id })) ||
          (profile.emails?.length
            ? await User.findOne({ email: profile.emails[0].value })
            : null);

        // إزالة _normal للحصول على الصورة الكاملة
        const rawAvatar = profile.photos?.[0]?.value
          ? profile.photos[0].value.replace("_normal", "")
          : "";

        const avatarUrl = rawAvatar
          ? await uploadAvatarToCloudinary(rawAvatar, `twitter_${profile.id}`)
          : "";

        if (user) {
          user.xId = profile.id;
          if (avatarUrl) user.avatar = avatarUrl;
        } else {
          user = await User.create({
            xId: profile.id,
            fullName: profile.displayName,
            email: profile.emails?.[0]?.value || "",
            avatar: avatarUrl,
            providers: ["twitter"],
          });
        }

        if (!user.providers.includes("twitter")) user.providers.push("twitter");
        user.lastLogin = new Date();
        await user.save();

        return cb(null, user);
      } catch (error) {
        console.error("Error in Twitter Strategy:", error);
        return cb(error, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});
