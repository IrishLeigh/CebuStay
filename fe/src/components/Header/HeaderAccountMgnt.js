import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';

import Menu from '@mui/material/Menu';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from 'react-router-dom';
import './NavigationBar.css'; 
import { MenuItem } from '@mui/material';

export default function HeaderAccountMgnt() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
      <MenuItem onClick={handleMenuClose}>My account</MenuItem>
    </Menu>
  );

  return (
    <Box>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
            <IconButton size="large" aria-label="show 4 new mails" sx={{ color: '#A5A5A5' }}>
              <Badge badgeContent={4} sx={{ 
                '& .MuiBadge-badge': {
                  backgroundColor: '#16B4DD',
                  color: 'white',
                },
              }}>
                <MailIcon />
              </Badge>
            </IconButton>
            <IconButton
              size="large"
              aria-label="show 17 new notifications"
              sx={{ color: '#A5A5A5' }}
            >
              <Badge badgeContent={17} sx={{ 
                '& .MuiBadge-badge': {
                  backgroundColor: '#16B4DD',
                  color: 'white',
                },
              }}>
                <NotificationsIcon />
              </Badge>
            </IconButton>
            <button className="property-listing">
              <Link to="/list-your-property" style={{ textDecoration: 'none', color: 'inherit' }}>
                List your property
              </Link>
            </button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
