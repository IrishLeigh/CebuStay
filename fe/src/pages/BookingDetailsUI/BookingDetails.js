import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Grid, Box, TextareaAutosize, Card } from '@mui/material';
import ReviewsIcon from '@mui/icons-material/Reviews';
import Divider from '@mui/material/Divider';
import {Stack} from '@mui/material';
import Chip from '@mui/material/Chip';

function BookingDetails({  lengthStay, setLengthStay,onPriceChange  , PropertyData, guestCapacity,checkin_date, checkout_date }) {
 
  const [price, setPrice] = useState(parseFloat((PropertyData.property_unitpricing.min_price + PropertyData.property_unitpricing.min_price * 0.12).toFixed(2)));
  const [vat, setVat] = useState(parseFloat((PropertyData.property_unitpricing.min_price  * 0.12).toFixed(2)));
  const [allServices, setAllServices] = useState([]);

    //convert time

    const convertTimeTo12HourFormat = (time) => {
      const [hours, minutes] = time.split(':');
      const amPm = hours >= 12 ? 'PM' : 'AM';
      const twelveHourFormat = `${((hours + 11) % 12) + 1}:${minutes} ${amPm}`;
      return twelveHourFormat;
    };

  // Recalculate VAT and price whenever basePrice changes
  useEffect(() => {
    const calculatedVat = (PropertyData.property_unitpricing.min_price * 0.12).toFixed(2);
    const totalPrice = (parseFloat(PropertyData.property_unitpricing.min_price) + parseFloat(calculatedVat)).toFixed(2);
    setVat(calculatedVat);
    setPrice(totalPrice);
    // Invoke the callback to pass the updated price to the parent component
    onPriceChange(parseFloat(totalPrice));
    console.log("Price", price);
  }, [PropertyData.property_unitpricing.min_price, onPriceChange]);
  
//get the services
  useEffect(() => {
    const services = [
      ...PropertyData.property_facilities.map(facility => facility.facilities_name),
      ...PropertyData.property_services.map(service => service.service_name),
      ...PropertyData.property_amenities.map(amenity => amenity.amenity_name)
    ];
    setAllServices(services);
  }, [PropertyData]);

  return (
    <>
      {/* <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My Application</Typography>
        </Toolbar>
      </AppBar>
      <Grid container>
        <Grid item xs={12} md={4}> */}
          <Box p={3}  >
          <Card 
          sx={{
            border: '0.1rem solid rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            borderRadius: '0.6rem',
            boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
          }}
          >


              <Typography sx={{ fontSize: "1rem" }} ml={1}>
                {PropertyData.property_details.property_type}
              </Typography>
              <Typography sx={{ fontSize: "1.5rem" }} ml={1} fontWeight="bold" pt={0.5}>
              {PropertyData.property_details.property_name}
              </Typography>
              <Typography sx={{ fontSize: "1rem" }} ml={1} pt={0.5}>
                {PropertyData.property_address.address} , {PropertyData.property_address.zipcode}
              </Typography>
              {/* <Box sx={{ display: 'flex', paddingTop: '1rem', marginLeft: '0.5rem' }}>
                <ReviewsIcon sx={{ color: '#ff5722', fontSize: '1.5rem' }} /> 
                <Typography sx={{ fontSize: "1rem" }} pl={0.5}>200 reviews</Typography>
              </Box> */}
               <Box  pt={1}>
                <Stack direction="row" spacing={2} flexWrap="wrap">
                  {allServices.map((service, index) => (
                    <Chip label={service} key={index} sx={{backgroundColor: '#16B4DD', color:"#FFFF",}}/>
                  ))}
                </Stack>
              </Box>
              
              {/* {PropertyData.property_services.map((facility, index) => (
                <Typography sx={{ fontSize: "0.75rem" }} ml={1} pt={0.5} key={index}>
                  <Stack direction="row" spacing={1}>
                    <Chip label= {facility.service_name}/>
                  </Stack>
                 
                </Typography>
              ))}
               {PropertyData.property_amenities.map((facility, index) => (
                <Typography sx={{ fontSize: "0.75rem" }} ml={1} pt={0.5} key={index}>
                  {facility.amenity_name}
                </Typography>
              ))} */}
            </Card>
            {/* Booking Details */}
            <Card 
              sx={{
                border: '0.1rem solid rgba(0, 0, 0, 0.1)',
                padding: '1rem',
                borderRadius: '0.6rem',
                mt: 3,
                // width: '100%',
                boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
              }}
            >
              <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold" pt={0.5}>
                Booking Details:
              </Typography>
              <div sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ display: 'column', paddingTop: '0.5rem', marginLeft: '0.5rem' }}>
                  <Typography sx={{ fontSize: "1.125rem" }}  pl={0.5}>Check-in</Typography>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 'bold' }} pl={0.5}>{checkin_date}</Typography>
                  <div style={{ display: 'flex' }}>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 'bold' }} pl={0.5}>
                    {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_in_from)} -
                    {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_in_until)}
                  </Typography>

                  </div>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box sx={{ display: 'column', paddingTop: '0.5rem', marginLeft: '0.5rem' }}>
                  <Typography sx={{ fontSize: "1rem" }} pl={0.5}>Check-out</Typography>
                  <Typography sx={{ fontSize: "1.125rem", fontWeight: 'bold' }} pl={0.5}>{checkout_date}</Typography>
                  <div style={{ display: 'flex' }}>
                  <Typography sx={{ fontSize: "1rem", fontWeight: 'bold' }} pl={0.5}>
                    {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_out_from)} -
                    {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_out_until)}
                  </Typography>
                  </div>
                </Box>
              </div>
              <Divider sx={{mt:'1rem'}}/>
              <Typography sx={{ fontSize: "1rem" }} ml={1 }mt={1} pt={0.5} >
                Lenght of stay:
              </Typography>
              <Typography sx={{ fontSize: "1.125rem" , fontWeight:'bold'}}  ml={1} pt={0.5} >
                {lengthStay} night/s
              </Typography>
              <Typography sx={{ fontSize: "1rem" }} ml={1 }mt={1} pt={0.5} >
                Number of Guests:
              </Typography>
              <Typography sx={{ fontSize: "1.125rem" , fontWeight:'bold'}}  ml={1} pt={0.5} >
                {guestCapacity} guests
              </Typography>
            </Card>
            
            {/* Price Summary */}
            <Card 
              sx={{
                border: '0.1rem solid rgba(0, 0, 0, 0.1)',
                padding: '1rem',
                borderRadius: '0.6rem',
                mt: 3,
                // width: '100%',
                boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
              }}
            >
                <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold" pt={0.5}>
                  Invoice Summary:
                </Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
                  <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
                    Base Price
                  </Typography>
                  <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
                    Php {PropertyData.property_unitpricing.min_price}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
                  <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
                    + Taxes and Charges (12%) VAT
                  </Typography>
                  <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
                    {vat}
                  </Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
                  <Typography gutterBottom  component="div" sx={{fontSize: "1.5rem" , fontWeight:'bold'}}>
                    Price
                  </Typography>
                  <Typography gutterBottom  component="div" sx={{fontSize: "1.5rem" , fontWeight:'bold'}}>
                    Php {price}
                  </Typography>
              </Stack>
            </Card>
              {/* Booking Policies */}
              <Card 
          sx={{
            border: '0.1rem solid rgba(0, 0, 0, 0.1)',
            padding: '1rem',
            borderRadius: '0.6rem',
            mt: 3,
            // width: '100%',
            boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
          }}
        >
              <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold" pt={0.5}>
                Cancellation/Modification Policies:
              </Typography>
              <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
                <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
                If you cancel, you'll pay 
                </Typography>
                <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
                  Php 1900.34
                </Typography>
              </Stack>
             
            </Card>

          </Box>
        {/* </Grid>
        <Grid item xs={12} md={8}>
          <Box p={2} bgcolor="white">
            Main content (70%)
          </Box>
        </Grid>
      </Grid> */}
    </>
  );
}

export default BookingDetails;
