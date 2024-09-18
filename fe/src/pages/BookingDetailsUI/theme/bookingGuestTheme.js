// src/bookingGuestTheme.js
import { createTheme } from '@mui/material/styles';
import BookingDetailsTheme from './theme'; // Import the base theme

const BookingGuestTheme = createTheme({
  ...BookingDetailsTheme, // Extend the base theme
  components: {
    ...BookingDetailsTheme.components,
    MuiCard: {
      styleOverrides: {
        root: {
          border: '0.1rem solid rgba(0, 0, 0, 0.1)',
          padding: '1rem',
          borderRadius: '0.6rem',
          boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#ccc', // Divider color
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h1: {
          fontSize: '1.125rem',
          fontWeight: 'bold', // Ensure h1 is bold
        },
        h2: {
          fontSize: '1.125rem',
          fontWeight: 'bold', // Ensure h2 is bold
        },
        body1: {
          fontSize: '1rem',
        },
      },
    },
  },
});

export default BookingGuestTheme;
