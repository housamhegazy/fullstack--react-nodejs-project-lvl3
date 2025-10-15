const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const nodemailer = require("nodemailer");
const crypto = require("crypto");

const handleError = (
  res,
  error,
  statusCode = 500,
  defaultMessage = "An internal server error occurred."
) => {
  console.error("API Error:", error);
  res.status(statusCode).json({ message: error.message || defaultMessage });
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_APP_PASSWORD,
  },
});

router.post("/", async (req, res) => {
  const { email } = req.body;
  let user; // <--- التصحيح 1: تعريف المتغير هنا ليكون متاحاً في كل مكان

  if (!email) {
    return res.status(400).json({ message: "البريد الإلكتروني مطلوب." });
  }

  try {
    user = await User.findOne({ email }); // <--- تعيين القيمة للمتغير

    if (!user) {
      return res.status(200).json({
        message:
          "إذا كان البريد مسجلاً، فسيتم إرسال رابط إعادة تعيين كلمة المرور.",
      });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    user.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    user.passwordResetExpires = Date.now() + 3600000;
    await user.save();

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    const mailOptions = {
      to: user.email,
      from: process.env.EMAIL_USER,
      subject: "إعادة تعيين كلمة المرور",
      html: `
    <p>مرحباً ${user.fullName},</p>
    <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور لحسابك. الرجاء النقر على الرابط أدناه لإعادة تعيين كلمة المرور:</p>
    <p><a href="${resetUrl}">${resetUrl}</a></p>
    <p>هذا الرابط صالح لمدة ساعة واحدة فقط.</p>
    <p>إذا لم تطلب أنت إعادة تعيين كلمة المرور، يرجى تجاهل هذه الرسالة.</p>
`,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.",
    });
  } catch (error) {
    console.error("Error sending password reset email:", error); // التصحيح 2: التحقق من أن 'user' موجود قبل محاولة التعديل // هذا يمنع خطأ ReferenceError إذا كان الرمز قد تم توليده بنجاح
    if (user) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save();
    }
    handleError(
      res,
      error,
      500,
      "فشل إرسال البريد الإلكتروني لإعادة تعيين كلمة المرور."
    );
  }
});

module.exports = router;
