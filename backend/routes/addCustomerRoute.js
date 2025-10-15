
const express = require("express");
const router = express.Router();
const CustomerModel = require("../models/customesSchema"); // استيراد نموذج المستخدم
// مسار لإضافة مستخدم جديد (POST)
router.post("/api/addcustomers", async (req, res) => {
  // 1. استخراج بيانات المستخدم من الطلب
  const customerData = req.body;

  // 2. دمج هوية المستخدم مع بيانات العميل
  // نفترض أن نموذج العميل يحتوي على حقل باسم 'owner' أو 'createdBy'
  const newUser = new CustomerModel({
    ...customerData,
    owner: req.user.id, // نفترض أن التوكن يحتوي على { user: { id: '...' } }
    // تأكد من أن الحقل الذي يخزن المالك موجود في نموذج CustomerModel
  });
  try {
    await newUser.save();
    res.status(201).send(newUser); // 201 Created
  } catch (error) {
    if (error.code === 11000) {
      // Duplicate key error (e.g., email already exists)
      return res.status(400).send({ message: "Email already registered." });
    }
    res.status(400).send(error); // 400 Bad Request if validation fails
  }
});

module.exports = router;
