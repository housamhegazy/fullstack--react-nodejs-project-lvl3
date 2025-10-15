import { Box, CircularProgress, Typography } from "@mui/material";
// شاشة تحميل كاملة تظهر أثناء انتظار الـ loader
const LoadingPage = ({ mode }) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: mode === "dark" ? "#001E3C" : "white", 
        color: mode === "dark" ? "white" : "black", 
      }}
    >
      <CircularProgress sx={{ mb: 2 }} color="primary" />
      <Typography variant="h6"> Loading ........... </Typography>
      <Typography variant="body2"> please wait </Typography>
    </Box>
  );
};

export default LoadingPage;
