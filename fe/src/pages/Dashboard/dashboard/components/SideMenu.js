import * as React from 'react';
import { styled } from '@mui/material/styles';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import AnalyticsRoundedIcon from '@mui/icons-material/AnalyticsRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import AssignmentRoundedIcon from '@mui/icons-material/AssignmentRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import OptionsMenu from './OptionsMenu';
import CardAlert from './CardAlert';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Tooltip } from '@mui/material';
import axios from 'axios';

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});


export default function SideMenu({onLogout }) {
  const navigate = useNavigate(); // Initialize useNavigate
  // const [ user, setUser ] = React.useState({
  //   firstname: '',
  //   lastname: '',
  //   email: '',
  // });
  const token = localStorage.getItem("auth_token");
  const user = localStorage.getItem("userData");
  const email =localStorage.getItem("email");
  const firstname =localStorage.getItem("firstname") || "";
  const lastname = localStorage.getItem("lastname") || "";
  
  // React.useEffect(() => {
  //   if (token) {
  //     const fetchUser = async () => {
  //       try {
  //         const res = await axios.post("http://127.0.0.1:8000/api/decodetoken", {
  //           token: token,
  //         });
  //         setUser(res.data.data);
  //         console.log("USER:", res.data.data);
  //       } catch (error) {
  //         alert("Error decoding JWT token:", error);
  //       }
  //     };

  //     fetchUser();
  //   } else {
  //     setUser(null);
  //   }
  // }, []); // Add token as a dependency

  const mainListItems = [
    { text: 'Overview', icon: <HomeRoundedIcon />, path: '/admin/overview' },
    { text: 'Calendar', icon: <AnalyticsRoundedIcon />, path: '/admin/calendar' },
    { text: 'Your Guests', icon: <PeopleRoundedIcon />, path: '/admin/guests' },
    { text: 'Your Properties', icon: <AssignmentRoundedIcon />, path: '/admin/listings' },
  ];

  const secondaryListItems = [
    { text: 'Settings', icon: <SettingsRoundedIcon />, path: '/admin/settings' },
    { text: 'About', icon: <InfoRoundedIcon />, path: '/admin/about' },
    { text: 'Feedback', icon: <HelpRoundedIcon />, path: '/admin/feedback' },
  ];

  const handleMenuItemClick = (path) => {
    navigate(path); // Use navigate to change route
  };

  console.log ("user", user);
  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
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
       <img src="/logo2.png" alt="Logo" style={{  height: '3rem' }}/> 
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

        {/* <List dense>
          {secondaryListItems.map((item, index) => (
            <ListItem key={index} disablePadding sx={{ display: 'block' }}>
              <ListItemButton onClick={() => handleMenuItemClick(item.path)}>
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List> */}
      </Stack>

      {/* <CardAlert /> */}
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
        {/* <Avatar
          sizes="small"
          alt="Riley Carter"
          src="/static/images/avatar/7.jpg"
          sx={{ width: 36, height: 36 }}
        /> */}
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          width: '100%', 
         
        }}
      >
        {/* User information */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden', // Ensures text overflow handling
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            mr: 2 // Adds some margin to separate the user info and OptionsMenu
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ fontWeight: 500, lineHeight: '16px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}
          >
            {`${firstname} ${lastname}`}
          </Typography>

          {/* Tooltip to display full email on hover */}
          <Tooltip title={user?.email}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary', 
                textOverflow: 'ellipsis', 
                overflow: 'hidden', 
                whiteSpace: 'nowrap',
                maxWidth: '150px' // Adjust maxWidth based on available space
              }}
            >
              {email}
            </Typography>
          </Tooltip>
        </Box>

        {/* OptionsMenu component */}
        <OptionsMenu onLogout={onLogout} />
      </Box>

      </Stack>
    </Drawer>
  );
}
