import { Upload, Delete, Cloud } from "@mui/icons-material";
import {
  useMediaQuery,
  Box,
  Grid,
  Button,
  Typography,
  useTheme,
  Avatar,
  Divider,
  Chip,
  ImageList,
  ImageListItem,
  Skeleton,
  IconButton,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "../../Redux/userApi";
import Swal from "sweetalert2";

const CloudinarUploud = () => {
  const navigate = useNavigate();
  const {
    data: user,
    isLoading: userLoading,
    isError,
  } = useGetUserProfileQuery(); // Fetch current user
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [preview, setPreview] = useState(null);
  const [allImgs, setAllImgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  //======================================= FETCHING PAGE DATA =================================================
  useEffect(() => {
    if (!user && !userLoading) {
      navigate("/signin", { replace: true });
      return;
    }

    if (userLoading) {
      return;
    }
    if (user) {
      console.log(user);
    }
  }, [navigate, user, userLoading]);
  //=====================================ADD PHOTO TO STATE ================================================
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        setError("");
      };
      reader.readAsDataURL(file);
    }
  };
  //=================================== SEND DATA TO BACKEND =====================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("من فضلك اختر صورة أولًا");
      return;
    }
    //تخزين داتا الفورم
    const formData = new FormData();
    formData.append("userId", user._id);
    formData.append("image", selectedFile);
    setLoading(true);
    //ارسالها للباك اند
    
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, Add it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:3000/api/cloudupload/add`, {
          body: formData,
          method:"POST",
          credentials: "include",
        });
        const data = await res.json(); // image link in cloudinary 
        console.log(data)
        if (!res.ok)
          throw new Error(data.message + "حدث خطأ" || "حدث خطأ أثناء الرفع");
        
        Swal.fire({
          title: "added!",
          text: "Your image has added successfully.",
          icon: "success",
        });
      } catch (err) {
        console.error(err);
        setError(err.message + " error uploading image");
      } finally {
        setLoading(false);
        setSelectedFile(null);
      }
    }
  };

  //============================================================================
  const theme = useTheme(); // قم بتعريف Media Queries لنقاط التوقف
  const isSmall = useMediaQuery(theme.breakpoints.up("sm")); // أكبر من أو يساوي 'sm'
  const isMedium = useMediaQuery(theme.breakpoints.up("md")); // أكبر من أو يساوي 'md' // حساب عدد الأعمدة بناءً على حجم الشاشة
  const getCols = () => {
    if (isMedium) return 3; // شاشة متوسطة أو أكبر (md+)
    if (isSmall) return 2; // شاشة صغيرة (sm)
    return 1; // شاشة صغيرة جداً (xs)
  };
  return (
    <Box component={"form"}>
      <Typography
        variant="h4"
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          mb: 4,
        }}
      >
        {" "}
        <Cloud sx={{ ml: 2, fontSize: 100 }} />
        Cloudinary Upload
      </Typography>
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
            choose Profile Picture
          </Button>
        </label>
        {error && <Typography color="error">{error}</Typography>}
        {preview && (
          <Box sx={{ mt: 2, textAlign: "center" }}>
            {loading ? (
              "loading"
            ) : (
              <Avatar
                src={preview}
                sx={{ width: 100, height: 100, mx: "auto" }}
              />
            )}
          </Box>
        )}
      </Grid>
      <Button
        onClick={(e) => {
          handleSubmit(e);
        }}
        variant="outlined"
        type="submit"
        sx={{
          m: "0 auto",
          display: "flex",
          mb: 5,
          borderColor: "#1976d2",
          color: "#1976d2",
          "&:hover": {
            borderColor: "#1565c0",
            backgroundColor: "rgba(25, 118, 210, 0.1)",
          },
        }}
      >
        upload
        <Upload />
      </Button>
      <Divider sx={{ mb: 5 }} component={"h3"}>
        <Chip sx={{ fontSize: "25px" }} label="All Photos" size="medium" />
      </Divider>
      {allImgs?.length < 1 && (
        <Typography sx={{ textAlign: "center" }}>
          No photos added yet{" "}
        </Typography>
      )}
      <ImageList
        sx={{ width: "100%", height: 600 }}
        cols={getCols()} // هذا هو الاستخدام الصحيح
        rowHeight={200}
        gap={7}
      >
        {allImgs &&
          allImgs.map((img) => {
            return (
              <Box key={img}>
                <ImageListItem>
                  {/* 1. السكلتون يظهر فقط إذا لم يتم التحميل */}
                  {!isLoaded && (
                    <Skeleton
                      variant="rectangular"
                      width="100%"
                      height={200}
                      sx={{ position: "absolute", top: 0, left: 0 }}
                    />
                  )}

                  <img
                    srcSet={`${img}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                    src={img}
                    alt={""}
                    loading="lazy"
                    style={{
                      maxHeight: "200px",
                      display: isLoaded ? "block" : "none",
                    }}
                    width={"cover"}
                    onLoad={() => setIsLoaded(true)} // تحديث الحالة عند اكتمال التحميل
                  />
                </ImageListItem>
                <Box
                  sx={{
                    height: "10%",
                    backgroundColor: "#12638773",
                    borderRadius: "0 0 20px 20px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <IconButton
                    onClick={() => {
                      // handledelete(img.split("/").pop());
                    }}
                    color="error"
                  >
                    {" "}
                    <Delete />
                  </IconButton>
                </Box>
              </Box>
            );
          })}
      </ImageList>
    </Box>
  );
};

export default CloudinarUploud;
