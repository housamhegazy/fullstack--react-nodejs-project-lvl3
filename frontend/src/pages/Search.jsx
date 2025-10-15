import React, { useEffect, useState } from "react";
import {
  Container,
  Box,
  Typography,
  CssBaseline,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Alert,
  CircularProgress,
} from "@mui/material";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { useGetUserProfileQuery } from "../Redux/userApi";
import Swal from "sweetalert2";

function Search() {
  const { data: user, isLoading, isSuccess } = useGetUserProfileQuery();

  const location = useLocation(); // لتغيير قيمة البحث في عنوان ال url اثناء تغيير البحث
  const [searchResults, setSearchResults] = useState([]); // نتائج البحث التي تم جلبها من الباك اند
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [backendMessage, setBackendMessage] = useState(null); // <--- إضافة حالة لرسالة الـ Backend
  const [currentSearchValue, setCurrentSearchValue] = useState(""); //input value

  //===============================================================================
  //FETCH SEARCH Result
  const fetchSearchResults = async () => {
    const params = new URLSearchParams(location.search); // استخراج query parameters
    const searchTerm = params.get("svalue"); // الحصول على قيمة المعامل 'svalue'
    setCurrentSearchValue(searchTerm || ""); // لتخزين وعرض مصطلح البحث الحالي
    setBackendMessage(null); // <--- مسح الرسالة السابقة عند جلب بيانات جديدة
    setSearchResults([]); // مسح النتائج السابقة
    setLoading(true);
    setError(null);
    try {
      // إذا لم يكن هناك searchTerm، Backend الخاص بك سيعالج ذلك (إرجاع الكل أو لا شيء)
      const response = await axios.get(
        `http://localhost:3000/api/search?svalue=${encodeURIComponent(
          searchTerm || ""
        )}`,
        {
          headers: { Authorization: `Bearer ${user.token}` },
        }
      );
      // <--- التحقق هنا مما إذا كانت الاستجابة تحتوي على 'message'
      if (response.data && response.data.message) {
        setBackendMessage(response.data.message);
      } else {
        setSearchResults(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch search results:", err);
      setError(
        err.response?.data?.message ||
          "Failed to load search results. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };
  const navigate = useNavigate()
  useEffect(() => {
    fetchSearchResults();
    if(!user){
    navigate("/signin",{ replace: true })
  }
  }, [location.search,user]);

  // delete function
  const deleteFunc = async (id) => {
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
      try {
        await axios.delete(`http://localhost:3000/api/allcustomers/${id}`, {
          headers: {
            Authorization: `Bearer ${user.token}`, // إرسال التوكن في رأس الطلب
          },
        });
        fetchSearchResults();
        // عرض رسالة نجاح بعد الحذف
        Swal.fire("Deleted!", "The customer has been deleted.", "success");
      } catch (err) {
        console.error("Failed to delete customer:", err);
        setError("Failed to delete customer. Please try again later.");
      } finally {
        console.log("done");
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
          flexDirection: "column",
        }}
      >
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Searching...</Typography>
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
    <Container component="main" maxWidth="lg" sx={{ py: 4 }}>
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
        <Typography
          component="h1"
          variant="h4"
          sx={{ mb: 4, width: "100%", textAlign: "center" }}
        >
          Search Results{" "}
          {currentSearchValue ? `for "${currentSearchValue}"` : ""}{" "}
          {/* تحديث العنوان */}
        </Typography>
        {/* <--- عرض رسالة الـ Backend إذا كانت موجودة */}
        {backendMessage && (
          <Alert severity="info" sx={{ mt: 2 }}>
            {backendMessage}
          </Alert>
        )}
        {/* <--- عرض الجدول فقط إذا كانت هناك نتائج بحث وليس هناك رسالة من الـ Backend */}

        {!backendMessage && searchResults?.length > 0 ? (
          <TableContainer component={Paper} sx={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="search results table">
              <TableHead>
                <TableRow>
                  <TableCell>#</TableCell>
                  <TableCell>Full Name</TableCell>
                  <TableCell>Gender</TableCell>
                  <TableCell>Country</TableCell>
                  <TableCell>Age</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {searchResults.map((user, index) => (
                  <TableRow key={user._id}>
                    <TableCell component="th" scope="row">
                      {index + 1}
                    </TableCell>
                    <TableCell>
                      {user.firstName} {user.lastName}
                    </TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.country}</TableCell>
                    <TableCell>{user.age}</TableCell>
                    <TableCell align="center">
                      <Button
                        component={RouterLink}
                        to={`/view/${user._id}`} // Link to a dummy view page
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ minWidth: 0, p: "5px", mr: 1 }}
                        title="View details"
                      >
                        <VisibilityIcon fontSize="small" />
                      </Button>
                      <Button
                        component={RouterLink}
                        to={`/edite/${user._id}`} // Link to a dummy edit page
                        variant="contained"
                        color="primary"
                        size="small"
                        sx={{ minWidth: 0, p: "5px", mr: 1 }}
                        title="Edit user"
                      >
                        <EditIcon fontSize="small" />
                      </Button>
                      <Button
                        onClick={() => deleteFunc(user._id)}
                        variant="contained"
                        color="error"
                        size="small"
                        sx={{ minWidth: 0, p: "5px" }}
                        title="Delete user"
                        // No onClick handler as per requirement for no functions
                      >
                        <DeleteIcon fontSize="small" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          // <--- عرض رسالة "No customers found" فقط إذا لم تكن هناك رسالة من الـ Backend
          // وهذا يعني أن البحث تم بقيمة غير فارغة ولكن لا توجد نتائج
          !backendMessage && (
            <Typography variant="h6" color="text.secondary" sx={{ mt: 4 }}>
              No customers found matching your search.
            </Typography>
          )
        )}
      </Box>
    </Container>
  );
}

export default Search;
