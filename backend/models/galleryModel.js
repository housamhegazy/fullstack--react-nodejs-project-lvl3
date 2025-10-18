const mongoose = require("mongoose");

const GalleryChema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "UserSchema", // ربط هذا الحقل بنموذج المستخدم
    },
    public_id:{
      type:String,
      unique: true, // يجب أن يكون فريدًا
    }
  },
  {
    timestamps: true, // لإضافة حقلي createdAt و updatedAt تلقائياً
  }
);

// إنشاء Model من الـ Schema
const ImageModel = mongoose.model("ImageModel", GalleryChema);

module.exports = ImageModel;
