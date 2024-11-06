import { createTheme } from '@mui/material/styles';

const BookingGuestTheme = createTheme({
  palette: {
    text: {
      primary: '#2A2A2E', // Primary text color
      secondary: '#555555', // Secondary text color
    },
    success: {
      main: '#4CAF50', // Set success color to green
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Set Poppins as the default font
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          padding: '2rem', // Padding inside Card
          borderRadius: '0.6rem',
          marginBottom: '1rem',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h6: {
          fontSize: '1.125rem',
          fontWeight: 'bold',
        },
        body1: {
          fontSize: '1rem',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#4CAF50', // Set border color to green when focused and success
          },
          '&.Mui-focused.Mui-error .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f44336', // Error state if needed
          },
        },
      },
    },
  },
  customStyles: {
    borderCard: {
      // border: '0.1rem solid rgba(0, 0, 0, 0.1)', // Custom style for borders
    },
    specialRequestTextField: {
      marginTop: '1rem', // Custom margin for text fields
    },
  },
});

export default BookingGuestTheme;
