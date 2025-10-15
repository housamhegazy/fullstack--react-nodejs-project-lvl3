//مسار التوجيه بين الموقع وجوجل

import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();
 useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // قم بطلب API للتحقق من حالة المصادقة وجلب بيانات المستخدم
        // تأكد من أن هذا المسار يعود ببيانات المستخدم إذا كان مسجل دخول
        const response = await axios.get("http://localhost:3000/api/profile", {
          withCredentials: true, // ضروري لإرسال الكوكيز مع الطلب
        });
        
        console.log("Authenticated user data:", response.data);
        
        // إذا نجح الطلب، قم بتوجيه المستخدم إلى لوحة التحكم
        navigate("/");
        
      } catch (error) {
        console.error("Authentication failed:", error.response.data.message);
        // إذا فشل الطلب، قم بتوجيه المستخدم إلى صفحة تسجيل الدخول
        navigate("/signin");
      }
    };

    checkAuthStatus();
  }, [navigate]);

  return <div>جاري تسجيل الدخول...</div>;
};

export default AuthSuccess;
