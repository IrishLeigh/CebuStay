// src/theme.js
import { createTheme } from '@mui/material/styles';

const BookingDetailsTheme = createTheme({
  palette: {
    primary: {
      main: '#16B4DD', // Main color for primary elements
    },
    secondary: {
      main: '#FF5722', // Main color for secondary elements
    },
    text: {
      primary: '#2A2A2E', // Primary text color
      secondary: '#555555', // Secondary text color
    },
    background: {
      default: '#F0F0F0', // Default background color
      paper: '#FFFFFF', // Paper background color
    },
  },
  typography: {
    fontFamily: 'Poppins',
    h1: {
      fontSize: '1.5rem',
      fontWeight: 'bold', // Ensures h1 is bold
    },
    h2: {
      fontSize: '1.125rem',
      fontWeight: 'bold', // Ensures h2 is bold
    },
    body1: {
      fontSize: '1rem',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          // border: '0.1rem solid rgba(0, 0, 0, 0.1)',
          padding: '2rem',
          
          borderRadius: '0.5rem',
          boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          backgroundColor: '#6A6A6A',
          color: '#fff',
          borderColor: '#6A6A6A',
          border: '1px solid',
          fontWeight: 'bold',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '1.5rem',
          fontWeight: 'bold', // Ensures h1 is bold
        },
        h2: {
          fontSize: '1.125rem',
          fontWeight: 'bold', // Ensures h2 is bold
        },
        h6: {
          fontSize: '1rem',
          fontWeight: 'bold', // Ensures h2 is bold
          color: '#2A2A2E',
        },
        body1: {
          fontSize: '1rem',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#6A6A6A', // Set Divider color
        },
      },
    },
  },
});

export default BookingDetailsTheme;
