import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import RemoveIcon from '@mui/icons-material/Remove';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import { Button, Snackbar } from '@mui/material'; // Import Snackbar
import { useData } from '../../../components/registration_unit/registration_location/contextAddressData';
import '../../../components/Button/NextButton.css';
import AnimatePage from './AnimatedPage';

export default function BedroomDetails2({ onBedroomDetailsChange, parentBedroomDetails, handleNext, handleBack }) {
  const { bedroomQTY } = useData();
  const [bedrooms, setBedrooms] = useState([]);
  const [errors, setErrors] = useState({}); // Define errors state variable
  const [snackbarOpen, setSnackbarOpen] = useState(false); // Snackbar open state
  const [snackbarMessage, setSnackbarMessage] = useState(''); // Snackbar message

  // Initialize bedrooms based on parentBedroomDetails or bedroomQTY
  useEffect(() => {
    window.scrollTo(0, 0);
    if (parentBedroomDetails && parentBedroomDetails.length > 0) {
      setBedrooms(parentBedroomDetails);
    } else {
      initializeBedrooms(bedroomQTY);
    }
  }, [parentBedroomDetails, bedroomQTY]);

  // Initialize bedrooms array with specified number of rooms
  const initializeBedrooms = (numRooms) => {
    const initialBedrooms = Array.from({ length: numRooms }, () => ({
      singleBed: 0,
      doubleBed: 0,
      largeBed: 0,
      superLargeBed: 0,
    }));
    setBedrooms(initialBedrooms);
  };

  // Increment quantity of specified bed type in a specific bedroom
  const incrementQuantity = (index, type) => {
    setBedrooms((prevBedrooms) =>
      prevBedrooms.map((bedroom, idx) =>
        idx === index ? { ...bedroom, [type]: bedroom[type] + 1 } : bedroom
      )
    );
  };

  // Decrement quantity of specified bed type in a specific bedroom, ensuring non-negative values
  const decrementQuantity = (index, type) => {
    setBedrooms((prevBedrooms) =>
      prevBedrooms.map((bedroom, idx) =>
        idx === index ? { ...bedroom, [type]: Math.max(0, bedroom[type] - 1) } : bedroom
      )
    );
  };

  // Validate that at least one bed type is selected in each bedroom
  const validate = () => {
    const newErrors = {};
    bedrooms.forEach((bedroom, index) => {
      if (Object.values(bedroom).every((bed) => bed === 0)) {
        newErrors[index] = 'At least one bed type must be selected in each bedroom.';
      }
    });
    setErrors(newErrors); // Update errors state with new validation errors
    return newErrors;
  };

  // Handle next step, validating before proceeding
  const handleNextStep = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      // Update parent with latest bedroom details before proceeding
      onBedroomDetailsChange(bedrooms);
      // Proceed to the next step
      handleNext();
    } else {
      // Set Snackbar message for validation errors
      setSnackbarMessage('Please ensure each bedroom has at least one bed type selected.');
      setSnackbarOpen(true); // Open Snackbar
    }
  };

  // Handle back navigation
  const handleBackClick = () => {
    handleBack();
  };

  // Close Snackbar
  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md">
      <AnimatePage>
        <Box mt={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Bedroom Configuration
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mb={3}>
            Please select the number of beds for each bedroom.
          </Typography>
          {bedrooms.map((bedroom, index) => (
            <Paper
              elevation={3}
              sx={{
                mb: 4,
                p: "2rem",
                borderRadius: '0.8rem',
              }}
              key={index}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="bold">
                    Bedroom {index + 1}
                  </Typography>
                  {errors[index] && (
                    <Typography sx={{ color: 'red', fontSize: '0.875rem' }}>
                      {errors[index]}
                    </Typography>
                  )}
                </Grid>

                {/* Single Bed */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SingleBedIcon />
                    <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                      Single Bed
                    </Typography>
                    <IconButton onClick={() => incrementQuantity(index, 'singleBed')}>
                      <AddIcon />
                    </IconButton>
                    <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.singleBed}
                    </Typography>
                    <IconButton onClick={() => decrementQuantity(index, 'singleBed')}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Grid>

                {/* Double Bed */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SingleBedIcon />
                    <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                      Double Bed
                    </Typography>
                    <IconButton onClick={() => incrementQuantity(index, 'doubleBed')}>
                      <AddIcon />
                    </IconButton>
                    <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.doubleBed}
                    </Typography>
                    <IconButton onClick={() => decrementQuantity(index, 'doubleBed')}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Grid>

                {/* Large Bed */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SingleBedIcon />
                    <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                      Large Bed
                    </Typography>
                    <IconButton onClick={() => incrementQuantity(index, 'largeBed')}>
                      <AddIcon />
                    </IconButton>
                    <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.largeBed}
                    </Typography>
                    <IconButton onClick={() => decrementQuantity(index, 'largeBed')}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Grid>

                {/* Super Large Bed */}
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <SingleBedIcon />
                    <Typography variant="body1" sx={{ ml: 2, flexGrow: 1 }}>
                      Super Large Bed
                    </Typography>
                    <IconButton onClick={() => incrementQuantity(index, 'superLargeBed')}>
                      <AddIcon />
                    </IconButton>
                    <Typography sx={{ width: '2rem', textAlign: 'center' }}>
                      {bedroom.superLargeBed}
                    </Typography>
                    <IconButton onClick={() => decrementQuantity(index, 'superLargeBed')}>
                      <RemoveIcon />
                    </IconButton>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          ))}
        </Box>
      </AnimatePage>
      <div className="stepperFooter">
        <Button onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button onClick={handleNextStep} className="stepperNext">
          Next
        </Button>
      </div>

      {/* Snackbar for error messages */}
      <Snackbar
        open={snackbarOpen}
        onClose={handleSnackbarClose}
        message={snackbarMessage}
        autoHideDuration={6000}
      />
    </Container>
  );
}
