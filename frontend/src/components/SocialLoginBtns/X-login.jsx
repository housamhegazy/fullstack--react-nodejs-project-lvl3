import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import { Twitter } from '@mui/icons-material'; // لا تزال الأيقونة تحمل اسم Twitter في مكتبة mui

const XLoginButton = () => {
  const handleXLogin = () => {
    // يوجه إلى مسار الواجهة الخلفية (Backend) لبدء المصادقة
    window.location.href = 'http://localhost:3000/auth/x'; 
  };
  
  return (
    <Box sx={{ my: 2 }}>
      <Button
        variant="contained"
        onClick={handleXLogin}
        startIcon={<Twitter />} // استخدام أيقونة Twitter التي تشبه أيقونة X
        sx={{
          backgroundColor: '#000000', // لون الخلفية الأسود لمنصة X
          color: 'white',
          '&:hover': {
            backgroundColor: '#333333', // لون أغمق عند التمرير
          },
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '25px', // حواف دائرية تتناسب مع تصميم X
          boxShadow: '0 2px 4px 0 rgba(0,0,0,.25)',
        }}
      >
        <Typography component="span" sx={{ ml: 1 }}>
          login by X 
        </Typography>
      </Button>
    </Box>
  );
};

export default XLoginButton;