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
import { Button, RadioGroup, FormControlLabel, Radio, Snackbar, Divider, useTheme, useMediaQuery } from '@mui/material'; // Added necessary imports
import { useData } from '../../../components/registration_unit/registration_location/contextAddressData';
import '../../../components/Button/NextButton.css';
import AnimatePage from './AnimatedPage';

export default function BedroomDetails2({ onBedroomDetailsChange, parentBedroomDetails, handleNext, handleBack }) {
  const { bedroomQTY } = useData();
  const [bedrooms, setBedrooms] = useState([]);
  const [errors, setErrors] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Check if the screen size is mobile

  useEffect(() => {
    window.scrollTo(0, 0);
    if (parentBedroomDetails && parentBedroomDetails.length > 0) {
      setBedrooms(parentBedroomDetails);
    } else {
      initializeBedrooms(bedroomQTY);
    }
  }, [parentBedroomDetails, bedroomQTY]);

  const initializeBedrooms = (numRooms) => {
    const initialBedrooms = Array.from({ length: numRooms }, () => ({
      singleBed: 0,
      doubleBed: 0,
      largeBed: 0,
      superLargeBed: 0,
      sleepingtype: 'room',
    }));
    setBedrooms(initialBedrooms);
  };

  const incrementQuantity = (index, type) => {
    setBedrooms((prevBedrooms) =>
      prevBedrooms.map((bedroom, idx) =>
        idx === index ? { ...bedroom, [type]: bedroom[type] + 1 } : bedroom
      )
    );
  };

  const decrementQuantity = (index, type) => {
    setBedrooms((prevBedrooms) =>
      prevBedrooms.map((bedroom, idx) =>
        idx === index ? { ...bedroom, [type]: Math.max(0, bedroom[type] - 1) } : bedroom
      )
    );
  };

  const validate = () => {
    const newErrors = {};
    bedrooms.forEach((bedroom, index) => {
      if (Object.values(bedroom).every((bed) => bed === 0)) {
        newErrors[index] = 'At least one bed type must be selected in each bedroom.';
      }
    });
    setErrors(newErrors);
    return newErrors;
  };

  const handleNextStep = () => {
    const newErrors = validate();
    if (Object.keys(newErrors).length === 0) {
      onBedroomDetailsChange(bedrooms);
      handleNext();
    } else {
      setSnackbarMessage('Please ensure each bedroom has at least one bed type selected.');
      setSnackbarOpen(true);
    }
  };

  const handleBackClick = () => {
    handleBack();
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleSleepingTypeChangeUnitBeds = (index, value) => {
    setBedrooms((prevBedrooms) =>
      prevBedrooms.map((bedroom, idx) =>
        idx === index ? { ...bedroom, sleepingtype: value } : bedroom
      )
    );
  };

  console.log("BEDROOMDETAILS NI SHA",bedrooms );

  return (
    <Container maxWidth="md">
      <AnimatePage>
        <Box mt={4}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Bed Configuration
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" mb={3}>
            Please specify if the place where guests can sleep is a full room with walls or a bed area in an open space and select the number of beds for each bed space.
          </Typography>

          {bedrooms.map((bedroom, index) => (
            <Paper
              elevation={3}
              sx={{
                mb: 10,
                padding: isMobile ? "1rem" : "2rem", // No padding for mobile
                borderRadius: '0.8rem',
              }}
              key={index}
            >
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="h6" fontWeight="bold">
                    Bed space {index + 1}
                  </Typography>
                  {errors[index] && (
                    <Typography sx={{ color: 'red', fontSize: '0.875rem' }}>
                      {errors[index]}
                    </Typography>
                  )}
                </Grid>

                {/* RadioGroup for Sleeping Type */}
                <Grid item xs={12}>
                  <RadioGroup
                    value={bedroom.sleepingtype}
                    onChange={(e) => handleSleepingTypeChangeUnitBeds(index, e.target.value)}
                  >
                    <FormControlLabel
                      value="room"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="bold">Room</Typography>
                          <Typography variant="caption">An enclosed bedroom with walls and a door.</Typography>
                        </Box>
                      }
                    />
                    <FormControlLabel
                      value="bedarea"
                      control={<Radio />}
                      label={
                        <Box>
                          <Typography variant="body1" fontWeight="bold">Bed Area</Typography>
                          <Typography variant="caption">An open space with beds but no walls or doors separating it.</Typography>
                        </Box>
                      }
                    />
                  </RadioGroup>
                  <Divider sx={{ my: 1 , color: "#6A6A6A" }} />
                </Grid>
              

                {/* Bed Types */}
                {/* Repeat for other bed types like Single, Double, Large Bed, etc. */}
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
                {/* Add other bed types here */}
              </Grid>
            </Paper>
          ))}
        </Box>
      </AnimatePage>

      <div className="stepperFooter">
        <Button onClick={handleBackClick} className="stepperPrevious">
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
