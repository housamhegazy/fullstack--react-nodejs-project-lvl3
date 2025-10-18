const express = require("express");
const streamifier = require("streamifier"); // سنحتاج هذه المكتبة لتحويل البفر إلى ستريم
const router = express.Router();
const multer = require("multer");
require("dotenv").config();
const cloudinary = require("cloudinary").v2;
//======================  استيراد نموذج قاعدة البيانات) ========================
// const Image = require("../models/ImageModel"); // *يجب استبدال هذا بالمسار الصحيح لنموذجك*
//====================== cloudinary config ================================================
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // اسم السحابة الخاص بك
  api_key: process.env.CLOUDINARY_API_KEY, // مفتاح API الخاص بك
  api_secret: process.env.CLOUDINARY_API_SECRET, // سر API الخاص بك
  secure: true, // يفضل استخدام HTTPS
});

//=============================== store image in memory storage by multer =========================
const storage = multer.memoryStorage();
// ============================== determine file size =============================================
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // مثال: 5 ميغابايت
});
//================================ دالة مساعدة لرفع البفر (Buffer) إلى Cloudinary======================
const streamUpload = (buffer, options) => {
  return new Promise((resolve, reject) => {
    let stream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (result) {
        resolve(result);
      } else {
        reject(error);
      }
    });
    // تحويل البفر في الذاكرة إلى Stream للرفع
    streamifier.createReadStream(buffer).pipe(stream);
  });
};
//===================================== upload images to cloudinary ================================================
router.post(
  "/api/cloudupload/add",
  upload.single("image"), // Multer سيضع الملف في req.file.buffer
  async (req, res) => {
    // ملاحظة: لن تحتاج لمعالج الأخطاء المعقد لـ Multer هنا لأنه سيتم التعامل مع الأخطاء داخلياً
    if (!req.file) {
      console.error("File missing in request.");
      return res.status(400).json({ message: "لم يتم إرسال ملف الصورة." });
    }
    try {
      const userId = req.body.userId; // رفعها لـ Cloudinary باستخدام Stream
      const uniquePublicId = `${userId}-${Date.now()}`;
      const result = await streamUpload(req.file.buffer, {
        folder: "mernstack/gallery", // sort folders in cloudinary
        // public_id: userId, //  هذا هو اسم الصوره ويضمن عند رفع صوره يقوم بحذف القديمه ومن الممكن تغييره الى دالة الوقت لرفع كل صوره باسم مختلف والاحتفاظ بكل الصور 
         public_id: uniquePublicId,
        upload_preset: "gallery_preset", // cloudinary settings لازم تكتب نفس الاسم ده في الكلاوديناري 
      }); 
      res.json({
        message: "✅ تم رفع الصورة بنجاح (مباشر)",
        imageUrl: result.secure_url, // // image link in cloudinary 
        userId,
      });
    } catch (err) {
      console.error("Cloudinary Upload Error:", err);
      res
        .status(500)
        .json({ message: "حدث خطأ أثناء رفع الصورة إلى Cloudinary" });
    }
  }
);

//=====================================================================================================
//================================ get images from cloudinary =========================================
//=====================================================================================================

// router.get("/api/allImages",async(req,res)=>{

// })

module.exports = router;
