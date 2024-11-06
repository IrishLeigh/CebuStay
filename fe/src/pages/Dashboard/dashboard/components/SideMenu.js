import React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import OptionsMenu from './OptionsMenu';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { drawerClasses } from '@mui/material/Drawer';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper, // Ensure drawer uses background color from theme
  },
}));

export default function SideMenu({ onLogout, open, onClose }) {
  const navigate = useNavigate(); // Initialize useNavigate
  const theme = useTheme(); // Get the theme
  const token = localStorage.getItem("auth_token");
  const user = localStorage.getItem("userData");
  const email = localStorage.getItem("email");
  const firstname = localStorage.getItem("firstname") || "";
  const lastname = localStorage.getItem("lastname") || "";
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Check if the screen size is mobile

  const mainListItems = [
    { text: 'Overview', icon: <HomeRoundedIcon />, path: '/admin/overview' },
    { text: 'Calendar', icon: <AnalyticsRoundedIcon />, path: '/admin/calendar' },
    { text: 'Your Guests', icon: <PeopleRoundedIcon />, path: '/admin/guests' },
    { text: 'Your Properties', icon: <AssignmentRoundedIcon />, path: '/admin/listings' },
    { text: 'Your Payouts', icon: <InfoRoundedIcon />, path: '/admin/payouts' },
  ];

  const handleMenuItemClick = (path) => {
    navigate(path);
    if (isMobile) {
      onClose(); // Close the drawer when a menu item is clicked on mobile
    }
  };

  return (
    <Drawer
      variant={isMobile ? "temporary" : "permanent"} // Keep UI intact: temporary for mobile, permanent for desktop
      open={isMobile ? open : true} // Always open on desktop
      onClose={isMobile ? onClose : undefined} // Only use onClose for mobile
      ModalProps={{ keepMounted: true }} // Better performance on mobile
    >
      <Box
        sx={{
          display: 'flex',
          mt: '60px',
          p: 2,
          justifyContent: 'left',
          alignItems: 'center',
        }}
      >
        <img src="/logo2.png" alt="Logo" style={{ height: '3rem' }} />
        <Typography
          noWrap
          component="a"
          href="/"
          sx={{
            fontFamily: 'Poppins, sans-serif',
            fontWeight: 1000,
            color: '#16B4DD',
            textDecoration: 'none',
            fontSize: '1.5rem',
            ml: 1,
          }}
        >
          cebustay
        </Typography>
      </Box>
      <Divider />
      <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
        <List dense>
          {mainListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={() => handleMenuItemClick(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Stack>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
              mr: 2,
            }}
          >
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: '16px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
            >
              {`${firstname} ${lastname}`}
            </Typography>
            <Tooltip title={email}>
              <Typography
                variant="caption"
                sx={{
                  color: 'text.secondary',
                  textOverflow: 'ellipsis',
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  maxWidth: '150px',
                }}
              >
                {email}
              </Typography>
            </Tooltip>
          </Box>
          <OptionsMenu onLogout={onLogout} />
        </Box>
      </Stack>
    </Drawer>
  );
}
