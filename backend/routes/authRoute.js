
// خاص بتسجيل الدخول عن طريق جوجل 
const express = require('express');
const passport = require('passport');
const router = express.Router();

//google
//step-1
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
); // بدء المصادقة
router.get(
  "/auth/google/callback",
passport.authenticate('google', { failureRedirect: '/signin' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

//facebook

// مسارات فيسبوك (الجديدة)
router.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ['email'] }) // طلب الإذن بالوصول إلى البريد الإلكتروني
);
router.get(
  "/auth/facebook/callback",
  passport.authenticate('facebook', { failureRedirect: '/signin' }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/`);
  }
);

//مسارات تويتر 

router.get("/auth/x", passport.authenticate("twitter")); // تم تغيير المسار إلى x
router.get("/auth/x/callback", passport.authenticate('twitter', { failureRedirect: '/signin' }),
    (req, res) => {
        res.redirect(`${process.env.FRONTEND_URL}/`);
    }
);
module.exports = router;