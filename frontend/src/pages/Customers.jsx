import {
  Alert,
  Box,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Delete, Edit, RemoveRedEye } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios"; // استيراد Axios
import Swal from "sweetalert2";
import { useGetUserProfileQuery } from "../Redux/userApi";
import LoadingPage from "../components/loading/loadingPage";
const Customers = () => {
  const localTheme = localStorage.getItem("localTheme");
const defaultMode = localTheme === null ? "light" : localTheme === "light" ? "light" : "dark";
  //احضرت بيانات المستخدم حتى يتم ارسالها عند طلب عرض بيانات العملاء
  const { data: user, isLoading, isSuccess } = useGetUserProfileQuery();
      // const userData = useLoaderData(); 
      // const isAuthenticated = useSelector(state => state.auth.isAuthenticated);

  const navigate = useNavigate();
  const [customers, setcustomers] = useState([]); // State to store fetched customers
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages

  // Function to fetch all customers
  const fetchcustomers = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(
        "http://localhost:3000/api/allcustomers",{ headers: {
          Authorization: `Bearer ${user.token}`, // إرسال التوكن في رأس الطلب
        },
      }
      );
      setcustomers(response.data);
    } catch (err) {
      console.error("Failed to fetch customers:", err);
      setError("Failed to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // useEffect to call fetchcustomers when the component mounts
  useEffect(() => {
    if (!user && !isLoading) {
            navigate('/signin', { replace: true });
        }
    fetchcustomers();
  }, []); // Empty dependency array means this runs once on mount

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
        await axios.delete(
          `http://localhost:3000/api/allcustomers/${id}`,{ headers: {
            Authorization: `Bearer ${user.token}`, // إرسال التوكن في رأس الطلب
          },  
        }
        );
        fetchcustomers();
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
if(loading){
  return(<>
    <LoadingPage mode={defaultMode}/>
  </>)
}
  if(customers.length < 1){
    return (
      <Typography
        sx={{ textAlign: "center" }}
        component={"h4"}
        variant="h6"
        color="inherit"
      >
        {" "}
        No Customers Yet , Add New from <Link to={"./AddCustomer"}>Here</Link> 
      </Typography>
    )
  }
  return (
    <Box>
      <Typography
        sx={{ textAlign: "center" }}
        component={"h4"}
        variant="h6"
        color="inherit"
      >
        {" "}
        All Customers 
      </Typography>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="caption table">
          <caption>housam hegazy 2025</caption>
          <TableHead>
            <TableRow>
              <TableCell align="center">Name</TableCell>
              <TableCell align="center">Age</TableCell>
              <TableCell align="center">Phone Number</TableCell>
              <TableCell align="center">Country</TableCell>
              <TableCell align="center">Email</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => {
              return (
                <TableRow key={customer._id}>
                  <TableCell align="center" component="th" scope="row">
                    {customer.firstName} {customer.lastName}
                  </TableCell>
                  <TableCell align="center">{customer.age}</TableCell>
                  <TableCell align="center">{customer.phoneNumber}</TableCell>
                  <TableCell align="center">{customer.country}</TableCell>
                  <TableCell align="center">{customer.email}</TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <IconButton
                        onClick={() => {
                          navigate(`./view/${customer._id}`);
                        }}
                      >
                        <RemoveRedEye />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          navigate(`./edite/${customer._id}`);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          deleteFunc(customer._id);
                        }}
                      >
                        <Delete color="error" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default Customers;
