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
import { useData } from '../registration_location/contextAddressData';
import '../../../components/Button/NextButton.css';

export default function BedroomDetails({ onBedroomDetailsChange }) {
  const { bedroomQTY } = useData();
  const [bedrooms, setBedrooms] = useState([]);

  useEffect(() => {
    if (bedroomQTY > 0) {
      const savedBedrooms = JSON.parse(localStorage.getItem('bedrooms'));
      if (savedBedrooms) {
        setBedrooms(savedBedrooms);
      } else {
        const initialBedrooms = Array.from({ length: bedroomQTY }, () => ({
          singleBed: 0,
          doubleBed: 0,
          largeBed: 0,
          superLargeBed: 0,
        }));
        setBedrooms(initialBedrooms);
      }
    }
  }, [bedroomQTY]);

  useEffect(() => {
    if (bedrooms.length > 0) {
      localStorage.setItem('bedrooms', JSON.stringify(bedrooms));
      onBedroomDetailsChange(bedrooms);
    }
  }, [bedrooms, onBedroomDetailsChange]);

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

  return (
    <Box>
      <Container maxWidth="lg">
        <Grid container justifyContent="center" alignItems="center">
          <Grid item xs={12} md={8} lg={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                padding: "1rem",
                mt: 8,
                mb: 12
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', width: '100%' }}>
                <div>
                  <Typography sx={{ fontSize: "2rem" }} fontWeight="bold">Bed Types</Typography>
                  <Typography sx={{ fontSize: "1.5rem" }} mb={2}>
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
                {bedrooms.length > 0 ? bedrooms.map((bedroom, index) => (
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
                        readOnly
                        style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center' }}
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
                        readOnly
                        style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center' }}
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
                        readOnly
                        style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center' }}
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
                        readOnly
                        style={{ width: '4rem', height: '2rem', border: 'none', textAlign: 'center' }}
                      />
                      <IconButton onClick={() => decrementQuantity(index, 'superLargeBed')}>
                        <RemoveIcon />
                      </IconButton>
                    </div>
                  </div>
                )) : (
                  <Typography>Loading...</Typography>
                )}
              </Paper>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
