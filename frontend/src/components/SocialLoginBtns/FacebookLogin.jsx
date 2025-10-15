// زر الدخول عن طريق جوجل 
import { Facebook } from '@mui/icons-material';
import { Box, Button, Typography } from '@mui/material';
import React from 'react';

const FacebooklogIn = () => {
  const handleFacebook = () => {
    window.location.href = 'http://localhost:3000/auth/facebook'; // يوجه إلى نهاية الباك اند
  };
  return (
     <Box sx={{ my: 2 }}>
      <Button
        variant="contained"
        onClick={handleFacebook}
        startIcon={<Facebook />}
        sx={{
          backgroundColor: '#4285F4',
          color: 'white',
          '&:hover': {
            backgroundColor: '#d8dee9ff',
            color:'#4285F4'
          },
          textTransform: 'none',
          fontSize: '1rem',
          fontWeight: 'bold',
          padding: '10px 20px',
          borderRadius: '5px',
          boxShadow: '0 2px 4px 0 rgba(0,0,0,.25)',
        }}
      >
        <Typography component="span" sx={{ ml: 1 }}>
          Facebook Login
        </Typography>
      </Button>
    </Box>
  );
};

export default FacebooklogIn;