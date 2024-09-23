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
import { Button } from '@mui/material';
import { useData } from '../../../components/registration_unit/registration_location/contextAddressData';
import '../../../components/Button/NextButton.css';
import AnimatePage from './AnimatedPage';

export default function BedroomDetails2({ onBedroomDetailsChange, parentBedroomDetails, handleNext, handleBack }) {
  const { bedroomQTY } = useData();
  const [bedrooms, setBedrooms] = useState([]);
  const [errors, setErrors] = useState({}); // Define errors state variable

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
      // Alert for validation errors
      alert('Please ensure each bedroom has at least one bed type selected.');
    }
  };

  // Handle back navigation
  const handleBackClick = () => {
    handleBack();
  };

  return (
    <Container maxWidth="lg" >
      <AnimatePage>
        <Grid container className="centered-container">
          <Grid item xs={12} md={8} lg={6}>
            <Box
              
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">Bed Types</Typography>
                  <Typography sx={{ fontSize: "1.5rem", width: "100%" }} mb={2}>
                    Add here idk.
                  </Typography>
                </div>
              </Box>
              <Paper
                elevation={3}
                sx={{
                  p: 2,
                  width: '93%',
                  maxWidth: '32rem',
                  textAlign: 'left',
                }}
              >
                {bedrooms.map((bedroom, index) => (
                  <div
                    key={index}
                    style={{
                      marginBottom: '2rem',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                      }}
                    >
                      <Typography m={4} sx={{ fontSize: "1.5rem", fontWeight: 'bold', textAlign: 'left' }}>{`Bedroom ${index + 1}`}</Typography>
                      {errors[index] && (
                        <Typography sx={{ color: 'red', fontSize: '0.875rem' }}>
                          {errors[index]}
                        </Typography>
                      )}
                    </div>

                    {/* Single Bed */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2rem' }}>
                      <SingleBedIcon />
                      <Typography sx={{ fontSize: '1.125rem', mr: '4rem', ml: '2rem' }}>Single Bed</Typography>
                      <IconButton onClick={() => incrementQuantity(index, 'singleBed')}>
                        <AddIcon />
                      </IconButton>
                      <input
                        type="text"
                        value={bedroom.singleBed}
                        style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                        readOnly
                      />
                      <IconButton onClick={() => decrementQuantity(index, 'singleBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </div>

                    {/* Double Bed */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2rem' }}>
                      <SingleBedIcon />
                      <Typography sx={{ fontSize: '1.125rem', mr: '4rem', ml: '2rem' }}>Double Bed</Typography>
                      <IconButton onClick={() => incrementQuantity(index, 'doubleBed')}>
                        <AddIcon />
                      </IconButton>
                      <input
                        type="text"
                        value={bedroom.doubleBed}
                        style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                        readOnly
                      />
                      <IconButton onClick={() => decrementQuantity(index, 'doubleBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </div>

                    {/* Large Bed */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2rem' }}>
                      <SingleBedIcon />
                      <Typography sx={{ fontSize: '1.125rem', mr: '4rem', ml: '2rem' }}>Large Bed</Typography>
                      <IconButton onClick={() => incrementQuantity(index, 'largeBed')}>
                        <AddIcon />
                      </IconButton>
                      <input
                        type="text"
                        value={bedroom.largeBed}
                        style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                        readOnly
                      />
                      <IconButton onClick={() => decrementQuantity(index, 'largeBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </div>

                    {/* Super Large Bed */}
                    <div style={{ display: 'flex', alignItems: 'center', marginLeft: '2rem' }}>
                      <SingleBedIcon />
                      <Typography sx={{ fontSize: '1.125rem', mr: '4rem', ml: '2rem' }}>Super Large Bed</Typography>
                      <IconButton onClick={() => incrementQuantity(index, 'superLargeBed')}>
                        <AddIcon />
                      </IconButton>
                      <input
                        type="text"
                        value={bedroom.superLargeBed}
                        style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center', alignItems: 'center', justifyContent: 'center' }}
                        readOnly
                      />
                      <IconButton onClick={() => decrementQuantity(index, 'superLargeBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </div>
                  </div>
                ))}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </AnimatePage>
      <div className="stepperFooter">
        <Button  onClick={handleBack} className="stepperPrevious">
          Back
        </Button>
        <Button  onClick={handleNextStep} className="stepperNext">
          Next
        </Button>
      </div>
    </Container>
  );
}
