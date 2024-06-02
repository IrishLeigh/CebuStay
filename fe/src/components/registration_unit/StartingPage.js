import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';

function App() {
  return (
    <Container>
      <Box sx={{ flexGrow: 1, mt: 5 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box p={2} bgcolor="primary.main" color="primary.contrastText">
              <Typography variant="h4">List your property on CebuStay!</Typography>
              <Typography variant="body1">
                  Whether hosting is your side passion or full-time job, register your holiday rental on Booking.com to reach travellers worldwid
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Box p={2} bgcolor="secondary.main" color="secondary.contrastText">
              <Typography variant="h5">Sidebar</Typography>
              <Typography variant="body1">
                This is the sidebar. It takes up 20% of the width.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

export default App;
