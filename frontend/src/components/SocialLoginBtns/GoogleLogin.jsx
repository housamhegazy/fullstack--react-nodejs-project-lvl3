// زر الدخول عن طريق جوجل 
import { Google } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const GoogleLogin = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/auth/google'; // يوجه إلى نهاية الباك اند
  };
  return (
     <Box sx={{ my: 2 }}>
      <Button
        variant="contained"
        onClick={handleGoogleLogin}
        startIcon={<Google />}
        sx={{
          color: 'inherite',
          borderColor: '#ccc',
          '&:hover': {
             borderColor: '#999',
            backgroundColor: '#fafafa',
            color:"black"
          },
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,.15)',
        }}
      >
        <Typography component="span" sx={{ ml: 1 }}>
          Google Login
        </Typography>
      </Button>
    </Box>
  );
};

export default GoogleLogin;