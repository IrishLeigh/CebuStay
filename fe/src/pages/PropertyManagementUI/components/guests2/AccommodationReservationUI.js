import * as React from "react";
import { createTheme, ThemeProvider, alpha } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import getDashboardTheme from "../../../Dashboard/dashboard/theme/getDashboardTheme";

import SideMenu from "../../../Dashboard/dashboard/components/SideMenu";
import TemplateFrame from "../../../Dashboard/dashboard/TemplateFrame";

// Additional components for different menu items

import AccommodationReservation from "./components/AccommodationReservation";
export default function AccommodationReservationUI() {
  const [mode, setMode] = React.useState("light");
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState("mainGrid"); // Default content

  const dashboardTheme = createTheme(getDashboardTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });

  React.useEffect(() => {
    const savedMode = "light";
    if (savedMode) {
      setMode("light");
    } else {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setMode("light");
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = "light";
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  const toggleCustomTheme = () => {
    setShowCustomTheme((prev) => !prev);
  };

  return (
    <TemplateFrame
      toggleCustomTheme={toggleCustomTheme}
      showCustomTheme={showCustomTheme}
      mode={mode}
      toggleColorMode={toggleColorMode}
    >
      <ThemeProvider theme={showCustomTheme ? dashboardTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: "flex" }}>
          <SideMenu setSelectedMenuItem={setSelectedMenuItem} />{" "}
          {/* Pass the callback */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflow: "auto",
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: "center",
                mx: 1,
                pb: 10,
                mt: { xs: 9, md: 0 },
              }}
            >
              {/* <Header /> */}
              {/* {renderContent()} Render the content based on selected menu item */}
              <AccommodationReservation />
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </TemplateFrame>
  );
}
