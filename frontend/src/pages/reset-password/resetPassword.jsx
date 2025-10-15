import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { token } = useParams(); // الحصول على الرمز المميز من الـ URL
  const navigate = useNavigate();

  useEffect(() => {
    // التحقق من صلاحية الرمز المميز عند تحميل الصفحة
    const verifyToken = async () => {
      
      if (!token) {
        setError("الرمز المميز مفقود.");
        return;
      }
      try {
        setLoading(true);
        // إرسال طلب للتحقق من صلاحية الرمز في الخادم
        await axios.get(`http://localhost:3000/api/reset-password/${token}`);
        setIsTokenValid(true);
      } catch (err) {
        console.error("Token verification error:", err);
        setError("الرمز المميز غير صالح أو منتهي الصلاحية.");
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, [token]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    if (password.length < 6) {
      setError("يجب أن تكون كلمة المرور 6 أحرف على الأقل.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("كلمتا المرور غير متطابقتين.");
      setLoading(false);
      return;
    }

    try {
      // إرسال كلمة المرور الجديدة إلى الخادم
      await axios.post(`http://localhost:3000/api/reset-password/${token}`, {
        password,
      });
      setSuccess("تمت إعادة تعيين كلمة المرور بنجاح.");
      if (isTokenValid) {
        return
      } else {
        setTimeout(() => navigate("/signin"), 2000); // إعادة التوجيه لصفحة تسجيل الدخول
      }
    } catch (err) {
      console.error("Password reset error:", err);
      setError(
        err.response?.data?.message ||
          "فشل إعادة تعيين كلمة المرور. يرجى المحاولة مرة أخرى."
      );
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
          bgcolor: "background.paper",
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockResetIcon />
        </Avatar>
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          إعادة تعيين كلمة المرور
        </Typography>

        {loading ? (
          <CircularProgress />
        ) : (
          error && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {error}
            </Alert>
          )
        )}
        {success && <Alert severity="success">{success}</Alert>}
        <>
          <Typography
            variant="body2"
            color="text.secondary"
            align="center"
            sx={{ mb: 3 }}
          >
            أدخل كلمة مرور جديدة لحسابك.
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1, width: "100%" }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="كلمة المرور الجديدة"
              type="password"
              id="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="تأكيد كلمة المرور الجديدة"
              type="password"
              id="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              إعادة تعيين كلمة المرور
            </Button>
          </Box>
        </>
      </Box>
    </Container>
  );
}

export default ResetPassword;
