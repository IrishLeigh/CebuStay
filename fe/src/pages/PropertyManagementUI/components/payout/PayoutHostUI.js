import * as React from 'react';
import { createTheme, ThemeProvider, alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import getDashboardTheme from '../../../Dashboard/dashboard/theme/getDashboardTheme';

import SideMenu from '../../../Dashboard/dashboard/components/SideMenu';
import TemplateFrame from '../../../Dashboard/dashboard/TemplateFrame';
import Payout from './components/Payout';

// Additional components for different menu items

export default function PayoutHostUI() {
  const [mode, setMode] = React.useState('light');
  const [showCustomTheme, setShowCustomTheme] = React.useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = React.useState('mainGrid'); // Default content
  const [openDrawer, setOpenDrawer] = React.useState(false);

  const dashboardTheme = createTheme(getDashboardTheme(mode));
  const defaultTheme = createTheme({ palette: { mode } });
  localStorage.setItem('themeMode', 'light');

  const handleDrawerClose = () => {
    setOpenDrawer(false);
  };

  const handleDrawerToggle = () => {
    setOpenDrawer((prev) => !prev);
  };


  React.useEffect(() => {
    const savedMode = localStorage.getItem('themeMode');
    if (savedMode) {
      setMode(savedMode);
    } else {
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setMode(systemPrefersDark ? 'light' : 'light');
    }
  }, []);

  const toggleColorMode = () => {
    const newMode = mode === 'light' ? 'light' : 'light';
    setMode(newMode);
    localStorage.setItem('themeMode', newMode);
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
      drawerToggle={handleDrawerToggle} // Pass the drawer toggle function
    >
      <ThemeProvider theme={showCustomTheme ? dashboardTheme : defaultTheme}>
        <CssBaseline enableColorScheme />
        <Box sx={{ display: 'flex' }}>
          <SideMenu 
            open={openDrawer} 
            onClose={handleDrawerClose} 
          />{/* Pass the callback */}
          <Box
            component="main"
            sx={(theme) => ({
              flexGrow: 1,
              backgroundColor: alpha(theme.palette.background.default, 1),
              overflow: 'auto',
            })}
          >
            <Stack
              spacing={2}
              sx={{
                alignItems: 'center',
                mx: 1,
                pb: 10,
                mt: { xs: 0, md: 0 },
              }}
            >

              <Payout/>
            </Stack>
          </Box>
        </Box>
      </ThemeProvider>
    </TemplateFrame>
  );
}
