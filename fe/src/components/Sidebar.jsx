import { Drawer, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  // State to track the active item based on the current path
  const [activeItem, setActiveItem] = useState(location.pathname);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location.pathname]);

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        marginTop: "75px",
        "& .MuiDrawer-paper": {
          width: 240,
          marginTop: "75px",
          boxSizing: "border-box",
        },
      }}
    >
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
          paddingLeft: "20px",
        }}
      >
        <ListItemButton
          selected={activeItem === "/listings"}
          onClick={() => setActiveItem("/listings")}
          component={Link}
          to="/listings"
        >
          <ListItemText primary="Listings" />
        </ListItemButton>
        <ListItemButton
          selected={activeItem === "/reservation"}
          onClick={() => setActiveItem("/reservation")}
          component={Link}
          to="/reservation"
        >
          <ListItemText primary="Reservation" />
        </ListItemButton>
        <ListItemButton
          selected={activeItem === "/message"}
          onClick={() => setActiveItem("/message")}
          component={Link}
          to="/message"
        >
          <ListItemText primary="Message" />
        </ListItemButton>
        <ListItemButton
          selected={activeItem === "/profile"}
          onClick={() => setActiveItem("/profile")}
          component={Link}
          to="/profile"
        >
          <ListItemText primary="Profile" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
