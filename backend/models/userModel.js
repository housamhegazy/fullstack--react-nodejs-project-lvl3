// models/User.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs"); // لتشفير كلمات المرور

const UserSchema = new mongoose.Schema(
  {
    // معلومات الاسم (يمكنك دمجها في 'fullName' إذا كنت تفضل، لكن فصلها أفضل عادةً)
    // حقل جديد لتخزين المعرف الفريد الذي يوفره جوجل
    googleId: {
      type: String,
      required: false, // غير مطلوب للمستخدمين العاديين
      unique: true, // يجب أن يكون فريدًا
      sparse: true, // يسمح بوجود العديد من المستخدمين الذين لا يملكون هذا الحقل
    },
    facebookId: {
      type: String,
      required: false, // غير مطلوب للمستخدمين العاديين
      unique: true, // يجب أن يكون فريدًا
      sparse: true, // يسمح بوجود العديد من المستخدمين الذين لا يملكون هذا الحقل
    },
    
    xId: {
      type: String,
      unique: true,
      sparse: true,
    },
    providers: [{ type: String, enum: ['local', 'google', 'facebook', 'twitter'], default: ['local'] }], // مصفوفة للمزودين,
    avatar: {
      type: String,
    },
    fullName: {
      type: String,
      required: [true, "full name is required."],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true, // يجب أن يكون البريد الإلكتروني فريدًا
      trim: true,
      lowercase: true, // تخزين البريد الإلكتروني بأحرف صغيرة
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address."], // تحقق من صيغة البريد الإلكتروني
    },

    password: {
      type: String,
      // minlength: [6, 'Password must be at least 6 characters long.'], // الحد الأدنى لطول كلمة المرور
      // select: false, // لا يتم إرجاع كلمة المرور في الاستعلامات افتراضيًا لأسباب أمنية
    },
    passwordResetToken: { // خاص باستعادة كلمة المرور
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },

    role: {
      // مثال لدور المستخدم
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    lastLogin: {
      // <--- NEW FIELD: lastLogin
      type: Date,
      default: null, // It will be null until the first successful login
    },
  },
  {
    timestamps: true, // لإضافة حقلي createdAt و updatedAt تلقائياً
  }
);

// Middleware لتشفير كلمة المرور قبل حفظ المستخدم
UserSchema.pre("save", async function (next) {
  // قم بتشفير كلمة المرور فقط إذا تم تعديلها أو كانت جديدة
  if (!this.password || !this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// دالة لمقارنة كلمة المرور المدخلة بكلمة المرور المشفرة
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
