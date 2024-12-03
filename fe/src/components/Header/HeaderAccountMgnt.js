import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import HomeIcon from '@mui/icons-material/Home';
import HotelIcon from '@mui/icons-material/Hotel';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddBusinessIcon from '@mui/icons-material/AddBusiness';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from '@mui/material/Button';
import './NavigationBar.css';

export default function HeaderAccountMgnt() {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract the current view from the URL's query parameter
  const queryParams = new URLSearchParams(location.search);
  const currentView = queryParams.get('view') || 'account'; // Default to 'account' if no view is present

  // Function to change the view by updating the query parameter
  const handlePageClick = (link) => {
    navigate(link); // Navigate to the specified link
  };

  // Update the pagesMobile and pages based on currentView
  const pagesMobile = [
    { name: 'Home', icon: <HomeIcon />, link: '/' },
    { name: 'Find Your Stay', icon: <HotelIcon />, link: '/accommodation' },
    { name: 'List Property', icon: <AddBusinessIcon />, link: '/list-property' },
    {
      name: currentView === 'account' ? 'My Bookings' : 'Account', // Toggle label based on current view
      icon: <AccountCircleIcon />,
      link: currentView === 'account' ? '/account?view=bookings' : '/account?view=account', // Toggle link based on current view
    },
  ];

  const pages = [
    { name: 'Home', icon: <HomeIcon />, link: '/' },
    { name: 'Find Your Stay', icon: <HotelIcon />, link: '/accommodation' },
    { name: 'List Property', icon: <AddBusinessIcon />, link: '/list-property' },
    {
      name: currentView === 'account' ? 'My Bookings' : 'Account',
      icon: <AccountCircleIcon />,
      link: currentView === 'account' ? '/account?view=bookings' : '/account?view=account',
    },
  ];

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* For Mobile: Only Icons with Small Text */}
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' }, // Visible on mobile only
              flexDirection: 'row', // Row layout for icons
              justifyContent: 'space-around',
              alignItems: 'center',
              width: '100%',
              padding: 1,
            }}
          >
            {pagesMobile.map((page) => (
              <Box
                key={page.name}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <IconButton
                  onClick={() => handlePageClick(page.link)}
                  sx={{ color: '#16B4DD' }}
                >
                  {page.icon}
                </IconButton>
                <Typography
                  sx={{
                    fontSize: '0.7rem',
                    color: 'black',
                    textAlign: 'center',
                  }}
                >
                  {page.name}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* For Desktop: Full Menu */}
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' }, // Visible on desktop only
              justifyContent: 'flex-end',
              flexGrow: 1,
            }}
          >
            {pages.map((page) => (
              <Button
                key={page.name}
                onClick={() => handlePageClick(page.link)}
                sx={{ mx: 1, color: 'black' }}
              >
                <Typography
                  sx={{ fontSize: '0.9rem', color: '#16B4DD' }}
                  fontWeight="bold"
                >
                  {page.name}
                </Typography>
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
