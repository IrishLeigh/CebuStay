import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate, Link } from 'react-router-dom';
import './NavigationBar.css'; // Import the CSS file from '../NavigationBar.css';

const pages = ['Home', 'Accommodation', 'Contact us', 'About us'];
const settings = ['Account', 'Your Properties', 'Logout'];

function HeaderUser({ token, setToken }) {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [openLogoutModal, setOpenLogoutModal] = useState(false);
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

  const handlePageClick = (page) => {
    if (page === 'Accommodation') {
      window.location.href = '/accommodation'; // Redirect to accommodation page
    } else {
      navigate(`/${page.toLowerCase().replace(' ', '-')}`); // Client-side navigation
    }
    handleCloseNavMenu();
  };

  const handleSettings = (setting) => {
    switch (setting) {
      case 'Account':
        if (token) {
          navigate('/account');
        }
        break;
      case 'Your Properties':
        navigate('/admin/overview');
        break;
      case 'Logout':
        setOpenLogoutModal(true);
        break;
      default:
        break;
    }
    handleCloseUserMenu();
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setToken(null);
    navigate('/login');
    setOpenLogoutModal(false);
  };

  const handleCloseLogoutModal = () => {
    setOpenLogoutModal(false);
  };

  console.log("token from header user:", token);
  return (
    <>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <div className="header-logo">
              <img src="Logo.png" alt="Logo"/>
            </div>

            <Box sx={{ flexGrow: 1 }} />

            <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page}
                  onClick={() => handlePageClick(page)}
                  sx={{ mx: 1, color: 'black' }}
                >
                  <Typography sx={{ fontSize: "0.9rem", color: '#16B4DD' }} fontWeight="bold">
                    {page}
                  </Typography>
                </Button>
              ))}

              <button className="property-listing">
                <Link to="/list-property" style={{ textDecoration: 'none', color: 'inherit' }}>
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

      <Dialog
        open={openLogoutModal}
        onClose={handleCloseLogoutModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Logout Confirmation"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to logout?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseLogoutModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleLogout} color="primary" autoFocus>
            Logout
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default HeaderUser;