import * as React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByCountry from './ChartUserByCountry';
import CustomizedTreeView from './CustomizedTreeView';
import CustomizedDataGrid from './CustomizedDataGrid';
import HighlightedCard from './HighlightedCard';
import PageViewsBarChart from './PageViewsBarChart';
import SessionsChart from './SessionsChart';
import StatCard from './StatCard';
import SelectContent from './SelectContent';

const data = [
  {
    title: 'Total Revenue',
    value: '200k',
    interval: 'Last 30 days',
    trend: 'neutral',
    data: [
      500, 400, 510, 530, 520, 600, 530, 520, 510, 730, 520, 510, 530, 620, 510, 530,
      520, 410, 530, 520, 610, 530, 520, 610, 530, 420, 510, 430, 520, 510,
    ],
  },
  {
    title: 'Total Bookings',
    value: '14k',
    interval: 'This week',
    trend: 'up',
    data: [
      200, 24, 220, 260, 240, 380, 100, 240, 280, 240, 300, 340, 320, 360, 340, 380,
      360, 400, 380, 420, 400, 640, 340, 460, 440, 480, 460, 600, 880, 920,
    ],
  },
  {
    title: 'Total Customer Ratings',
    value: '325',
    interval: 'This week',
    trend: 'down',
    data: [
      1640, 1250, 970, 1130, 1050, 900, 720, 1080, 900, 450, 920, 820, 840, 600, 820,
      780, 800, 760, 380, 740, 660, 620, 840, 500, 520, 480, 400, 360, 300, 220,
    ],
  },
  
];

export default function MainGrid() {
  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 ,mt:5}}>
        Hello Irish, Welcome Back!
      </Typography>
      <Box
        sx={{
          display: 'flex',
          // mt: '60px',
          pt: 1,
          pb: 1,
        }}
      >
        <SelectContent />
      </Box>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        {data.map((card, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <StatCard {...card} />
          </Grid>
        ))}
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <HighlightedCard />
        </Grid>
      </Grid>
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        
        <Grid item xs={12} md={6}>
          <PageViewsBarChart />
        </Grid>
        <Grid item xs={12} md={6}>
          <SessionsChart />
        </Grid>
       
        <Grid item xs={12} md={6}> 
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
          Today's Booking Schedule
        </Typography>
          <CustomizedDataGrid />
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack gap={2} direction="row">
              <ChartUserByCountry />
              <ChartUserByCountry />
            </Stack>
        </Grid>
      </Grid>      
      {/* <Grid container spacing={2} columns={12}>
        <Grid item xs={12} lg={6}>
          <CustomizedDataGrid />
        </Grid>
        {/* <Grid item xs={12} lg={6}>
          <Stack gap={2} direction="row">
            <ChartUserByCountry />
            <ChartUserByCountry />
          </Stack>
        </Grid> */}
      {/* </Grid>  */}
      <Copyright sx={{ my: 4 }} />
    </Box>
  );
}
