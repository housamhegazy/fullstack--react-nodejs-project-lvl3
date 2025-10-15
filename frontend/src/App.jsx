import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Profile from "./pages/Profile";
import Customers from "./pages/Customers";
import Edite from "./pages/Edite";
import Search from "./pages/Search";
import View from "./pages/View";
import AddCustomer from "./pages/AddCustomer";
import Root from "./Root";
import Err_404Page from "./pages/Err_404Page";
import Signin from "./pages/signin";
import SignUp from "./pages/register";
import EditProfile from "./pages/editeProfile";
import AuthSuccess from "./components/AuthSuccess";
import axios from "axios";
axios.defaults.withCredentials = true;
import { useDispatch } from "react-redux";
import { setLoadingAuth, setAuthUser, clearAuthUser } from "./Redux/authSlice";
import { useGetUserProfileQuery } from "./Redux/userApi";

import LoadingPage from "./components/loading/loadingPage";
import FetchingdataLoader from "./components/loading/fetchingData";
import ResetPassword from "./pages/reset-password/resetPassword";
import ForgotPassword from "./pages/reset-password/forgetPassword";
import LocalUpload from "./pages/localUpload/localupload";
import CloudinarUploud from "./pages/cloudUpload/cloudupload";
import { useEffect } from "react";

function App() {
  const dispatch = useDispatch();
  const localTheme = localStorage.getItem("localTheme");
  const defaultMode =
    localTheme === null ? "light" : localTheme === "light" ? "light" : "dark";
  const {
    data: userProfile,
    isLoading,
    isSuccess,
    isError,
  } = useGetUserProfileQuery(undefined, {
    refetchOnMountOrArgChange: true,
    skip: false,
  });

  // useEffect لتحديث Redux authSlice بناءً على حالة جلب بيانات الملف الشخصي
  useEffect(() => {
    dispatch(setLoadingAuth(isLoading));
    if (!isLoading) {
      if (isSuccess && userProfile) {
        dispatch(setAuthUser(userProfile));
      } else if (isError) {
        dispatch(clearAuthUser());
      }
    }
  }, [userProfile, isLoading, isSuccess, isError, dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      Component: Root,
      errorElement: <Err_404Page />, // ✳️ هنا بس مرة واحدة
      children: [
        {
          index: true,
          Component: Customers,
          // loader: authLoader,
          HydrateFallback: FetchingdataLoader, // شاشة التحميل داخل الكومبوننت نفسه حتى لا تظهر شاشه بيضاء
        }, // <--- إضافة الـ loader هنا أيضًا
        {
          path: "profile",
          Component: Profile,
          // loader: authLoader,

          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "edite/:id",
          Component: Edite,
          // loader: authLoader,

          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "search",
          Component: Search,
          // loader: authLoader,

          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "view/:id",
          Component: View,
          // loader: authLoader,

          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "addCustomer",
          Component: AddCustomer,
          // loader: authLoader,

          HydrateFallback: FetchingdataLoader,
        },

        {
          path: "editeprofile",
          Component: EditProfile,
          // loader: authLoader,

          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "localupload",
          Component: LocalUpload,
          // loader: authLoader,

          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "cloudupload",
          Component: CloudinarUploud,
          // loader: authLoader,

          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "signin",
          Component: Signin,

          HydrateFallback: FetchingdataLoader,
        },
        {
          path: "register",
          Component: SignUp,

          HydrateFallback: FetchingdataLoader,
        },
        { path: "auth-success", Component: AuthSuccess },
        { path: "*", Component: Err_404Page },
        // المسارات الجديدة لاسترداد كلمة المرور
        { path: "forgot-password", Component: ForgotPassword },
        { path: "reset-password/:token", Component: ResetPassword },
        {
          path: "*",
          Component: Err_404Page,
        },
      ],
    },
  ]);
  // <--- شاشة التحميل الأولية: تظهر أثناء التحقق من المصادقة الأولية
  if (isLoading) {
    return <LoadingPage mode={defaultMode} />;
  }

  return (
    <RouterProvider router={router} fallbackElement={FetchingdataLoader} />
  );
}
export default App;
