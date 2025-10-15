const express = require("express");
const router = express.Router();
const CustomerModel = require("../models/customesSchema"); // استيراد نموذج العميل

// ********************** تعريف دالة handleError هنا **********************
const handleError = (res, error) => {
  console.error("API Error:", error); // تسجيل الخطأ في الـ console لـ debugging
  res.status(500).json({
    message: "An internal server error occurred.",
    error: error.message,
  });
};
// **************************************************************************

// المسار الافتراضي
router.get("/", (req, res) => {
  res.send("Hello World! This is your backend API.");
});

// ********************** مسارات (Routes) API للمستخدمين **********************

// 2. Route to Get All Users (GET)
router.get("/api/allcustomers", async (req, res) => {
  try {
    const users = await CustomerModel.find({ owner: req.user.id }); // Fetch all users
    res.status(200).json(users); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
});
// 3. Route to Get one User (GET)
router.get("/api/allcustomers/:id", async (req, res) => {
  try {
    const customer = await CustomerModel.findOne({
      _id: req.params.id,
      owner: req.user.id,
    }); // Fetch all users
    res.status(200).json(customer); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
});
// 4. Route to open one User in edit page (GET)
router.get("/api/edit/:id", async (req, res) => {
  try {
    const customer = await CustomerModel.findOne({
      _id: req.params.id,
      owner: req.user.id,
    }); // Fetch one customer
    res.status(200).json(customer); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
});

//5--update funct

router.put("/api/editcustomer/:id", async (req, res) => {
  const { id } = req.params; // جلب الـ id من المعاملات
  const updatedData = req.body; // جلب البيانات المراد تحديثها من جسم الطلب
  try {
    const customer = await CustomerModel.findOneAndUpdate(
      { _id: id, owner: req.user.id },
      updatedData,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!customer) {
      return res.status(404).json({ message: "Customer not found." });
    }

    res.status(200).json(customer); // إرجاع المستخدم المحدّث
  } catch (error) {
    handleError(res, error);
  }
});
//6-delete function
router.delete("/api/allcustomers/:id", async (req, res) => {
  try {
    const customer = await CustomerModel.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    }); // Fetch all users
    res.status(200).json(customer); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
});
//search function
router.get("/api/search", async (req, res) => {
  try {
    const searchValue = req.query.svalue;
    if (!searchValue) {
      // 2. إذا لم يتم تقديم قيمة للبحث، يمكنك إما:
      //    أ. إرجاع جميع المستخدمين (إذا كان هذا هو السلوك المطلوب لصفحة البحث الفارغة)
      //    ب. إرجاع مصفوفة فارغة أو رسالة تفيد بعدم وجود استعلام
      // const allUsers = await CustomerModel.find({});
      // return res.status(200).json(allUsers);
      // أو:
      return res
        .status(200)
        .json({ message: "Please provide a search query." });
    }
    const customer = await CustomerModel.find({
      $and: [
        { owner: req.user.id }, // شرط الملكية: يجب أن يكون المالك هو المستخدم الحالي
        {
          $or: [
            { firstName: { $regex: searchValue, $options: "i" } },
            { lastName: { $regex: searchValue, $options: "i" } },
            { email: { $regex: searchValue, $options: "i" } },
            { phoneNumber: { $regex: searchValue, $options: "i" } },
            { country: { $regex: searchValue, $options: "i" } },
          ],
        },
      ],
    }); // Fetch all users
    res.status(200).json(customer); // 200 OK
  } catch (error) {
    handleError(res, error);
  }
});

module.exports = router;
