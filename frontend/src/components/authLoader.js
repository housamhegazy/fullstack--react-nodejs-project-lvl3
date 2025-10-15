//***********************ملاحظات هامه ********************** */
// نعتمد بشكل اساسي على الريأكت هوك لحماية المسارات 
// ونعتمد بشكل اساسي على ملف authSlice  للتحقق من حالة المستخدم في كل انحاء التطبيق 
//   (RTK Query)ونعتمد بشكل اساسي على useGetUserProfileQuery للحصول على بيانات المستخدم والتعديل عليها 
//***********************ملاحظات هامه ********************** */
// utils/authLoader.js (ملف جديد يمكنك إنشاؤه)


import { redirect } from 'react-router-dom';
import { store } from '../Redux/store';
import { userApi } from '../Redux/userApi';

// دالة مساعدة للتحقق من المصادقة
// const checkAuth = async () => {
//     try {
//         const result = await store.dispatch(
//             userApi.endpoints.getUserProfile.initiate(undefined, { forceRefetch: true })
//         ).unwrap();
//         return result;
//     } catch (error) {
//         throw redirect('/signin');
//     }
// };


export const authLoader = async ({ request }) => {
    try {
        // إذا فشل هذا الطلب (يستجيب الخادم بـ 401 بعد تسجيل الخروج)
        const queryResult = await store.dispatch(
            userApi.endpoints.getUserProfile.initiate(undefined, { forceRefetch: true })
        ).unwrap();
        
        return queryResult; 
    } catch (error) {
      
      if (error.status === 401) {
      throw redirect('/signin');
    } else {
      throw new Response("خطأ في الخادم أثناء المصادقة", { status: 500 });
    }
    
    }
};


// import { redirect } from "react-router-dom";
// import axios from "axios"; // تأكد أن axios مستورد هنا أيضًا وأن `withCredentials` مضبوط


// export const authLoader = async () => {
//   try {
//     const response = await axios.get("http://localhost:3000/api/profile",{withCredentials: true});  
//     return response.data;
//   } catch (error) {
//     if (error.response && error.response.status === 401) {
//       console.log("Unauthorized access in loader, redirecting to signin.");
//       // <--- هذا هو الجزء السحري: إعادة التوجيه الفورية
//       throw redirect("/signin");
//     }
//     // لأي خطأ آخر، يمكنك إلقاء الخطأ للسماح لـ ErrorBoundary بالتعامل معه
//     // أو إرجاع قيمة خطأ محددة
//     console.error("Error in authLoader:", error);
//     throw new Error("Failed to load user profile in loader.");
//   }
// };


// 2. Loader لمنع الوصول لصفحات Signin/Register
// =========================================================
// export const authPageLoader = async() => {
//     // هذا Loader لا يتطلب طلب شبكة، يعتمد فقط على Redux State
//     const authState = store.getState().auth;

//     if (authState.isAuthenticated) {
//         // إذا كان المستخدم مصادقًا عليه، نوجهه بعيدًا عن صفحة تسجيل الدخول/التسجيل
//         console.log("User is already authenticated, redirecting to home.");
//         throw redirect("/");
//     }
//     return null;
// };
