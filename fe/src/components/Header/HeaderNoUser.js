import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';

const pages = ['Home', 'Accommodation', 'Contact us', 'About us'];

function HeaderNoUser() {
  const handlePageClick = (page) => {
    if (page === 'Accommodation') {
      window.location.href = '/accommodation'; // Redirect to accommodation page
    } else {
      window.location.href = `/${page.toLowerCase().replace(' ', '-')}`; // Redirect to other pages
    }
  };

  const handleSignUpClick = () => {
    window.location.href = '/register'; // Redirect to the register page
  };

  const handleLoginClick = () => {
    window.location.href = '/login'; // Redirect to the login page
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black', }} m={0} p={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <div className="logo">
            <img src="Logo.png" alt="Logo" /> 
          </div>

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
