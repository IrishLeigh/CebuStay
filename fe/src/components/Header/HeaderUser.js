import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import NavigationBar from '../NavigationBar.css';
import { useNavigate, Link } from 'react-router-dom';

const pages = ['Home', 'Accommodation', 'Contact us', 'About us'];
const settings = ['Profile', 'Account', 'Bookings', 'Listing','Logout'];

function HeaderUser({ token, setToken }) {
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

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
//  const handleLogout = () => {
//     // Clear JWT token from local storage
//     localStorage.removeItem('auth_token');
//     // Update token state to null
//     setToken(null);
//     // Navigate to login page or perform any additional logout tasks
//     navigate('/login');
//   };
const handleSettings = (setting) => {
  switch (setting) {
    case 'Profile':
      // Only navigate to profile if the user is authenticated
      if (token) {
        navigate('/profile');
      }
      break;
    case 'Bookings':
      navigate('/');
      break;
    case 'Logout':
      localStorage.removeItem('auth_token');
      setToken(null);
      navigate('/login');
      break;
    default:
      // Add handling for other settings if needed
      break;
  }
};
  
  console.log("token from header user:", token);
  return (
    <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
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
                onClick={handleCloseNavMenu}
                sx={{ mx: 1, color: 'black' }}
              >
                <Typography sx={{ fontSize: "0.9rem",color:'#16B4DD' }} fontWeight="bold">{page}</Typography>
              </Button>
            ))}



            <button className="property-listing">
              <Link to="/aregister" style={{ textDecoration: 'none', color: 'inherit' }}>
                List your property
              </Link>
            </button>

          </Box>
          
          
          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt="Remy Sharp" src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleSettings(setting)}>
                <Typography textAlign="center">{setting}</Typography>
              </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default HeaderUser;
