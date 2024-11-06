import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './NavigationBar.css';

export default function HeaderAccountMgnt() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const navigate = useNavigate();
  const pages = ["Home", "Accommodation"];

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handlePageClick = (page) => {
    if (page === 'Accommodation') {
      window.location.href = 'accommodation';
    } else if (page === 'Home') {
      navigate('/');
    } else {
      navigate(`/${page.toLowerCase().replace(' ', '-')}`);
    }
    handleCloseNavMenu();
  };

  return (
    <Box sx={{ width: '100%' }}>
      <AppBar position="static" sx={{ backgroundColor: 'white', color: 'black' }}>
        <Toolbar sx={{ justifyContent: 'flex-end' }}>  {/* Align content to the right */}
          {/* For mobile - shows the "Menu" button */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' }, justifyContent: 'flex-end' }}>
            <Button
              onClick={handleOpenNavMenu}
              sx={{ color: 'black', textTransform: 'none' }}
            >
              <Typography sx={{ fontSize: '0.9rem', color: '#16B4DD' }} fontWeight="bold">
                Menu
              </Typography>
            </Button>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((page) => (
                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                  <Typography textAlign="center">{page}</Typography>
                </MenuItem>
              ))}
              <MenuItem>
                <Link to="/list-property" style={{ textDecoration: 'none', color: 'inherit' }}>
                  List your property
                </Link>
              </MenuItem>
            </Menu>
          </Box>

          {/* For desktop - shows the menu items directly */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end', flexGrow: 1 }}>
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

        </Toolbar>
      </AppBar>
    </Box>
  );
}
