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
  Grid,
  Breadcrumbs,
  Alert,
  CircularProgress,
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom"; // لتجنب إعادة تحميل الصفحة للروابط
import axios from "axios";
import Swal from "sweetalert2";
import { useGetUserProfileQuery } from "../Redux/userApi";

// قائمة الدول (ثابتة للعرض)
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

function Edite() {
  const { data: user, isLoading, isSuccess } = useGetUserProfileQuery();

  const { id } = useParams();
  const [customer, setcustomer] = useState({
    _id: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    age: "",
    country: "",
    gender: "",
  }); // State to store fetched customers
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null);

  // error of data
  const [dataError, setDatatError] = useState(null); // State for error messages
  const [success, setSuccess] = useState(null);
  // حالات للتحميل والأخطاء والنجاح
  const [loadingEdit, setLoadingEdit] = useState(false); // لإرسال التحديث أو الحذف
  const [loadingDelete, setloadingDelete] = useState(false); // لإرسال التحديث أو الحذف

  const navigate = useNavigate();

  // Function to fetch one customer
  const fetchcustomer = async () => {
    setError(null);
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:3000/api/edit/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setcustomer(response.data);
    } catch (err) {
      console.error("Failed to fetch customer:", err);
      setDatatError("Failed to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect to call fetchcustomers when the component mounts
  
  useEffect(() => {
    // تأكد من وجود ID قبل محاولة الجلب
    if(!user && !isLoading){
      navigate("/signin")
    }
    if (id) {
      fetchcustomer();
    } else {
      setLoading(false);
      setError("No customer ID provided in the URL.");
      navigate("/signin",{ replace: true })
    }
  }, [id]);

  // دالة لتحديث حالة النموذج عند تغيير حقول الإدخال
  const handleChange = (event) => {
    const { name, value } = event.target;
    setcustomer((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateEmail = (email) => {
    return /\S+@\S+\.\S+/.test(email);
  };
  //update function
  const updateFunc = async () => {
    setLoadingEdit(true);
    setDatatError(null); // مسح الأخطاء السابقة
    setSuccess(null); // مسح رسائل النجاح السابقة
    // Client-side validation (نفس منطق AddCustomer)
    const { firstName, lastName, email, phoneNumber, age, country, gender } =
      customer;
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phoneNumber ||
      !age ||
      !country ||
      !gender
    ) {
      setDatatError("الرجاء تعبئة جميع الحقول المطلوبة.");
      setLoadingEdit(false); // توقف التحميل عند وجود خطأ
      return;
    }
    if (!validateEmail(email)) {
      setDatatError("الرجاء إدخال بريد إلكتروني صالح.");
      setLoadingEdit(false);

      return;
    }
    const parsedPhoneNumber = String(phoneNumber); // تأكد أنها String قبل التحقق من الطول
    if (isNaN(Number(parsedPhoneNumber)) || parsedPhoneNumber.length < 9) {
      // استخدم Number() للتحقق الرقمي
      setDatatError(
        "الرجاء إدخال رقم هاتف صالح (على الأقل 9 أرقام ويتكون من أرقام فقط)."
      );
      setLoadingEdit(false);
      return;
    }
    const parsedAge = parseInt(age);
    if (isNaN(parsedAge) || parsedAge < 18 || parsedAge > 100) {
      setDatatError("الرجاء إدخال عمر صالح (بين 18 و 100).");
      setLoadingEdit(false);
      return;
    }
    try {
      await axios.put(
        `http://localhost:3000/api/editcustomer/${id}`,
        customer,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      setLoadingEdit(false);
      setSuccess("user updated succesfully");
      // Swal.fire({
      //   icon: "success",
      //   title: "Success!",
      //   text: "User has been updated successfully.",
      //   confirmButtonText: "OK",
      // });
      // navigate("/"); // الانتقال للصفحة الرئيسية بعد التحديث الناجح
    } catch (apiError) {
      console.error("Failed to update customer:", apiError);
      setDatatError(
        apiError.response?.data?.message ||
          "An error occurred while updating the user. Please try again."
      );
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: apiError.response?.data?.message || "Failed to update user.",
        confirmButtonText: "OK",
      });
    } finally {
      setLoadingEdit(false);
    }
  };

  // delete function
  const deleteFunc = async () => {
    // عرض رسالة التأكيد من SweetAlert2
    const result = await Swal.fire({
      title: "Are you sure?", // عنوان الرسالة
      text: "You won't be able to revert this!", // نص الرسالة
      icon: "warning", // أيقونة التحذير
      showCancelButton: true, // إظهار زر الإلغاء
      confirmButtonColor: "#d33", // لون الزر "نعم، احذف!" (أحمر)
      cancelButtonColor: "#3085d6", // لون الزر "إلغاء" (أزرق)
      confirmButtonText: "Yes, delete it!", // نص الزر "نعم، احذف!"
    });

    // إذا أكد المستخدم الحذف
    if (result.isConfirmed) {
      setloadingDelete(true); // بدء حالة التحميل للإرسال
      setDatatError(null);
      setSuccess(null);
      try {
        await axios.delete(`http://localhost:3000/api/allcustomers/${id}`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        // عرض رسالة نجاح بعد الحذف
        Swal.fire("Deleted!", "The customer has been deleted.", "success");
        navigate("/");
      } catch (err) {
        console.error("Failed to delete customer:", err);
        setDatatError("Failed to delete customer. Please try again later.");
        // عرض رسالة خطأ إذا فشل الحذف
        Swal.fire(
          "Error!",
          err.response?.data?.message || "Failed to delete customer.",
          "error"
        );
      } finally {
        setloadingDelete(false); // إنهاء حالة التحميل
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading customers...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }
  return (
    <Container component="main" maxWidth="md" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: { xs: 2, md: 4 },
          borderRadius: 2,
          boxShadow: 3,
          bgcolor: "background.paper",
          mt: 4,
        }}
      >
        {/* Breadcrumbs */}
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" />}
          aria-label="breadcrumb"
          sx={{ mb: 2, width: "100%", justifyContent: "flex-start" }}
        >
          <RouterLink
            color="inherit"
            to="/"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            Home
          </RouterLink>
          <Typography color="text.primary">
            {customer.firstName} {customer.lastName}
          </Typography>
        </Breadcrumbs>

        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 1, width: "100%", textAlign: "center" }}
        >
          Edit User
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ mb: 3, width: "100%", textAlign: "center" }}
        >
          ID: {customer._id}
        </Typography>

        {/* Form - with dummy values */}
        <Box
          component="form"
          onSubmit={(e) => {
            e.preventDefault();
            updateFunc();
          }}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          {dataError && (
            <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
              {dataError}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ width: "100%", mb: 2 }}>
              {success}
            </Alert>
          )}
          <Grid container spacing={3}>
            <Grid>
              <TextField
                margin="normal"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="given-name"
                value={customer.firstName}
                onChange={handleChange}
                error={!!dataError && !customer.firstName}
                helperText={
                  !!dataError && !customer.firstName
                    ? "first name required"
                    : ""
                }
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
                label="Last Name"
                name="lastName"
                autoComplete="family-name"
                value={customer.lastName}
                onChange={handleChange}
                error={!!dataError && !customer.lastName}
                helperText={
                  !!dataError && !customer.lastName ? "last name required" : ""
                }
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
                label="Email"
                name="email"
                autoComplete="email"
                value={customer.email}
                onChange={handleChange}
                error={!!dataError && !customer.email}
                helperText={
                  !!dataError && !customer.email ? " email required" : ""
                }
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
                label="Telephone"
                name="phoneNumber"
                autoComplete="tel"
                type="tel"
                value={customer.phoneNumber}
                onChange={handleChange}
                error={
                  !!dataError &&
                  (isNaN(+customer.phoneNumber) ||
                    customer.phoneNumber.length < 9)
                }
                helperText={
                  !!dataError &&
                  (isNaN(+customer.phoneNumber) ||
                    customer.phoneNumber.length < 9)
                    ? "correct phone Number required"
                    : ""
                }
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
                value={customer.age}
                onChange={handleChange}
                error={
                  !!dataError &&
                  (!customer.age ||
                    isNaN(+customer.age) ||
                    parseInt(customer.age) < 18 ||
                    parseInt(customer.age) > 100)
                }
                helperText={
                  !!dataError &&
                  (!customer.age ||
                    isNaN(+customer.age) ||
                    parseInt(customer.age) < 18 ||
                    parseInt(customer.age) > 100)
                    ? "Age should be between 18 and 100 "
                    : ""
                }
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
                  labelId="country-label"
                  id="country"
                  name="country"
                  value={customer.country}
                  label="Country"
                  onChange={handleChange}
                  error={!!dataError && !customer.country}
                >
                  <MenuItem value="" disabled>
                    Choose here ...
                  </MenuItem>
                  {country_list.map((country) => (
                    <MenuItem key={country} value={country}>
                      {country}
                    </MenuItem>
                  ))}
                </Select>
                {!!dataError && !customer.country && (
                  <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                    {" "}
                    Country required
                  </Typography>
                )}
              </FormControl>
            </Grid>
            <Grid>
              <FormControl margin="normal" required fullWidth>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                  labelId="gender-label"
                  id="gender"
                  name="gender"
                  value={customer.gender}
                  label="Gender"
                  onChange={handleChange}
                  error={!!dataError && !customer.gender}
                >
                  <MenuItem value="" disabled>
                    Choose here ...
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
                {!!dataError && !customer.gender && (
                  <Typography color="error" variant="caption" sx={{ ml: 2 }}>
                    gender required{" "}
                  </Typography>
                )}
              </FormControl>
            </Grid>
          </Grid>
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            <Button
              onClick={() => {
                updateFunc();
              }}
              type="button" // تغيير النوع إلى button لمنع إرسال الفورم
              variant="contained"
              color="primary"
              sx={{ flexGrow: 1 }}
              startIcon={
                loadingEdit ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {loadingEdit ? "in progress ...." : " update customer"}
            </Button>
            <Button
              onClick={() => {
                deleteFunc();
              }}
              type="button" // تغيير النوع إلى button
              variant="contained"
              color="error"
              sx={{ flexGrow: 1 }}
              startIcon={
                loadingDelete ? (
                  <CircularProgress size={20} color="inherit" />
                ) : null
              }
            >
              {loadingDelete ? "in progress ...." : " delete customer"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Edite;
