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
const pages = ["Home", "Accommodation"];
const settings = ["Account",  "Your Bookings", "Your Properties","Logout"];


function HeaderUser() {
  const [loading, setLoading] = useState(false);
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("auth_token");
  const [user ,setUser] = useState(null);

  const handleImageError = (e) => {
    // Fallback to another image or initials
    // alert("Failed to render image");
    e.target.src =
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    setProfileImage(
      "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
    );
  };

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


  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        try {
          const res = await axios.post("http://127.0.0.1:8000/api/decodetoken", {
            token: token,
          });
          if (res.data.message === "Expired token.") {
            handleLogout();
            console.log ("Expired token. Automatic Logout");
          }else {
            setUser(res.data);
            localStorage.setItem("email", res.data.data.email);
            localStorage.setItem("userid", res.data.data.userid);
            localStorage.setItem("firstname", res.data.data.firstname);
            localStorage.setItem("lastname", res.data.data.lastname);
            //local storage here
          }
        } catch (error) {
          console.log("Error decoding JWT token:", error);
          handleLogout();
        }
      };
      fetchUser();
    } else {
      setUser(null);
    }
  }, [token]);


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
      navigate("accommodation"); // Redirect to "accommodation";
    } else if (page === "List your property") {
      navigate("list-property"); // Redirect to the list property page
    }else if (page === "Home") {
      navigate("/");
    } else if (page === "Your Bookings") {
      navigate("/account");

    } else {
      navigate('/');
      
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
      
        case "Your Bookings":
        navigate("/account");
        break;
      case "Your Properties":
        navigate("/admin/listings");
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
    const token = localStorage.getItem("auth_token");
    if (!token) {
      console.log("No token found");
      localStorage.removeItem("auth_token");
      localStorage.setItem("auth_token", "");
      setOpenLogoutModal(false);
    }
    setLoading(true);
    try {
      console.log ("token FROM HEADER", token);
      const res1 = await axios.post("http://127.0.0.1:8000/api/decodetoken", {
        token: token,
      });
      if (res1.data) {
        const res = await axios.post("http://127.0.0.1:8000/api/logout", {
          userid: res1.data.data.userid,
        });
        if (res.data) {
          console.log(res.data);
          // Remove the token from local storage
          localStorage.removeItem("auth_token");
          
          // Optionally, reset any user-related state here if applicable
          // e.g., setUser(null); or use a context provider to reset user state
          
          setOpenLogoutModal(false);
          navigate("/login");
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      localStorage.removeItem("auth_token");
          localStorage.removeItem("email");
          localStorage.removeItem("firsname");
          localStorage.removeItem("lastname");
          localStorage.removeItem("userid");
          setUser(null);
          
          // Optionally, reset any user-related state here if applicable
          // e.g., setUser(null); or use a context provider to reset user state
          
          // setOpenLogoutModal(false);
          navigate("/login");
    }
  };
  

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false);
  };
console.log ("USER FROM HEADER NI SYA HA", user);
  return (
    <>
      <AppBar
        position="static"
        sx={{ backgroundColor: "white", color: "black" }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <a
                href="/"
                style={{
                  display: "flex",
                  alignItems: "center",
                  textDecoration: "none",
                }}
              >
                <img
                  src="/logo2.png"
                  alt="Logo"
                  className="logo"
                  style={{ height: "40px", marginRight: "10px" }}
                />
                <Typography
                  noWrap
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
              </a>
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
                      src={profileImage}
                      onError={(e) => handleImageError(e)}
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
                  {settings
                    .filter((setting) => {
                      // Filter out "Your Properties" if the user is not a Manager
                      return !(setting === "Your Properties" && user?.role !== "manager");
                    })
                    .map((setting) => (
                      <MenuItem
                        key={setting}
                        onClick={() => handleSettings(setting)}
                      >
                        <Typography textAlign="center">{setting}</Typography>
                      </MenuItem>
                    ))
                  }
                </Menu>
              </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Logout confirmation modal */}
      <Dialog
           open={openLogoutModal}
           onClose={handleCloseLogoutModal}
        >
    
       <DialogTitle>Confirm Logout</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to log out?
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
              <CircularProgress size={24} color="secondary" />
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
