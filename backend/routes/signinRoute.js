const express = require("express");
const router = express.Router();
const UserSchema = require("../models/userModel"); // استيراد نموذج المستخدم
const jwt = require("jsonwebtoken");
// دالة handleError (يمكنك وضعها في ملف منفصل واستيرادها)

const handleError = (
  res,
  error,
  statusCode = 500,
  defaultMessage = "An internal server error occurred."
) => {
  console.error("API Error:", error);
  res.status(statusCode).json({ message: error.message || defaultMessage });
};

router.post("", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "all fields required" });
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "password length must be at least 6 characters long " });
  }
  if (!/^\S+@\S+\.\S+$/.test(email)) {
    return res
      .status(400)
      .json({ message: "please use a valid email address." });
  }

  // تحقق من وجود المستخدم وكلمة المرور

  try {
    const user = await UserSchema.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "this email is not registered" });
    }
    if (!user.password) {
      // هذا الحساب تم تسجيله عبر مصادقة خارجية (جوجل، فيسبوك، إلخ) ولا يحتوي على كلمة مرور محلية.
      return res.status(400).json({
        message: "This account must sign in via a social login provider.",
      });
    }
    // تحقق مما إذا كان المستخدم مسجلاً عبر جوجل لو حبيت امنع اللي مسجل عبر جوجل انه يسجل الدخول العادي
    // if (user.googleId) {
    //   return res
    //     .status(400)
    //     .json({
    //       message:
    //         "This account is registered with Google. Please sign in with your Google account.",
    //     });
    // }
    // تحقق من كلمة المرور
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "incorrect password" });
    }

    //لتخزين بيانات الجلسه حتى لا اضطر لتسجيل الدخول حين الانتقال من صفحه لاخرى
    if (req.session) {
      // Update lastLogin field upon successful login
      user.lastLogin = new Date();
      await user.save().then(() => {
        console.log("User lastLogin updated:", user.lastLogin);
      });

      // 7. إرجاع بيانات المستخدم (بدون كلمة المرور)
      const userResponse = user.toObject({ virtuals: true });
      delete userResponse.password; // Explicitly remove password from the response if it was fetched

      // إنشاء جلسة للمستخدم بعد التحقق الناجح
      req.session.userId = user._id;
      req.session.username = user.fullName;
      console.log("Session object exists:", req.session.userId);
      // Use .toObject({ virtuals: true }) to include any virtual fields like fullName
      // const userResponse = user.toObject({ virtuals: true });
      res.status(200).json({
        message: "Successfully signed in",
        user: userResponse,
      });

      // يمكنك تخزين أي بيانات أخرى تحتاجها في الجلسة
    } else {
      console.error("Session object does not exist.");
    }
  } catch (err) {
    handleError(res, err);
  }
});

module.exports = router;
