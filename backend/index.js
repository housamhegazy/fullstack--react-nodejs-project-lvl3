const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser"); // لاستخدامها لقراءة JSON من الطلبات
const cors = require("cors"); // للسماح لـ frontend بالاتصال بـ backend
const session = require("express-session"); // <--- إضافة هذا
const passport = require("passport"); // إضافة passport
const path = require("path");
require("dotenv").config();
require("./config/passport"); // استيراد إعداد passport
const methodOverride = require("method-override");

// استيراد مسارات وميدل ويرز (افترض وجود هذه الملفات في مشروعك)
// <--- استيراد Middleware التحقق
const isAuthenticated = require("./middleware/authMiddleware");
const allRoutes = require("./routes/allRoutes");
const registerRoute = require("./routes/registerRoute");
const signinRoute = require("./routes/signinRoute");
const getUserRoute = require("./routes/GetUserRoute");
const signoutRoute = require("./routes/signoutRoute");
const authRoute = require("./routes/authRoute");
const forgotPasswordRoute = require("./routes/resetPasswordRoutes/forgetPasswordRoute"); 
const resetPasswordRoute = require("./routes/resetPasswordRoutes/resetPasswordRoute"); 
const addCustomerRoute = require("./routes/addCustomerRoute")
const updateUserRoute = require('./routes/updateUserRoute');
const localUpload = require("./routes/localUploadRoute");
const cloudUploadRoute =require("./routes/clouduploadRoute")


const MongoStore = require("connect-mongo"); 

const app = express();
const port = process.env.PORT || 3000;

// ********************** Middleware **********************

app.use(
  cors({
    origin: "http://localhost:5173", // ضع هنا عنوان الفرونتند
    credentials: true, // يسمح بإرسال الكوكيز
  })
); // تفعيل CORS للسماح لـ frontend (الذي يعمل على منفذ مختلف) بالاتصال بـ backend
app.use(bodyParser.json()); // يسمح لـ Express بقراءة JSON في body الطلبات
app.use(bodyParser.urlencoded({ extended: true })); // لقراءة بيانات النموذج المشفرة

// ********************** اعداد الجلسات و Passport.js **********************

app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_session_secret_key",
    resave: false,
    saveUninitialized: false,
    // تأكد أنك تستخدم MongoStore هنا كما في الكود السابق لتخزين الجلسات
    store: MongoStore.create(
      {
        mongoUrl: process.env.MONGODB_URI,
        mongoOptions: { useUnifiedTopology: true },
        ttl: 24 * 60 * 60, // وقت الجلسة بالثواني (يوم واحد)
      },
      (err) => {
        if (err) console.error("MongoStore error:", err);
      }
    ),

    cookie: {
      secure: process.env.NODE_ENV === "production", // true في الإنتاج، false في التطوير
      httpOnly: true, // يوصى به دائمًا
      maxAge: 1000 * 60 * 60 * 24, // يوم واحد
      sameSite: "Lax", // <--- قم بتغيير 'strict' إلى 'Lax'
    },
  })
);
// إعداد Passport لتسجيل الدخول بجوجل 
app.use(passport.initialize());
app.use(passport.session());

// ********************** استخدام المسارات والميدل ويرز **********************
app.use("/register", registerRoute);
app.use("/api/signin", signinRoute);
app.use("/api/signout", signoutRoute);

//google signin
app.use("", authRoute);
app.use("/api/forgot-password", forgotPasswordRoute); // <--- إضافة هذا
app.use("/api/reset-password", resetPasswordRoute); // <--- إضافة هذا
app.use("",isAuthenticated,localUpload)
app.use('/api/users',  isAuthenticated, updateUserRoute); 

app.use("/api/profile", isAuthenticated, getUserRoute);
app.use("", isAuthenticated, allRoutes);
app.use("", isAuthenticated, addCustomerRoute);
app.use("",isAuthenticated,cloudUploadRoute)

// ********************** الاتصال بـ MongoDB **********************

app.use(methodOverride("_method"));

//auto refresh
const livereload = require("livereload"); // استيراد وحدة livereload
const liveReloadServer = livereload.createServer(); // إنشاء سيرفر LiveReload

liveReloadServer.watch(path.join(__dirname, "public"));
const connectLivereload = require("connect-livereload"); // استيراد Middleware
app.use(connectLivereload());
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});
//end livereload
mongoose
  .connect(
    "mongodb+srv://geohousam_db_user:UAc4KjEnIs8qVEEJ@addcustomercluster.xoewuxa.mongodb.net/all-data?retryWrites=true&w=majority&appName=addcustomercluster",
    {
      // useUnifiedTopology: true,
      // useCreateIndex: true, // Mongoose 6+ لا يحتاج لهذا الخيار
      // useFindAndModify: false // Mongoose 6+ لا يحتاج لهذا الخيار
    }
  )
  .then(() => console.log("Connected to MongoDB!"))
  .catch((err) => console.error("Could not connect to MongoDB...", err));
// يمكنك استبدال 'mongodb://localhost:27017/myusersdb' برابط اتصال MongoDB Atlas الخاص بك
// مثال: 'mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/myusersdb?retryWrites=true&w=majority'
// ***************************************************************

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
