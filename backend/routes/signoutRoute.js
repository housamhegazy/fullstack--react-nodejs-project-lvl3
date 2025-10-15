// routes/authRoutes.js (أو signinRoute.js، حسب تنظيمك)
const express = require('express');
const router = express.Router();
const isAuthenticated = require('../middleware/authMiddleware'); // إذا كنت ترغب في حماية مسار تسجيل الخروج (اختياري)

// مسار تسجيل الخروج
router.post('', (req, res) => {
    // تحقق مما إذا كانت هناك جلسة للمستخدم
    if (req.session) {
        // تدمير الجلسة الحالية
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).json({ message: "فشل تسجيل الخروج: حدث خطأ في الخادم." });
            }
            // إزالة ملف تعريف الارتباط (cookie) من المتصفح لضمان تسجيل الخروج الكامل
            res.clearCookie('connect.sid', { path: '/' }); // تأكد من اسم الكوكي (عادة connect.sid) والـ path
            // يمكنك إضافة خيارات أخرى للكوكي هنا إذا كانت محددة في إعدادات الجلسة، مثل `domain`, `secure`, `sameSite`

            return res.status(200).json({ message: "تم تسجيل الخروج بنجاح." });
        });
    } else {
        // لا توجد جلسة نشطة
        return res.status(200).json({ message: "لا توجد جلسة نشطة لتسجيل الخروج منها." });
    }
});

module.exports = router;