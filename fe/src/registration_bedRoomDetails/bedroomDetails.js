import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { TextField } from '@mui/material';
import SingleBedIcon from '@mui/icons-material/SingleBed';
import RemoveIcon from '@mui/icons-material/Remove';

export default function BedroomDetails() {
  const [bedrooms, setBedrooms] = useState([]);
  const [bedroomDetailsData, setBedroomDetailsData] = useState([]);

  // Function to initialize bedrooms based on number of rooms
  const initializeBedrooms = (numRooms) => {
    const initialBedrooms = Array.from({ length: numRooms }, (_, index) => ({
      singleBed: 0,
      doubleBed: 0,
      largeBed: 0,
      superLargeBed: 0,
    }));
    setBedrooms(initialBedrooms);
  };

  // Update bedroomDetailsData whenever bedrooms change
  React.useEffect(() => {
    initializeBedrooms(2);
  }, []);

  React.useEffect(() => {
    const updatedBedroomDetails = bedrooms.map((bedroom, index) => formatBedroomDetails(index, bedroom));
    setBedroomDetailsData(updatedBedroomDetails);
  }, [bedrooms]);

  const formatBedroomDetails = (index, bedroom) => {
    return {
      bedroomNo: index + 1,
      singleBed: bedroom.singleBed,
      doubleBed: bedroom.doubleBed,
      largeBed: bedroom.largeBed,
      superLargeBed: bedroom.superLargeBed,
    };
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
console.log(bedroomDetailsData);
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '1rem',
      }}
    >
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          maxWidth: '32rem',
          padding: '1rem',
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
                marginLeft: '2rem',
                marginBottom: '2rem',
              }}
            >
              <Typography variant="h4" sx={{ fontWeight: 'bold', textAlign: 'left' }}>{`Bedroom ${index + 1}`}</Typography>
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
              />
              <IconButton onClick={() => decrementQuantity(index, 'superLargeBed')}>
                <RemoveIcon />
              </IconButton>
            </div>
          </div>
        ))}
      </Paper>
    </Box>
  );
}
