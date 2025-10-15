const express = require("express");
const router = express.Router();
const UserSchema = require("../models/userModel"); // استيراد نموذج المستخدم

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
  const { fullName, email, password, confirmPassword } = req.body;

  // التحقق من الواجهة الخلفية (مهم جداً حتى لو تم التحقق في الواجهة الأمامية)

  if (!fullName || !email || !password || !confirmPassword) {
    return res.status(400).json({ message: "all fields required" });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "passwords do not match" });
  }

  if (password.length < 6) {
    // تحقق بسيط لطول كلمة المرور
    return res
      .status(400)
      .json({ message: "password length must be at least 6 characters long " });
  }
  // يمكنك إضافة تحققات أخرى مثل تعقيد كلمة المرور وصيغة الإيميل هنا

  try {
    const existingUser = await UserSchema.findOne({ email });
    if (existingUser) {
      return res
        .status(409) // 409 Conflict هو رمز حالة HTTP المناسب لتكرار مورد
        .json({ message: "this email already registered!" });
    }

    const newUser = new UserSchema({ fullName, email, password ,providers: ["local"],});
    await newUser.save();
    //لتخزين بيانات الجلسه حتى لا اضطر لتسجيل الدخول حين الانتقال من صفحه لاخرى
    if (req.session) {
      // التحقق من وجود req.session (للتأكد فقط)
      req.session.userId = newUser._id;
      req.session.username = newUser.fullName;
      // يمكنك تخزين أي بيانات أخرى تحتاجها في الجلسة
    }

    res.status(201).json({ message: "successfully registered", user: newUser._id }); // 201 Created
  } catch (err) {
    console.error("Registration error:", err);
    if (err.code === 11000) {
      // Duplicate key error (للتأكد من unique email)

      return res
        .status(409)
        .json({ message: "Duplicated Email !" });
    }
     // إذا كان الخطأ هو خطأ تحقق من الموديل (مثل عدم تطابق كلمة المرور، إذا تم إعداده في الموديل)
    if (err.name === 'ValidationError') {
        return res.status(400).json({ message: err.message });
    }
    // استخدام دالة handleError الموحدة
    handleError(res, err, 400, "Error happen while register!!");
  }
});

module.exports = router;
