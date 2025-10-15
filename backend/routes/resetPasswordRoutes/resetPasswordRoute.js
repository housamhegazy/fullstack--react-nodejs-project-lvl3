// هذه الصفحه خاصه بالمرحله التانيه من الاستعاده اي بعد الضغط على الرابط الموجود بالايميل وتحويلنا الى صفحه الاستعاده فهي تقوم بتحديث كلمة المرور في الداتا بيز 

const express = require('express');
const router = express.Router();
const User = require('../../models/userModel');
const crypto = require('crypto');

const handleError = (res, error, statusCode = 500, defaultMessage = "An internal server error occurred.") => {
    console.error("API Error:", error);
    res.status(statusCode).json({ message: error.message || defaultMessage });
};

// مسار GET: للتحقق من صلاحية الرمز المميز (Token)
router.get('/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() } // تحقق من أن الرمز لم تنته صلاحيته
        });

        if (!user) {
            return res.status(400).json({ message: 'الرمز المميز غير صالح أو منتهي الصلاحية.' });
        }

        res.status(200).json({ message: 'الرمز المميز صالح.' });
    } catch (error) {
        handleError(res, error);
    }
});

// مسار POST: لتحديث كلمة المرور
router.post('/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'الرمز المميز غير صالح أو منتهي الصلاحية.' });
        }

        // تحديث كلمة المرور وحقول الرمز
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save(); // pre('save') middleware سيقوم بتشفير الكلمة الجديدة

        res.status(200).json({ message: 'تمت إعادة تعيين كلمة المرور بنجاح.' });
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;