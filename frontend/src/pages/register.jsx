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
} from "@mui/material";
import AppRegistrationOutlinedIcon from "@mui/icons-material/AppRegistrationOutlined"; // أيقونة للتسجيل
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useGetUserProfileQuery } from "../Redux/userApi";
import { setAuthUser } from "../Redux/authSlice";

function SignUp() {
  // @ts-ignore
  const authState = useSelector((state) => state.auth);
  //===========================================================================
  //  جلب حالة المصادقة وحالة التحميل الأولية من Redux Store
  // const user = authState?.user; // <--- هنا بيانات المستخدم!
  const isAuthenticated = authState?.isAuthenticated;
  const isLoadingAuth = authState?.isLoadingAuth; // حالة التحقق الأولي من المصادقة

  //=================================================================================
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { refetch } = useGetUserProfileQuery();

  useEffect(() => {
    // تحقق من أن التحميل الأولي قد انتهى
    if (!isLoadingAuth && isAuthenticated) {
      // إذا كان المستخدم مصادقًا عليه، قم بإعادة توجيهه إلى الصفحة الرئيسية
      console.log("User is authenticated, redirecting from signin page.");
      navigate("/",{ replace: true });
    }
  }, [isAuthenticated, isLoadingAuth, navigate]);

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Client-side validation
    if (!fullName || !email || !password || !confirmPassword) {
      setError("all fields required");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("please enter valid email");
      setLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("password length must be at least 6 characters long");
      setLoading(false);
      return;
    }
    if (password !== confirmPassword) {
      setError("passwords do not match");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/register", {
        fullName,
        email,
        password,
        confirmPassword,
      });

      // إذا كانت الاستجابة JSON:
      if (response.data.message) {
        setSuccess(response.data.message);
        dispatch(setAuthUser(response.data)); // <--- تحديث Redux Auth State
        await refetch();
      } else {
        setSuccess("successfully registered");
        await refetch(); // إعادة جلب بيانات المستخدم من الباكند
      }

      setTimeout(() => {
        navigate("/");
      }, 1500); // تأخير بسيط قبل إعادة التوجيه
    } catch (apiError) {
      setLoading(false); // تأكد من إيقاف حالة التحميل
      if (apiError.response) {
        // الـ API أرسل استجابة خطأ (مثل 400, 409, 500)
        const status = apiError.response.status;
        const errorMessage = apiError.response.data.message;

        if (status === 409) {
          // 409 Conflict - هذا يشير إلى تكرار البريد الإلكتروني
          setError(errorMessage || "this email already registered");
        } else if (status === 400) {
          // 400 Bad Request - قد يكون بسبب بيانات غير صالحة
          setError(errorMessage || "please check your input data");
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
          // color:`${theme.palette.mode === "dark" ? }`,
          bgcolor: `${theme.palette.mode === "dark" ? "background.paper" : ""}`,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
          {" "}
          {/* استخدام اللون الأساسي للأيقونة */}
          <AppRegistrationOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Register
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
            id="fullName"
            label=" fullName"
            name="fullName"
            autoComplete="name"
            autoFocus
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            error={!!error && !fullName}
            helperText={!!error && !fullName ? "fullName required  " : ""}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="البريد الإلكتروني"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={!!error && !validateEmail(email)}
            helperText={
              !!error && !validateEmail(email) ? "please enter valid email" : ""
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="كلمة المرور"
            type="password"
            id="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error && password.length < 6}
            helperText={
              !!error && password.length < 6
                ? "password must be at least 6 characters long"
                : ""
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="confirm Password"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={!!error && password !== confirmPassword}
            helperText={
              !!error && password !== confirmPassword
                ? "passwords do not match"
                : ""
            }
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? "loading ..." : "register"}
          </Button>
          <Box display="flex" justifyContent="center">
            <Link
              to="/signin"
              style={{
                color: `${theme.palette.mode === "dark" ? "white" : "black"}`,
              }}
            >
              {"you have an account? Sign In"}
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default SignUp;
