// theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: 'Poppins, sans-serif', // Apply Poppins font globally
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif', // Apply Poppins font to TextField
          '& .MuiInputLabel-root': {
            color: '#333', // Default label color
            '&.Mui-focused': {
              color: '#16B4DD', // Focused label color (same as border)
            },
          },
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#ccc', // Default border color
            },
            '&:hover fieldset': {
              borderColor: '#16B4DD', // Hovered border color
            },
            '&.Mui-focused fieldset': {
              borderColor: '#16B4DD', // Focused border color
            },
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif', // Apply Poppins font to Button
          backgroundColor: '#16B4DD', // Default background color
          color: 'white', // Default text color
          borderRadius: '8px', // Default border radius
          '&:hover': {
            backgroundColor: '#15A1C6', // Darker shade for hover
            color: 'white', // Ensure text color remains white on hover
          },
          '&:active': {
            backgroundColor: '#0D8ABF', // Even darker shade for active state
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#A334CF', // Color when checked
          },
          '&:hover': {
            backgroundColor: 'transparent', // Prevent background color change on hover
          },
        },
      },
    },
    MuiRadio: {
      styleOverrides: {
        root: {
          '&.Mui-checked': {
            color: '#A334CF', // Color when selected
          },
          '&:hover': {
            backgroundColor: 'transparent', // Prevent background color change on hover
          },
        },
      },
    },
    MuiStepper: {
      styleOverrides: {
        root: {
          '& .MuiStep-root': {
            '& .MuiStepIcon-root': {
              color: '#16B4DD', // Default color for all step icons
            },
            '&.Mui-active .MuiStepIcon-root': {
              color: '#16B4DD', // Color for active step icon
            },
            '&.Mui-completed .MuiStepIcon-root': {
              color: '#A334CF', // Color for completed step icon
            },
          },
        },
        connector: {
          '&.MuiStepConnector-root': {
            '& .MuiStepConnector-line': {
              borderColor: '#A334CF', // Default color for connector line
            },
            '&.Mui-active .MuiStepConnector-line': {
              borderColor: '#A334CF', // Color for connector line when active
            },
            '&.Mui-completed .MuiStepConnector-line': {
              borderColor: '#A334CF', // Color for connector line when completed
            },
          },
        },
      },
    },
  },
});

export default theme;
