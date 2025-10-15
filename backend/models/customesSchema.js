const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true, // إزالة المسافات البيضاء من البداية والنهاية
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // للتأكد من عدم تكرار البريد الإلكتروني
      trim: true,
      lowercase: true, // تخزين البريد الإلكتروني بحروف صغيرة
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ], // تحقق من صيغة البريد الإلكتروني
    },
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
      min: 18, // العمر الأدنى
      max: 120, // العمر الأقصى
    },
    country: {
      type: String,
      required: true,
      trim: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"], // تحديد القيم المسموح بها
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserSchema", // ربط هذا الحقل بنموذج المستخدم
    },
    
  },
  {
    timestamps: true, // لإضافة حقلي createdAt و updatedAt تلقائياً
  }
);

// إنشاء Model من الـ Schema
const CustomerModel = mongoose.model("CustomerModel", customerSchema);

module.exports = CustomerModel;
