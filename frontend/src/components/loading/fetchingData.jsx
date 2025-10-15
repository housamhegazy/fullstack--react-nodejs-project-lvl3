import { Box, CircularProgress, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles"; 
// شاشة تحميل كاملة تظهر أثناء انتظار الـ loader
const FetchingdataLoader = () => {
  const theme = useTheme()
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
      bgcolor: theme.palette.mode === "dark" ? "#001E3C" : "white", // تصحيح المقارنة
        color: theme.palette.text.primary, // استخدام لون النص من الـ theme
      }}
    >
      <CircularProgress sx={{ mb: 2 }} color="primary" />
      <Typography variant="h6"> Fetching Data ........... </Typography>
      <Typography variant="body2"> please wait </Typography>
    </Box>
  );
};

export default FetchingdataLoader;
