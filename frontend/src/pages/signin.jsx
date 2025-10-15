import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  Avatar,
  useTheme,
  CircularProgress,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "../Redux/authSlice";
import { useGetUserProfileQuery } from "../Redux/userApi";
import GoogleLogin from "../components/SocialLoginBtns/GoogleLogin";
import FacebooklogIn from "../components/SocialLoginBtns/FacebookLogin";
import XLoginButton from "../components/SocialLoginBtns/X-login";

function SignIn() {
  //هنا انا استخدمت ال loader عشان احصل على بيانات المستخدم لكن لو هعمل تحديث بيانات المستخدم في الملف الشخصي ممكن استخدم useGetUserProfileQuery
  // @ts-ignore
  const authState = useSelector((state) => state.auth);
  // const user = authState?.user; // <--- هنا بيانات المستخدم!
  const isAuthenticated = authState?.isAuthenticated;
  const isLoadingAuth = authState?.isLoadingAuth;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { refetch } = useGetUserProfileQuery();

  useEffect(() => {
    // تحقق من أن التحميل الأولي قد انتهى
    if (!isLoadingAuth && isAuthenticated) {
      // إذا كان المستخدم مصادقًا عليه، قم بإعادة توجيهه إلى الصفحة الرئيسية
      console.log("User is authenticated, redirecting from signin page.");
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  // دالة بسيطة للتحقق من صحة البريد الإلكتروني
  const validateEmail = (email) => {
    // regex بسيط للتحقق من تنسيق البريد الإلكتروني
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Client-side validation
    if (!email || !password) {
      setError("all fields required");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("please use a valid email address.");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("password length must be at least 6 characters long ");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/api/signin",
        {
          email,
          password,
        },
        { withCredentials: true }
      );

      // إذا كانت الاستجابة JSON:
      if (response.data.message) {
        setSuccess(response.data.message);
        const userData = response.data.user; // تأكد من أن السيرفر يرسل بيانات المستخدم هنا
        dispatch(setAuthUser(userData)); // <--- تحديث Redux Auth State
        await refetch(); // إعادة جلب بيانات المستخدم من الباكند
        // تأخير بسيط لرؤية رسالة النجاح قبل التنقل
        navigate("/");
        // تسجيل الدخول ناجح
      } else {
        setSuccess("successfully registered");
        // إذا لم تكن هناك رسالة، يمكن افتراض رسالة افتراضي
        await refetch(); // إعادة جلب بيانات المستخدم من الباكند
        navigate("/");
      }
    } catch (apiError) {
      setLoading(false); // تأكد من إيقاف حالة التحميل
      if (apiError.response) {
        const status = apiError.response.status;
        const errorMessage = apiError.response.data.message;
        if (status === 400) {
          // 400 Bad Request - قد يكون بسبب بيانات غير صالحة
          setError(
            errorMessage || "this email is not registered or incorrect password"
          );
        } else {
          // أي أخطاء أخرى من الـ Backend
          setError(
            errorMessage || "An unexpected error occurred. Please try again."
          );
        }
      } else if (apiError.request) {
        // لم يتم تلقي أي استجابة من الـ API (مثل مشكلة في الشبكة)
        setError(
          "  Network error: Unable to reach the server. Please try again later."
        );
      } else {
        // خطأ آخر حدث أثناء إعداد الطلب
        setError("  An error occurred. Please try again.");
      }
      console.error("Register API error:", apiError);
    } finally {
      setLoading(false);
    }
  };

  if (isLoadingAuth) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          bgcolor: "background.default", // استخدام لون الخلفية من الثيم
          color: "text.primary", // استخدام لون النص من الثيم
        }}
      >
        <CircularProgress sx={{ mb: 2 }} />
        <Typography variant="h6">جار التحقق من البيانات...</Typography>
        <Typography variant="body2">يرجى الانتظار.</Typography>
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper", // يستخدم لون الخلفية من الثيم (أبيض في Light, داكن في Dark)
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Sign In
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
            {success}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="email"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && !validateEmail(email)} // يظهر الخطأ إذا كان هناك خطأ عام و البريد غير صالح
            helperText={!!error && !validateEmail(email) ? "invalid email" : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error && password.length < 6}
            helperText={!!error && password.length < 6 ? " short password" : ""}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? `loading....` : " sign In"}
          </Button>
          <Box display="flex" justifyContent="center">
            <Link
              to="/forgot-password"
              style={{
                color: `${theme.palette.mode === "dark" ? "white" : "black"}`,
              }}
            >
              forget password?
            </Link>
          </Box>
          <Box display="flex" justifyContent="center" sx={{ mt: 2 }}>
            <Link
              to="/register"
              style={{
                color: `${theme.palette.mode === "dark" ? "white" : "black"}`,
              }}
            >
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mt: 5,
            backgroundColor: "#ffffff4d",
            borderRadius: "20px",
            px: 5,
          }}
        >
          <GoogleLogin />{" "}
          {/* أضفه إذا كنت تريد عرضه بشكل مستقل، أو قم بدمجه في صفحة اللوجين */}
          <FacebooklogIn />{" "}
          {/* أضفه إذا كنت تريد عرضه بشكل مستقل، أو قم بدمجه في صفحة اللوجين */}
          <XLoginButton />
        </Box>
      </Box>
    </Container>
  );
}

export default SignIn;
