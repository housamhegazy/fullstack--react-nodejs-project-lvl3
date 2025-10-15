import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useGetUserProfileQuery } from "../Redux/userApi"; // Your RTK Query hook
import Swal from "sweetalert2";

const EditProfile = () => {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: userLoading,
    isError,
  } = useGetUserProfileQuery(); // Fetch current user
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Populate form with current user data
  useEffect(() => {
    if (!user && !userLoading) {
      navigate("/signin", { replace: true });
    }
    if (user && !userLoading) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
      });
      setPreview(user.avatar); // Current avatar preview
    }
  }, [navigate, user, userLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Basic validation
    if (!formData.fullName || !formData.email) {
      setError("Please fill all fields");
      setLoading(false);
      return;
    }
    // Check if email is different and account is from external provider
    if (
      user &&
      user.provider &&
      user.provider.length > 0 &&
      user.provider.includes("local")
    ) {
      if (formData.email !== user.email) {
        setError(
          "Email cannot be changed if linked to external providers (Google, Facebook, Twitter)."
        );
        setLoading(false);
        return;
      }
    }
    // Create FormData for multipart upload
    const data = new FormData();
    data.append("fullName", formData.fullName);
    data.append("email", formData.email);
    if (selectedFile) {
      data.append("avatar", selectedFile);
    }

    try {
      const response = await axios.put(
        "http://localhost:3000/api/users/update-profile", // Adjust URL
        data,
        {
          withCredentials: true, // For session/auth
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      Swal.fire("Success!", "Profile updated successfully", "success");
      navigate("/profile"); // Redirect to profile or home
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Update failed");
      Swal.fire(
        "Error!",
        err.response?.data?.message || "Update failed",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  if (userLoading) {
    return <CircularProgress />;
  }

  if (isError) {
    return <Alert severity="error">Error loading user data</Alert>;
  }

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          p: 4,
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
          transition: "box-shadow 0.3s ease-in-out", // تأثير انتقالي للظل
          "&:hover": { boxShadow: 6 }, // ظل أكبر عند التمرير
        }}
      >
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 3, fontWeight: "bold", color: "#1976d2" }}
        >
          Edit Profile
        </Typography>
        {error && (
          <Alert
            severity="error"
            sx={{ width: "100%", mb: 2, borderRadius: 1 }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ mt: 1, width: "100%" }}
        >
          <Grid container spacing={3} alignItems="center" direction={"column"}>
            {/* Form Fields */}
            <Grid>
              <TextField
                required
                fullWidth
                id="fullName"
                label="Full Name"
                name="fullName"
                value={formData.fullName} // استخدم value بدلاً من defaultValue للسيطرة
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            </Grid>
            <Grid>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                value={formData.email} // استخدم value بدلاً من defaultValue
                onChange={handleInputChange}
                variant="outlined"
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                disabled={
                  user?.providers && user.providers.some((p) => p !== "local")
                } // تعطيل إذا كان هناك مزود خارجي
                InputProps={{
                  readOnly:
                    user?.providers &&
                    user.providers.some((p) => p !== "local"), // جعل الحقل غير قابل للتعديل
                }}
              />
            </Grid>

            {/* Upload Section */}
            <Grid sx={{ textAlign: "center", mb: 2 }}>
              <input
                accept="image/*"
                style={{ display: "none" }}
                id="avatar-upload"
                type="file"
                onChange={handleFileChange}
              />
              <label htmlFor="avatar-upload">
                <Button
                  variant="outlined"
                  component="span"
                  sx={{
                    borderColor: "#1976d2",
                    color: "#1976d2",
                    "&:hover": {
                      borderColor: "#1565c0",
                      backgroundColor: "rgba(25, 118, 210, 0.1)",
                    },
                  }}
                >
                  Upload Profile Picture
                </Button>
              </label>
              {preview && (
                <Box sx={{ mt: 2, textAlign: "center" }}>
                  <Avatar
                    src={preview}
                    sx={{ width: 100, height: 100, mx: "auto" }}
                  />
                </Box>
              )}
            </Grid>

            {/* Buttons Section */}
            <Grid
              sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}
            >
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  boxShadow: 2,
                  "&:hover": { boxShadow: 4, backgroundColor: "#1565c0" },
                }}
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : null}
              >
                {loading ? "Updating..." : "Update Profile"}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  flex: 1,
                  py: 1.5,
                  borderRadius: 2,
                  borderColor: "#d32f2f",
                  color: "#d32f2f",
                  "&:hover": {
                    borderColor: "#b71c1c",
                    backgroundColor: "rgba(211, 47, 47, 0.1)",
                  },
                }}
                onClick={() => navigate("/forgot-password")}
              >
                Change Password
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default EditProfile;
