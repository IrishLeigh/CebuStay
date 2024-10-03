import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import "./NavigationBar.css";
import LoginIcon from "@mui/icons-material/Login";
import AssignmentIcon from "@mui/icons-material/Assignment";
const pages = ["Home", "Accommodation"];

function HeaderNoUser() {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handlePageClick = (page) => {
    if (page === "Accommodation") {
      navigate("accommodation");
    } else if (page === "Home") {
      navigate("/");
    } else {
      navigate("/");
    }
  };

  const handleSignUpClick = () => {
    window.location.href = "register";
  };

  const handleLoginClick = () => {
    window.location.href = "login";
  };

  const handleOpenMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "white", color: "black" }}
      m={0}
      p={0}
    >
      <Container maxWidth={false} sx={{ maxWidth: "1600px" }}>
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

          {/* For large screens */}
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
            <Button
              onClick={handleLoginClick}
              sx={{
                mx: 1,
                width: "90px",
                color: "white",
                backgroundColor: "#F9CC41",
                textTransform: "none", // Ensure text is not capitalized
                fontFamily: "Poppins, sans-serif", // Set font to Poppins
                "&:hover": {
                  backgroundColor: "#e3b931",
                },
              }}
            >
              Log In
            </Button>
            <Button
              onClick={handleSignUpClick}
              sx={{
                mx: 1,
                width: "90px",
                color: "white",
                backgroundColor: "#F9CC41",
                textTransform: "none", // Ensure text is not capitalized
                fontFamily: "Poppins, sans-serif", // Set font to Poppins
                "&:hover": {
                  backgroundColor: "#e3b931",
                },
              }}
            >
              Sign Up
            </Button>
          </Box>

          {/* For small screens */}
          <Box
            sx={{ display: { xs: "flex", md: "none" }, alignItems: "center" }}
          >
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              open={Boolean(anchorEl)}
              onClose={handleCloseMenu}
            >
              <MenuItem
                onClick={handleLoginClick}
                sx={{
                  color: "white",
                  backgroundColor: "#16B4DD",
                  my: 0.35, // Add margin between items
                  mx: 0.5,
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "#e3b931",
                  },
                }}
              >
                <LoginIcon sx={{ mr: 1.5 }} />
                <Typography textAlign="center">Log In</Typography>
              </MenuItem>
              <MenuItem
                onClick={handleSignUpClick}
                sx={{
                  color: "white",
                  backgroundColor: "#16B4DD",
                  my: 0.35, // Add margin between items
                  mx: 0.5,
                  borderRadius: "5px",
                  "&:hover": {
                    backgroundColor: "#e3b931",
                  },
                }}
              >
                <AssignmentIcon sx={{ mr: 1.5 }} />
                <Typography textAlign="center">Sign Up</Typography>
              </MenuItem>
              {pages.map((page) => (
                <MenuItem
                  key={page}
                  onClick={() => {
                    handlePageClick(page);
                    handleCloseMenu();
                  }}
                  sx={{ my: 0.35 }} // Add margin between items
                >
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default HeaderNoUser;
