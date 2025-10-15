import React, { useEffect, useState } from 'react';
import {
  Container, Box, Typography,
  Grid, Breadcrumbs, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
  Alert,
  CircularProgress
} from '@mui/material';

import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
import { format, formatDistanceToNow } from 'date-fns'; // لاستخدام تنسيق التاريخ
import axios from 'axios'; 
import { useGetUserProfileQuery } from '../Redux/userApi';


function View() {
      const { data: user, isLoading, isSuccess } = useGetUserProfileQuery();
  
  const {id} = useParams()
  const [customer, setcustomer] = useState(null); // State to store fetched customers
  const [loading, setLoading] = useState(true); // State for loading indicator
  const [error, setError] = useState(null); // State for error messages

  // Function to fetch all customers
  const fetchcustomer = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      const response = await axios.get(
        `http://localhost:3000/api/allcustomers/${id}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`, // إرسال التوكن في رأس الطلب
          },
        }
      );
      setcustomer(response.data);
    } catch (err) {
      console.error("Failed to fetch customer:", err);
      setError("Failed to load customers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };


const navigate = useNavigate()

  // useEffect to call fetchcustomers when the component mounts
  useEffect(() => {
    // تأكد من وجود ID قبل محاولة الجلب
    if (id) {
      fetchcustomer();
    } else {
      setLoading(false);
      setError("No customer ID provided in the URL.");
      navigate("/signin",{ replace: true })

    }
  }, []); 

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
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: { xs: 2, md: 4 },
            borderRadius: 2,
            boxShadow: 3,
            bgcolor: 'background.paper',
            mt: 4,
          }}
        >
          {/* Breadcrumbs */}
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
            sx={{ mb: 2, width: '100%', justifyContent: 'flex-start' }}
          >
            <RouterLink color="inherit" to="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              Home
            </RouterLink>
            <Typography color="text.primary">
              {customer.firstName} {customer.lastName}
            </Typography>
          </Breadcrumbs>

          <Box sx={{ width: '100%', mb: 4, textAlign: 'center' }}>
            <Typography component="h1" variant="h4" sx={{ mb: 1 }}>
              User Details
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              ID: {id}
            </Typography>
          </Box>

          {/* User Details Table */}
          <TableContainer component={Paper} sx={{ width: '100%' }}>
            <Table aria-label="user details table">
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ width: '30%' }}>First Name</TableCell>
                  <TableCell>{customer.firstName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Last Name</TableCell>
                  <TableCell>{customer.lastName}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Telephone</TableCell>
                  <TableCell>{customer.phoneNumber}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Email</TableCell>
                  <TableCell>{customer.email}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Gender</TableCell>
                  <TableCell>{customer.gender}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Age</TableCell>
                  <TableCell>{customer.age}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Country</TableCell>
                  <TableCell>{customer.country}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Created On</TableCell>
                  <TableCell>{format(new Date(customer.createdAt), 'MM/dd/yyyy')}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">Last Update</TableCell>
                  <TableCell>{formatDistanceToNow(new Date(customer.updatedAt), { addSuffix: true })}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>

  );
}

export default View;