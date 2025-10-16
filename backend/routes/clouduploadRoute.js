// upload images to local folder with (Multer)
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // اسم السحابة الخاص بك
  api_key: process.CLOUDINARY_API_KEY, // مفتاح API الخاص بك
  api_secret: process.env.CLOUDINARY_API_SECRET, // سر API الخاص بك
  secure: true, // يفضل استخدام HTTPS
});

//=============================== create upload folder =========================

// إعداد التخزين باستخدام multer
// const uploadDirBase = path.join(__dirname, "../uploadcloud"); // المسار الأساسي لفولدر uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     const userId = req.body.userId;
//     const uploadDir = path.join(uploadDirBase, userId); // انشاء فولدر بالاي دي لكل مستخدم
//     // تأكد إن فولدر uploads موجود
//     if (!fs.existsSync(uploadDir)) {
//       fs.mkdirSync(uploadDir);
//     }

//     cb(null, uploadDir); // حفظ الملف في فولدر uploads
//   },
//   filename: function (req, file, cb) {
//     // نسمي الملف باسم فريد مع الامتداد الأصلي
//     const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // انشاء اسم لكل صوره
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });

// const upload = multer({ storage });

//===================================== post images ================================================
router.post("/api/cloudupload/add", async (req, res) => {
  const userId = req.body.userId
  const image = `../uploadcloud/1760552031127-517145831.jpg`;
  await cloudinary.uploader
    .upload(image, {
      folder: "mernstack", // 👈 مجلد خاص بملفات المستخدمين
      public_id: userId,
      upload_preset: "product_preset"
    })
    .then((result) => {
      console.log(req.body);
    });
});

router.get("/api/cloudupload", async (req, res) => {
  res.send("cloudupload");
  // res.json({ message: "✅ تم حذف الصورة بنجاح" });
});

module.exports = router;
