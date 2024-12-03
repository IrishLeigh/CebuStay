import * as React from "react";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import getDashboardTheme from "../../../Dashboard/dashboard/theme/getDashboardTheme";
import SideMenu from "../../../Dashboard/dashboard/components/SideMenu";
import TemplateFrame from "../../../Dashboard/dashboard/TemplateFrame";
import CalendarLayout from './components/calendarlayout';
import { Alert, Button, IconButton, Snackbar, useMediaQuery } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Dialog from "@mui/material/Dialog"; // Modal component
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate } from "react-router-dom";
import axios from 'axios';


export default function CalendarUI() {
  const [mode, setMode] = React.useState("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState("mainGrid");
  const [openDrawer, setOpenDrawer] = React.useState(false);
  const dashboardTheme = createTheme(getDashboardTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  const isMobile = useMediaQuery(showCustomTheme ? dashboardTheme.breakpoints.down('md') : defaultTheme.breakpoints.down('md'));
  const [openSnackbar, setOpenSnackbar] = React.useState(false); // Snackbar state
  const [openLogoutModal, setOpenLogoutModal] = React.useState(false); // Logout 
  const [token, setToken] = React.useState(localStorage.getItem("auth_token"));
  const [user, setUser] = React.useState(null);
  const navigate = useNavigate();
  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleDrawerToggle = () => {
    setOpenDrawer(prev => !prev);
  };

  React.useEffect(() => {
    const savedMode = localStorage.getItem("themeMode");
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setMode(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === "dark" ? "light" : "dark"; // Toggle mode
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme(prev => !prev);
  };

   // Handle modal visibility for log out confirmation
   const handleLogout = () => {
    setOpenLogoutModal(true);
  };

  const cancelLogout = () => {

    setOpenLogoutModal(false);
  };
  const handleSnackbarClose = () => {
    setOpenSnackbar(false);
  };
  const confirmLogout = async () => {
    try {
      // ("token FROM HEADER", console.logtoken);
      const res1 = await axios.post("http://127.0.0.1:8000/api/decodetoken", {
        token: token,
      });
      if (res1.data) {
        const res = await axios.post("http://127.0.0.1:8000/api/logout", {
          userid: res1.data.data.userid,
        });
        if (res.data) {
          // console.log(res.data);
          // Remove the token from local storage
          localStorage.removeItem("auth_token");
  
          // Optionally, reset any user-related state here if applicable
          setOpenSnackbar(true); 
          setOpenLogoutModal(false);
  
          // Delay navigation by 2 seconds to allow snackbar to show
          setTimeout(() => {
            navigate("/login");
          }, 2000);
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setOpenLogoutModal(false);
    }
  };

  return (
    <TemplateFrame
    toggleCustomTheme={toggleCustomTheme}
    showCustomTheme={showCustomTheme}
    mode={mode}
    toggleColorMode={toggleColorMode}
    drawerToggle={handleDrawerToggle} // Pass the drawer toggle function
  >
    <ThemeProvider theme={showCustomTheme ? dashboardTheme : defaultTheme}>
      <CssBaseline enableColorScheme />
      <Box sx={{ display: "flex", position: "relative" }}>
       <SideMenu 
        open={openDrawer} 
        onClose={handleDrawerClose} 
        onLogout={handleLogout} // Pass the logout handler
        user={user}
      /> 
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflow: "auto",
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "left",
                mx: 1,
                pb: 10,
                mt: { xs: 0, md: 0 },
              }}
            >
              <CalendarLayout  />
            </Stack>
          </Box>
        </Box>
        {/* Log out confirmation modal */}
        <Dialog
          open={openLogoutModal}
          onClose={cancelLogout}
        >
          <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to log out?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={cancelLogout} color="primary">
              Cancel
            </Button>
            <Button onClick={confirmLogout} color="secondary">
              Log Out
            </Button>
          </DialogActions>
        </Dialog>
         {/* Snackbar for logout success */}
         <Snackbar
          open={openSnackbar}
          autoHideDuration={3000} // Closes automatically after 3 seconds
          onClose={handleSnackbarClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleSnackbarClose} severity="success">
            You have successfully logged out.
          </Alert>
        </Snackbar>
      </ThemeProvider>
    </TemplateFrame>
  );
}
