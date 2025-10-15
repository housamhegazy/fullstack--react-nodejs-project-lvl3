import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress, // لإظهار مؤشر تحميل
  Grid, // لاستخدام نظام الشبكة (Grid system) الخاص بـ MUI
} from "@mui/material";
import axios from "axios"; // استيراد Axios
import Swal from "sweetalert2"; // لاستخدام SweetAlert2
import { useNavigate } from "react-router-dom";
import { useGetUserProfileQuery } from "../Redux/userApi";
import { useTheme } from "@mui/material/styles";
// قائمة الدول كما كانت في كود EJS
const country_list = [
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Anguilla",
  "Antigua &amp; Barbuda",
  "Argentina",
  "Armenia",
  "Aruba",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bermuda",
  "Bhutan",
  "Bolivia",
  "Bosnia &amp; Herzegovina",
  "Botswana",
  "Brazil",
  "British Virgin Islands",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Cape Verde",
  "Cayman Islands",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Congo",
  "Cook Islands",
  "Costa Rica",
  "Cote D Ivoire",
  "Croatia",
  "Cruise Ship",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Estonia",
  "Ethiopia",
  "Falkland Islands",
  "Faroe Islands",
  "Fiji",
  "Finland",
  "France",
  "French Polynesia",
  "French West Indies",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Gibraltar",
  "Greece",
  "Greenland",
  "Grenada",
  "Guam",
  "Guatemala",
  "Guernsey",
  "Guinea",
  "Guinea Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hong Kong",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Isle of Man",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jersey",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kuwait",
  "Kyrgyz Republic",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Macau",
  "Macedonia",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Montserrat",
  "Morocco",
  "Mozambique",
  "Namibia",
  "Nepal",
  "Netherlands",
  "Netherlands Antilles",
  "New Caledonia",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "Norway",
  "Oman",
  "Pakistan",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Puerto Rico",
  "Qatar",
  "Reunion",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Pierre &amp; Miquelon",
  "Samoa",
  "San Marino",
  "Satellite",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "South Africa",
  "South Korea",
  "Spain",
  "Sri Lanka",
  "St Kitts &amp; Nevis",
  "St Lucia",
  "St Vincent",
  "St. Lucia",
  "Sudan",
  "Suriname",
  "Swaziland",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor L'Este",
  "Togo",
  "Tonga",
  "Trinidad &amp; Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Turks &amp; Caicos",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "Uruguay",
  "Uzbekistan",
  "Venezuela",
  "Vietnam",
  "Virgin Islands (US)",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

function AddCustomer() {
    const navigate = useNavigate(); // تهيئة useNavigate
    const { data: user, isLoading, isSuccess } = useGetUserProfileQuery();
  useEffect(() => {
    if (!user && !isLoading) {
      navigate("/signin", { replace: true });
      return
    }

    if (isLoading) {
      return
    }
  
  }, []);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    country: "",
    gender: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    // Client-side validation
    const { firstName, lastName, email, phoneNumber, age, country, gender } =
      formData;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !age ||
      !country ||
      !gender
    ) {
      setError("الرجاء تعبئة جميع الحقول المطلوبة.");
      setLoading(false);
      return;
    }
    if (!validateEmail(email)) {
      setError("الرجاء إدخال بريد إلكتروني صالح.");
      setLoading(false);
      return;
    }
    if (isNaN(+phoneNumber) || phoneNumber.length < 9) {
      // افتراض: رقم الهاتف يجب أن يكون رقمي وطوله لا يقل عن 9
      setError("الرجاء إدخال رقم هاتف صالح.");
      setLoading(false);
      return;
    }
    if (isNaN(+age) || parseInt(age) < 18 || parseInt(age) > 100) {
      // افتراض: العمر بين 18 و 100
      setError("الرجاء إدخال عمر صالح (18-100).");
      setLoading(false);
      return;
    }

    //add customers
    try {
      // إرسال البيانات إلى الـ backend
      await axios.post(
        "http://localhost:3000/api/addcustomers",
        formData,
        // إضافة التوكن (بيانات المستخدم الحالي ) إلى رأس الطلب إذا كان موجودًا
        user && user.token ? {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        } : {}
      );
      setSuccess("User added successfully!");
      // مسح النموذج بعد الإضافة الناجحة
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        age: "",
        country: "",
        gender: "",
      });
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "User has been added successfully.",
        confirmButtonText: "OK",
      });
      navigate("/");
    } catch (apiError) {
      console.error(
        "API Error:",
        apiError.response ? apiError.response.data : apiError.message
      );
      setError(
        apiError.response &&
          apiError.response.data &&
          apiError.response.data.message
          ? apiError.response.data.message // رسالة خطأ من الـ backend
          : "An error occurred while adding the user. Please try again."
      );
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          apiError.response &&
          apiError.response.data &&
          apiError.response.data.message
            ? apiError.response.data.message
            : "Failed to add user.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: 2, md: 4 }, // بادينج متغير حسب حجم الشاشة
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
          mt: 4, // margin-top
        }}
      >
        <Typography component="h1" variant="h4" sx={{ mb: 3 }}>
          Add New Customer
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

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <Grid container spacing={3}>
            {" "}
            {/* استخدام Grid بدلاً من Divs لتنظيم الصفوف والأعمدة */}
            <Grid>
              {" "}
              {/* يأخذ 12 عمود على الشاشات الصغيرة، 6 على المتوسطة فما فوق */}
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="firstName"
                name="firstName"
                autoComplete="given-name"
                autoFocus
                value={formData.firstName}
                onChange={handleChange}
                error={!!error && !formData.firstName}
                helperText={
                  !!error && !formData.firstName ? "first name required" : ""
                }
              
                // التعديل المطلوب: تغيير لون الـ Label
                InputLabelProps={{
                    sx: {
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص الافتراضي للـ Label (أزرق غامق)
                        // يمكنك إضافة تغيير اللون عند التركيز هنا
                        '&.Mui-focused': {
                            color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص عند التركيز
                        },
                    },
                }}
              />
            </Grid>
            <Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                id="lastName"
                label="lastName"
                name="lastName"
                autoComplete="family-name"
                value={formData.lastName}
                onChange={handleChange}
                error={!!error && !formData.lastName}
                helperText={
                  !!error && !formData.lastName ? "last name required" : ""
                }
                // التعديل المطلوب: تغيير لون الـ Label
                InputLabelProps={{
                    sx: {
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص الافتراضي للـ Label (أزرق غامق)
                        // يمكنك إضافة تغيير اللون عند التركيز هنا
                        '&.Mui-focused': {
                            color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص عند التركيز
                        },
                    },
                }}
              />
            </Grid>
            <Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                error={!!error && !validateEmail(formData.email)}
                helperText={
                  !!error && !validateEmail(formData.email)
                    ? "email required"
                    : ""
                }
                // التعديل المطلوب: تغيير لون الـ Label
                InputLabelProps={{
                    sx: {
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص الافتراضي للـ Label (أزرق غامق)
                        // يمكنك إضافة تغيير اللون عند التركيز هنا
                        '&.Mui-focused': {
                            color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص عند التركيز
                        },
                    },
                }}
              />
            </Grid>
            <Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                id="phoneNumber"
                label="phoneNumber"
                name="phoneNumber"
                autoComplete="tel"
                type="tel" // نوع الإدخال لهواتف الجوال
                value={formData.phoneNumber}
                onChange={handleChange}
                error={
                  !!error &&
                  (isNaN(+formData.phoneNumber) ||
                    formData.phoneNumber.length < 9)
                }
                helperText={
                  !!error &&
                  (isNaN(+formData.phoneNumber) ||
                    formData.phoneNumber.length < 9)
                    ? "correct phone Number required"
                    : ""
                }
                // التعديل المطلوب: تغيير لون الـ Label
                InputLabelProps={{
                    sx: {
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص الافتراضي للـ Label (أزرق غامق)
                        // يمكنك إضافة تغيير اللون عند التركيز هنا
                        '&.Mui-focused': {
                            color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص عند التركيز
                        },
                    },
                }}
              />
            </Grid>
            <Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                id="age"
                label="age"
                name="age"
                type="number"
                inputProps={{ min: 18, max: 100 }} // تحديد الحد الأدنى والأقصى للعمر
                value={formData.age}
                onChange={handleChange}
                error={
                  !!error &&
                  (!formData.age ||
                    isNaN(+formData.age) ||
                    parseInt(formData.age) < 18 ||
                    parseInt(formData.age) > 100)
                }
                helperText={
                  !!error &&
                  (!formData.age ||
                    isNaN(+formData.age) ||
                    parseInt(formData.age) < 18 ||
                    parseInt(formData.age) > 100)
                    ? "Age should be between 18 and 100 "
                    : ""
                }
                // التعديل المطلوب: تغيير لون الـ Label
                InputLabelProps={{
                    sx: {
                        color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص الافتراضي للـ Label (أزرق غامق)
                        // يمكنك إضافة تغيير اللون عند التركيز هنا
                        '&.Mui-focused': {
                            color: (theme) => theme.palette.mode === 'dark' ? '#ffffffff' : '#02083dff', // لون النص عند التركيز
                        },
                    },
                }}
              />
            </Grid>
            <Grid>
              <FormControl margin="normal" required fullWidth>
                <InputLabel id="country-label">Country</InputLabel>
                <Select
                  sx={{ minWidth: "100px" }}
                  labelId="country-label"
                  id="country"
                  name="country"
                  value={formData.country}
                  label="Country"
                  onChange={handleChange}
                  error={!!error && !formData.country}
                >
                  <MenuItem value="" disabled>
                    choose...
                  </MenuItem>
                  {country_list.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
                {!!error && !formData.country && (
                  <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                    {" "}
                    Country required
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid>
              <FormControl margin="normal" required fullWidth>
                <InputLabel id="gender-label">gender</InputLabel>
                <Select
                  sx={{ width: "100px" }}
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={formData.gender}
                  label="gender"
                  onChange={handleChange}
                  error={!!error && !formData.gender}
                >
                  <MenuItem value="" disabled>
                    choose...
                  </MenuItem>
                  <MenuItem value="Male">male</MenuItem>
                  <MenuItem value="Female">female</MenuItem>
                </Select>
                {!!error && !formData.gender && (
                  <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                    gender required{" "}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
            startIcon={
              loading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {loading ? "in progress ...." : " add customer"}
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddCustomer;
