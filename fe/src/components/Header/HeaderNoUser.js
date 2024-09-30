import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import './NavigationBar.css';
import { useNavigate } from 'react-router-dom';

const pages = ['Home', 'Accommodation'];

function HeaderNoUser() {
  const navigate = useNavigate();
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
  };

  const handleSignUpClick = () => {
    window.location.href = 'register'; // Redirect to the register page
  };

  const handleLoginClick = () => {
    window.location.href = 'login'; // Redirect to the login page
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', }} m={0} p={0}>
      <Container maxWidth={false} sx={{ maxWidth: '1600px' }}>
        <Toolbar disableGutters>
        <Box sx={{ display: "flex", alignItems: "center" }}>
  <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
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

          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            {pages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageClick(page)}
                sx={{ mx: 1, color: 'black' }}
              >
                <Typography sx={{ fontSize: "0.9rem", color:'#16B4DD' }} fontWeight="bold">{page}</Typography>
              </Button>
            ))}
          </Box>

          <button className="sign-in" onClick={handleLoginClick}>Log In</button>
          <button className="sign-in" onClick={handleSignUpClick}>Sign Up</button>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default HeaderNoUser;
