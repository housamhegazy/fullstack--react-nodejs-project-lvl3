import { Outlet } from "react-router";
import AppBar from "./components/appBar";
import Footer from "./components/Footer";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import getDesignTokens from "./styles/theme";
import { useMemo, useState } from "react";
import ResponsiveDrawer from "./components/Drawer";
import { Box } from "@mui/material";

//drawer width
const drawerWidth = 240;

const Root = () => {
  //open and close drawer functions
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  //#####################################
  //theme functions
  // ###############################
  //get theme from local storage
  const localTheme = localStorage.getItem("localTheme");
  //set initial theme
  const [mode, setmode] = useState(
    localTheme === null ? "light" : localTheme === "light" ? "light" : "dark"
  );

  //memoize theme لانه بيمنع تكرار تغيير الثيم مع كل تحميل للصفحات واستهلاك الباندويدز
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);
  //change theme function
  const handleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setmode(newMode);
    localStorage.setItem("localTheme", newMode);
  };
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="root">
        <AppBar
          handleDrawerToggle={handleDrawerToggle}
          drawerWidth={drawerWidth}
        />
        <ResponsiveDrawer
          {...{
            mobileOpen,
            handleDrawerToggle,
            handleDrawerClose,
            handleDrawerTransitionEnd,
            drawerWidth,
            theme,
            handleTheme,
          }}
        />

        <Box
          component={"main"}
          sx={{
            ml: { sm: `${drawerWidth}px` },
            width: { sm: `calc(100% - ${drawerWidth}px)` },
            p: 3,
            minHeight: "calc(100vh - 64px)",
            padding: "20px",
            marginTop: "20px",
            flex: 1,
          }}
        >
          <Outlet />
        </Box>
        <Footer/>
      </div>
    </ThemeProvider>
  );
};

export default Root;