import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home as HomeIcon,
  EventNote as EventNoteIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Today as TodayIcon,
  ReviewsOutlined as ReviewsOutlinedIcon,
  SettingsOutlined as SettingsOutlinedIcon,
  LogoutOutlined as LogoutOutlinedIcon,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
// import "@fontsource/poppins"; // Import the Poppins font

const CustomTypography = styled(Typography)(({ theme }) => ({
  //   fontFamily: "Poppins, sans-serif", // Use Poppins font family
  fontWeight: "bold", // Customize the font weight
  fontSize: "0.9rem", // Customize the font size
  color: "#ffffff", // White text color
  "&.Mui-selected": {
    color: "#1976D2", // Blue text color when selected
  },
}));

const Sidebar = () => {
  const location = useLocation();

  // State to track the active item based on the current path
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  const buttonStyles = {
    width: "75%",
    padding: "12px 16px", // Add padding
    marginBottom: "10px", // Add margin between items
    letterSpacing: "0.5rem", // Add letter spacing
    "&:hover": {
      backgroundColor: "#1976D2", // Slightly darker blue when hovered
      borderRadius: "12px",
    },
    "&.Mui-selected": {
      backgroundColor: "rgba(255, 255, 255, 0.4)", // Slightly darker blue when hovered
      borderRadius: "12px",
      color: "#1976D2", // Blue text color when selected
      "& .MuiListItemIcon-root": {
        color: "#1976D2", // Blue icon color when selected
      },
    },
    "& .MuiListItemIcon-root": {
      color: "#ffffff", // White icon color
    },
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        flexShrink: 0,
        backgroundColor: "#2196f3", // Blue background color
        color: "#ffffff", // White text color
        "& .MuiDrawer-paper": {
          width: 240,
          boxSizing: "border-box",
          backgroundColor: "#16B4DD", // Blue background color
          color: "#ffffff", // White text color
        },
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem 0",
        }}
      >
        <img src="/logo2.png" alt="Logo" style={{ width: "10rem" }} />
      </div>
      <List
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <ListItemButton
          selected={activeItem === "/dashboard"}
          onClick={() => setActiveItem("/dashboard")}
          component={Link}
          to="/dashboard"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Dashboard</CustomTypography>
            }
          />
        </ListItemButton>

        {/* CALENDAR */}
        <ListItemButton
          selected={activeItem === "/calendar"}
          onClick={() => setActiveItem("/calendar")}
          component={Link}
          to="/calendar"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <TodayIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Calendar</CustomTypography>
            }
          />
        </ListItemButton>

        <ListItemButton
          selected={activeItem === "/listings"}
          onClick={() => setActiveItem("/listings")}
          component={Link}
          to="/listings"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Listings</CustomTypography>
            }
          />
        </ListItemButton>
        <ListItemButton
          selected={activeItem === "/reservation"}
          onClick={() => setActiveItem("/reservation")}
          component={Link}
          to="/reservation"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <EventNoteIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Reservation</CustomTypography>
            }
          />
        </ListItemButton>

        <ListItemButton
          selected={activeItem === "/reviews"}
          onClick={() => setActiveItem("/reviews")}
          component={Link}
          to="/reviews"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <ReviewsOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Reviews</CustomTypography>
            }
          />
        </ListItemButton>

        <ListItemButton
          selected={activeItem === "/settings"}
          onClick={() => setActiveItem("/settings")}
          component={Link}
          to="/settings"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <SettingsOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Settings</CustomTypography>
            }
          />
        </ListItemButton>

        <ListItemButton
          selected={activeItem === "/message"}
          onClick={() => setActiveItem("/message")}
          component={Link}
          to="/message"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Message</CustomTypography>
            }
          />
        </ListItemButton>
        <ListItemButton
          selected={activeItem === "/profile"}
          onClick={() => setActiveItem("/profile")}
          component={Link}
          to="/profile"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Profile</CustomTypography>
            }
          />
        </ListItemButton>

        <ListItemButton
          selected={activeItem === "/logout"}
          onClick={() => setActiveItem("/logout")}
          component={Link}
          to="/logout"
          sx={buttonStyles}
        >
          <ListItemIcon>
            <LogoutOutlinedIcon />
          </ListItemIcon>
          <ListItemText
            primary={
              <CustomTypography variant="body1">Logout</CustomTypography>
            }
          />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
