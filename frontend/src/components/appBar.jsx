import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  Avatar,
  IconButton,
  Box,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search } from "@mui/icons-material";
import { useSelector } from "react-redux";

const AppBarComponent = ({ handleDrawerToggle, drawerWidth }) => {
  // @ts-ignore
  const authState = useSelector((state) => state.auth);
  const user = authState?.user; // <--- هنا بيانات المستخدم!
  const isLoadingAuth = authState?.isLoadingAuth; // حالة التحقق الأولي من المصادقة
  const isAuthenticated = authState?.isAuthenticated;
//===========================================================================
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const [helperText, setHelperText] = useState("");
  const [IsError, setIsError] = useState(false);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?svalue=${encodeURIComponent(searchValue.trim())}`); //svalue = قيمة البحث
      // encodeURIComponent: مهم جدًا لضمان أن المسافات والأحرف الخاصة يتم ترميزها بشكل صحيح في الـ URL
    } else {
      setHelperText("value required");
      setIsError(true); // تفعيل وضع الخطأ لـ TextField
    }
    setSearchValue("");
  };

  const handleOnchange = (e) => {
    setSearchValue(e.target.value);
    // مسح رسالة الخطأ وحالة الخطأ بمجرد أن يبدأ المستخدم في الكتابة
    if (IsError) {
      setHelperText("");
      setIsError(false);
    }
  };

  return (
    <Box component={"header"}>
      <AppBar position="static">
        <Toolbar sx={{ marginLeft: { sm: `${drawerWidth}px` } }}>
          <IconButton sx={{ color: "white", display: { sm: "none" } }} onClick={handleDrawerToggle}>
            <MenuIcon
              fontSize="large"
            />
          </IconButton>
          <Box
            style={{
              flexGrow: 1,
            }}
          >
          </Box>
          {/* conditional rendering based on user authentication */}
          {!isAuthenticated && !isLoadingAuth && (
            <>
              <Button
                color="inherit"
                variant="text"
                onClick={() => navigate("/signin")}
              >
                Signin
              </Button>

              <Button
                color="inherit"
                variant="text"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </>
          )}

          {/* search  */}

          {isAuthenticated && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                mr: 6,

                // قد تحتاج لضبط الهوامش أو العرض هنا لتناسب التصميم العام للـ AppBar
              }}
              component={"form"}
              onSubmit={handleSearchSubmit}
            >
              <TextField
                onChange={handleOnchange}
                // لا نحتاج لـ sx={{ mr: 2 }} هنا لأنهما أصبحا مدمجين
                id="integrated-search" // id جديد لهذا الـ TextField
                label="Search" // تسمية أقصر مناسبة لدمج الزر
                type="search"
                value={searchValue}
                variant="outlined" // Filled أو Outlined تبدو أفضل للدمج
                helperText={helperText}
                error={IsError}
                InputLabelProps={{
                  sx: {
                    color: "white", // <--- Custom color for the label
                    fontWeight: "bold",
                    // You can also style different states, e.g., when focused:
                    // '&.Mui-focused': {
                    //   color: 'darkblue',
                    // },
                    // // For the label in error state (overriding default red)
                    // '&.Mui-error': {
                    //   color: 'orange',
                    // },
                  },
                }}
                // إضافة InputProps هنا لدمج الزر
                InputProps={{
                  // Adornment في نهاية حقل الإدخال
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        type="submit" // لا يزال يمكن أن يكون type="submit" داخل form
                        aria-label="search customer"
                        onClick={handleSearchSubmit} // استدعاء الدالة هنا لزر الأيقونة
                        edge="end"
                        sx={{ mr: -1.5 }} // لضبط المسافة بين الأيقونة وحافة حقل النص
                      >
                        <Search /> {/* أيقونة البحث */}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                // إذا كنت تريد أن يكون حقل البحث أكبر قليلاً
                sx={{
                  "& .MuiInputBase-input": {
                    color: "white", // Or any color you want
                    opacity: 1, // To ensure it's not faded out (default browser behavior)
                  },
                  margin:"5px 0",
                  width: { xs: "150px", sm: "150px", md: "250px" }, // مثال لتعديل العرض

                }}
              />
            </Box>
          )}

          <Link
            to={"/profile"}
            style={{ textDecoration: "none", color: "inherit", marginRight: 10 }}
          >
            {user ? user.fullName : ""}
          </Link>
          <Avatar
            sx={{ cursor: "pointer" }}
            alt={user?user.fullName:""}
            src= {user? user.avatar? user.avatar : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" :""}
          />
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default AppBarComponent;
