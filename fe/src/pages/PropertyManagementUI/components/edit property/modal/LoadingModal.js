import * as React from 'react';
import { Dialog, DialogContent, CircularProgress, Typography, Box } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Define a dark theme
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212',
    },
    text: {
      primary: '#fff',
    },
  },
});

const LoadingModal = ({ open }) => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Dialog
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        PaperProps={{
          style: {
            backgroundColor: '#333', // Dark background color
            color: '#fff', // White text color
            borderRadius: '8px',
          },
        }}
      >
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '2rem' }}>
          <CircularProgress color="inherit" />
          <Box mt={2}>
            <Typography variant="h6">Saving, please wait...</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
};

export default LoadingModal;
