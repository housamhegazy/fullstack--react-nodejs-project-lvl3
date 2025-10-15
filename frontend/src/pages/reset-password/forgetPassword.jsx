import React, { useState } from "react";
import { 
    Container, 
    Box, 
    Typography, 
    TextField, 
    Button, 
    Alert, 
    CircularProgress, 
    Avatar, 
    useTheme 
} from "@mui/material";
import LockResetIcon from "@mui/icons-material/LockReset";
import { Link } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";

function ForgotPassword() {
// التحقق من حالة المصادقة من Redux
    const authState = useSelector((state) => state.auth);
    const isAuthenticated = authState?.isAuthenticated || false; // افتراض أن state.auth يحتوي على isAuthenticated
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const theme = useTheme();

    const validateEmail = (email) => {
        return /\S+@\S+\.\S+/.test(email);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        if (!validateEmail(email)) {
            setError("الرجاء إدخال بريد إلكتروني صالح.");
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:3000/api/forgot-password",
                { email }
            );

            // رسالة النجاح ستكون عامة لأسباب أمنية (حتى لو لم يكن الإيميل مسجلاً)
            setSuccess(response.data.message || "تم إرسال تعليمات إعادة تعيين كلمة المرور إلى بريدك.");

        } catch (apiError) {
            // التعامل مع الأخطاء التي لا تتعلق بعدم وجود البريد الإلكتروني
            console.error("Forgot Password API error:", apiError);
            setError(apiError.response?.data?.message || "حدث خطأ غير متوقع. يرجى المحاولة لاحقاً.");
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
                    استرداد كلمة المرور
                </Typography>

                <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 3 }}>
                    أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
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

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="البريد الإلكتروني"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!error && !validateEmail(email)}
                        helperText={!!error && !validateEmail(email) ? "الرجاء إدخال بريد إلكتروني صالح." : ""}
                    />
                    
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "إرسال رابط إعادة التعيين"}
                    </Button>
                    {!isAuthenticated && <Box display="flex" justifyContent="center">
                        <Link 
                            to="/signin" 
                            sx={{
                                color: theme.palette.mode === 'dark' ? theme.palette.primary.light : theme.palette.primary.main,
                                textDecoration: 'none', 
                                '&:hover': {
                                    textDecoration: 'underline'
                                }
                            }}
                        >
                            العودة لتسجيل الدخول
                        </Link>
                    </Box>}
                    
                </Box>
            </Box>
        </Container>
    );
}

export default ForgotPassword;