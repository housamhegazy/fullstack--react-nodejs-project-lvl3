import React from "react";
import { Box, Container, Typography, Link, Divider, Grid } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import InstagramIcon from "@mui/icons-material/Instagram";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        
        py: 3,
        px: 2,
        ml: { sm: "240px" },
        mt: "auto",
        backgroundColor: (theme) =>
          theme.palette.mode === "dark"
            ? theme.palette.primary.main
            : theme.palette.background.default,
      }}
    >
      <Divider />

      <Container maxWidth="lg">
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 4,
          }}
        >
          {/* About Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              About Us
            </Typography>
            <Typography variant="body2" color="text.secondary">
              A brief description of your company or project.
            </Typography>
          </Box>
          {/* Links Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Link href="#" color="text.secondary" display="block">
              Home
            </Link>
            <Link href="#" color="text.secondary" display="block">
              About
            </Link>
            <Link href="#" color="text.secondary" display="block">
              Contact
            </Link>
          </Box>
          {/* Social Media Section */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Follow Us
            </Typography>
            <Link href="#" color="inherit" sx={{ mr: 1 }}>
              <FacebookIcon />
            </Link>
            <Link href="#" color="inherit" sx={{ mr: 1 }}>
              <TwitterIcon />
            </Link>
            <Link href="#" color="inherit">
              <InstagramIcon />
            </Link>
          </Box>
        </Box>
        {/* Copyright Section */}
        <Box mt={5}>
          <Typography variant="body2" color="text.secondary" align="center">
            {"© "}
            {new Date().getFullYear()} {"Your Company Name."}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;