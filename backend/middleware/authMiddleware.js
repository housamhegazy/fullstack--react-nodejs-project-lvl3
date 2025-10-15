// تعمل لحماية المسارات التي تتطلب مصادقة المستخدم وايضا جلب بيانات المستخدم
const User = require("../models/userModel");

async function isAuthenticated(req, res, next) {
  // (req.user || req.session.userId) للتحقق اذا كان المستخدم مسجل الدخول بجوجل او بالطريقه العاديه المعتمده على السيشن
  if (req.user || req.session.userId) {
    try {
      // جلب المستخدم من قاعدة البيانات
      // استخدم .select('-password') لعدم إرسال كلمة المرور المشفرة
      const userId = req.isAuthenticated() ? req.user._id : req.session.userId;
      const user = await User.findById(userId).select("-password");
      if (!user) {
        // المستخدم لم يعد موجودًا في DB (ربما تم حذفه)
        req.session.destroy(() => {
          // تدمير الجلسة الحالية
          return res
            .status(401)
            .json({ message: "غير مصرح به: المستخدم غير موجود أو تم حذفه." });
        });
        return; 
      }
      req.user = user;
      next(); // المستخدم مسجل دخول ووجد، استمر في معالجة الطلب
    } catch (error) {
      console.error("Error fetching user in authMiddleware:", error);
      // قد يكون خطأ في الاتصال بالـ DB أو ID خاطئ
      return res
        .status(500)
        .json({ message: "حدث خطأ داخلي في الخادم أثناء المصادقة." });
    }
  } else {
    // المستخدم غير مسجل دخول
    return res
      .status(401)
      .json({ message: "غير مصرح به: الرجاء تسجيل الدخول أولا." });
  }
}

module.exports = isAuthenticated;
