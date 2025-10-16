// upload images to local folder with (Multer)
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// إعداد التخزين باستخدام multer
const uploadDirBase = path.join(__dirname, "../uploads"); // المسار الأساسي لفولدر uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const userId = req.body.userId;
    const uploadDir = path.join(uploadDirBase, userId); // انشاء فولدر بالاي دي لكل مستخدم
    // تأكد إن فولدر uploads موجود
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    cb(null, uploadDir); // حفظ الملف في فولدر uploads
  },
  filename: function (req, file, cb) {
    // نسمي الملف باسم فريد مع الامتداد الأصلي
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // انشاء اسم لكل صوره
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post(
  "/api/uploadpic",
  upload.single("myfile"),
  function (req, res, next) {
    if (!req.file) {
      return res.status(400).json({ message: "لم يتم رفع أي ملف" });
    }
    const userId = req.body.userId;

    // لو كل شيء تمام
    res.json({
      message: "تم رفع الصورة بنجاح ✅",
      filename: req.file.filename,
      path: `/uploads/${userId}/${req.file.filename}`,
    });
  }
);
// // عشان نعرض الصور من فولدر uploads
router.use("/uploads", express.static(path.join(__dirname, `../uploads`)));
// API ترجع آخر صورة (مثلاً)
router.get("/api/lastpic/:userId", async (req, res) => {
  const userId = req.params.userId;
  
  const uploadDir = path.join(uploadDirBase, userId);
  // لو العميل اول مره يدخل فالفولدر بيكون مااتعملش اصلا فالبتالي هايحصل خطأ لان الفانكشن بتجيب الصور مع فتح الصفحه لذلك لابد من انشاء الفولدر بشكل اوتوماتيك عند فتح الصفحه
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ message: "خطأ في قراءة الملفات" });
    if (!files.length) return res.json({ imageUrl: null });

    // نرتب الملفات حسب الأحدث
    const latestFile = files
      .map((f) => ({
        name: f,
        time: fs.statSync(path.join(uploadDir, f)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time)[0].name; 
    const url = `http://localhost:3000/uploads/${userId}/${latestFile}`
    res.json({
      imageUrl: url,
    });
  });
});

// get images
router.get("/api/allpic/:userId", async (req, res) => {
  const userId = req.params.userId;
  const uploadDir = path.join(uploadDirBase, userId);
  // لو العميل اول مره يدخل فالفولدر بيكون مااتعملش اصلا فالبتالي هايحصل خطأ لذلك لبد من انشاء الفولدر بشكل اوتوماتيك عند فتح الصفحه
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
  }
  fs.readdir(uploadDir, async (err, files) => {
    if (err) return res.status(500).json({ message: "خطأ في قراءة الملفات" });
    if (!files.length) return res.json({ images: [] });

    // نرجّع مصفوفة من روابط الصور الكاملة
    const imageUrls = files.map(
      (file) => `http://localhost:3000/uploads/${userId}/${file}`
    );
    res.json({ images: imageUrls });
  });
});

//delete image
router.delete("/api/deleteImage/:image/:userId", async (req, res) => {
  const userId = req.params.userId;
  const { image } = req.params;

  const uploadDir = path.join(uploadDirBase, userId);
  const filePath = path.join(uploadDir, image);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      return res.status(404).json({ message: "❌ الصورة غير موجودة" });
    }

    // احذف الملف
    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).json({ message: "⚠️ حدث خطأ أثناء حذف الصورة" });
      }

      res.json({ message: "✅ تم حذف الصورة بنجاح" });
    });
  });
});
module.exports = router;
