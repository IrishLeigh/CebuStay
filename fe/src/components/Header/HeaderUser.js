import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import { CircularProgress } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useNavigate, Link } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu"; // Import the MUI icon
// import './NavigationBar.css'; // Import the CSS file
import axios from "axios";
const pages = ["Home", "Accommodation", "Contact us", "About us"];
const settings = ["Account", "Your Properties", "Logout"];

function HeaderUser({ token, setToken }) {
  const [loading, setLoading] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchUserImage = async () => {
      try {
        const jwtToken = token.split("=")[1];
        const res1 = await axios.post("http://127.0.0.1:8000/api/decodetoken", {
          token: token,
        });
        if (res1.data) {
          const res = await axios.get("http://127.0.0.1:8000/api/getuserimg", {
            params: { userid: res1.data.data.userid },
          });
          if (res.data) {
            setProfileImage(res.data.src);
          }
        }
      } catch (error) {
        console.error("Error fetching image:", error.message || error);
      }
    };

    fetchUserImage();
  }, []);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handlePageClick = (page) => {
    if (page === "Accommodation") {
      window.location.href = "/accommodation";
    } else {
      navigate(`/${page.toLowerCase().replace(" ", "-")}`);
    }
    handleCloseNavMenu();
  };

  const handleSettings = (setting) => {
    switch (setting) {
      case "Account":
        if (token) {
          navigate("/account");
        }
        break;
      case "Your Properties":
        navigate("/admin/overview");
        break;
      case "Logout":
        setOpenLogoutModal(true);
        break;
      default:
        break;
    }
    handleCloseUserMenu();
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const jwtToken = token.split("=")[1];
      const res1 = await axios.post("http://127.0.0.1:8000/api/decodetoken", {
        token: token,
      });
      if (res1.data) {
        // console.log(res1.data.data.userid);
        const res = await axios.post("http://127.0.0.1:8000/api/logout", {
          userid: res1.data.data.userid,
        });
        if (res.data) {
          console.log(res.data);
          localStorage.removeItem("auth_token");
          setToken(null);
          setOpenLogoutModal(false);
          setLoading(false);
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false);
  };

  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <img
                src="/Logo2.png"
                alt="Logo"
                className="logo"
                style={{ height: "40px", marginRight: "10px" }}
              />
              <Typography
                noWrap
                component="a"
                href="/"
                sx={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 1000,
                  color: "#16B4DD",
                  textDecoration: "none",
                  fontSize: "1.5rem",
                }}
              >
                cebustay
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1 }} />

            {/* Hamburger menu for mobile */}
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="open navigation"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                sx={{ color: "#16B4DD" }}
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
              >
                {pages.map((page) => (
                  <MenuItem key={page} onClick={() => handlePageClick(page)}>
                    <Typography textAlign="center">{page}</Typography>
                  </MenuItem>
                ))}
                <MenuItem onClick={() => handlePageClick("List your property")}>
                  <Typography textAlign="center">List your property</Typography>
                </MenuItem>
              </Menu>
            </Box>

            {/* Full menu for larger screens */}
            <Box sx={{ display: { xs: "none", md: "flex" } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  sx={{ mx: 1, color: "black" }}
                >
                  <Typography
                    sx={{ fontSize: "0.9rem", color: "#16B4DD" }}
                    fontWeight="bold"
                  >
                    {page}
                  </Typography>
                </Button>
              ))}
              <button className="property-listing">
                <Link
                  to="/list-property"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  List your property
                </Link>
              </button>
            </Box>
            {/* User profile settings */}
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar
                    alt="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    src={
                      profileImage
                        ? encodeURI(profileImage.trim()) // Remove extra spaces and encode the URL
                        : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                    }
                  />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting}
                    onClick={() => handleSettings(setting)}
                  >
                    <Typography textAlign="center">{setting}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Logout confirmation modal */}
      <Dialog
        open={openLogoutModal}
        onClose={handleCloseLogoutModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Logout Confirmation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseLogoutModal}
            color="primary"
            disabled={loading}
          >
            {loading ? "Logging out..." : "Cancel"}
          </Button>
          <Button
            onClick={handleLogout}
            color="primary"
            autoFocus
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Logout"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HeaderUser;
