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
import { useState, useEffect } from 'react';
import axios from 'axios';


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
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [property, setProperty] = useState({});
  const [selectedPropertyId, setSelectedPropertyId] = useState('');
  const [dashboardData, setDashboardData] = useState({});

  const handlePropertyChange = (propertyId) => {
    setSelectedPropertyId(propertyId);
    console.log('Selected Property ID:', propertyId); // You can use this ID as needed
  };
  console.log('selectedPropertyId', selectedPropertyId);

  //User Data
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
        })
        .catch((error) => {
          alert("Error decoding JWT token:", error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  //Property Data
  useEffect(() => {
    const fetchProperty = async () => {
      if (!user) return; // Exit if user is not set

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/getUserProperties", {
          params: {
            userid: user.userid,
          },
        });
        setProperty(response.data);
        setLoading(false);
      } catch (error) {

        console.error(error);
        setLoading(false);
      }
    };

    fetchProperty();
  }, [user]); // Add user as a dependency here

  //Dashboard Data

  useEffect(() => {
    const fetchDashboard = async () => {
      if (!selectedPropertyId) return; // Exit if property is not set
      console.log('selectedPropertyIddashboard', selectedPropertyId);
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/getDashboardData", {
          params: {
            propertyid: selectedPropertyId,
          },
        });
        console.log("dashboard Data:", response.data);
        setDashboardData(response.data);
        // setLoading(false);
      } catch (error) {

        console.error(error);
        // setLoading(false);
      }
    };

    fetchDashboard();
  }, [selectedPropertyId]);


  const getStatData = (data, defaultTitle) => ({
    title: data?.title || defaultTitle,
    value: data?.value || '0',
    interval: data?.interval || 'N/A',
    trend: data?.trend || 'neutral',
    data: Array.isArray(data?.data) ? data.data.map(Number) : [],
  });


  console.log ('dashboardData', dashboardData);
  console.log ('property', property);
  console.log ('user', user);
  return (
    <>
      {loading ? (
        <></>
      ) : (
        <>
          <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>

            {/* cards */}
            <Typography component="h2" variant="h6" sx={{ mb: 2, mt: 5 }}>
              Hello {user?.firstname}, Welcome Back!
            </Typography>
            <Box
              sx={{
                display: 'flex',        // Use flex for flexbox
                flexDirection: 'column', // Set direction to column
              
                pb: 1,
              }}
            >
              View as:
              <SelectContent property={property} onPropertyChange={handlePropertyChange} />
            </Box>

            <Grid
              container
              spacing={2}
              columns={12}
              sx={{ mb: (theme) => theme.spacing(2) }}
            >

              {dashboardData.data && Object.keys(dashboardData.data).length > 0 ? (
                [0, 1, 2].map(index => (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                    <StatCard {...getStatData(dashboardData.data[index], ['Total Revenue', 'Total Bookings', 'Total Customer Ratings'][index])} />
                  </Grid>
                ))
              ) : (
                ['Total Revenue', 'Total Bookings', 'Total Customer Ratings'].map((title, index) => (
                  <Grid key={index} item xs={12} sm={6} md={4} lg={4}>
                    <StatCard {...getStatData({}, title)} />
                  </Grid>
                ))
              )}

              {/* <Grid item xs={12} sm={6} md={4} lg={3}>
                <HighlightedCard />
              </Grid> */}
            </Grid>
            <Grid
              container
              spacing={2}
              columns={12}
              sx={{ mb: (theme) => theme.spacing(2) }}
            >

              <Grid item xs={12} md={6}>
              <PageViewsBarChart profitData={dashboardData?.data?.six_month_profit || []} />
              </Grid>
              <Grid item xs={12} md={6}>
                <SessionsChart bookingTrends = {dashboardData?.data?.booking_trends || []}/>
              </Grid>

              <Grid item xs={12} md={12}>
                <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
                  Today's Booking Schedule
                </Typography>
                <CustomizedDataGrid bookingList = {dashboardData?.data?.booking_list || []}/>
              </Grid>
              {/* <Grid item xs={12} md={6}>
                <Stack gap={2} direction="row">
                  <ChartUserByCountry />
                  <ChartUserByCountry />
                </Stack>
              </Grid> */}
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
        </>
      )}
    </>

  );
}
