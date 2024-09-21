// import React, { useState, useEffect } from 'react';
// import { AppBar, Toolbar, Typography, Grid, Box, TextareaAutosize, Card } from '@mui/material';
// import ReviewsIcon from '@mui/icons-material/Reviews';
// import Divider from '@mui/material/Divider';
// import {Stack} from '@mui/material';
// import Chip from '@mui/material/Chip';

// function BookingDetails({  lengthStay, setLengthStay,onPriceChange  , PropertyData, guestCapacity,checkin_date, checkout_date }) {
 
//   const [price, setPrice] = useState(parseFloat((PropertyData.property_unitpricing.min_price + PropertyData.property_unitpricing.min_price * 0.12).toFixed(2)));
//   const [vat, setVat] = useState(parseFloat((PropertyData.property_unitpricing.min_price  * 0.12).toFixed(2)));
//   const [allServices, setAllServices] = useState([]);

//     //convert time

//     const convertTimeTo12HourFormat = (time) => {
//       const [hours, minutes] = time.split(':');
//       const amPm = hours >= 12 ? 'PM' : 'AM';
//       const twelveHourFormat = `${((hours + 11) % 12) + 1}:${minutes} ${amPm}`;
//       return twelveHourFormat;
//     };

//   // Recalculate VAT and price whenever basePrice changes
//   useEffect(() => {
//     const calculatedVat = (PropertyData.property_unitpricing.min_price * 0.12).toFixed(2);
//     const totalPrice = (parseFloat(PropertyData.property_unitpricing.min_price) + parseFloat(calculatedVat)).toFixed(2);
//     setVat(calculatedVat);
//     setPrice(totalPrice);
//     // Invoke the callback to pass the updated price to the parent component
//     onPriceChange(parseFloat(totalPrice));
//     console.log("Price", price);
//   }, [PropertyData.property_unitpricing.min_price, onPriceChange]);
  
// //get the services
//   useEffect(() => {
//     const services = [
//       ...PropertyData.property_facilities.map(facility => facility.facilities_name),
//       ...PropertyData.property_services.map(service => service.service_name),
//       ...PropertyData.property_amenities.map(amenity => amenity.amenity_name)
//     ];
//     setAllServices(services);
//   }, [PropertyData]);

//   return (
//     <>
//       {/* <AppBar position="static">
//         <Toolbar>
//           <Typography variant="h6">My Application</Typography>
//         </Toolbar>
//       </AppBar>
//       <Grid container>
//         <Grid item xs={12} md={4}> */}
//           <Box p={3}  >
//           <Card 
//           sx={{
//             border: '0.1rem solid rgba(0, 0, 0, 0.1)',
//             padding: '1rem',
//             borderRadius: '0.6rem',
//             boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
//           }}
//           >


//               <Typography sx={{ fontSize: "1rem" }} ml={1}>
//                 {PropertyData.property_details.property_type}
//               </Typography>
//               <Typography sx={{ fontSize: "1.5rem" }} ml={1} fontWeight="bold" pt={0.5}>
//               {PropertyData.property_details.property_name}
//               </Typography>
//               <Typography sx={{ fontSize: "1rem" }} ml={1} pt={0.5}>
//                 {PropertyData.property_address.address} , {PropertyData.property_address.zipcode}
//               </Typography>
//               {/* <Box sx={{ display: 'flex', paddingTop: '1rem', marginLeft: '0.5rem' }}>
//                 <ReviewsIcon sx={{ color: '#ff5722', fontSize: '1.5rem' }} /> 
//                 <Typography sx={{ fontSize: "1rem" }} pl={0.5}>200 reviews</Typography>
//               </Box> */}
//                <Box  pt={1}>
//                 <Stack direction="row" spacing={2} flexWrap="wrap">
//                   {allServices.map((service, index) => (
//                     <Chip label={service} key={index} sx={{backgroundColor: '#16B4DD', color:"#FFFF",}}/>
//                   ))}
//                 </Stack>
//               </Box>
              
//               {/* {PropertyData.property_services.map((facility, index) => (
//                 <Typography sx={{ fontSize: "0.75rem" }} ml={1} pt={0.5} key={index}>
//                   <Stack direction="row" spacing={1}>
//                     <Chip label= {facility.service_name}/>
//                   </Stack>
                 
//                 </Typography>
//               ))}
//                {PropertyData.property_amenities.map((facility, index) => (
//                 <Typography sx={{ fontSize: "0.75rem" }} ml={1} pt={0.5} key={index}>
//                   {facility.amenity_name}
//                 </Typography>
//               ))} */}
//             </Card>
//             {/* Booking Details */}
//             <Card 
//               sx={{
//                 border: '0.1rem solid rgba(0, 0, 0, 0.1)',
//                 padding: '1rem',
//                 borderRadius: '0.6rem',
//                 mt: 3,
//                 // width: '100%',
//                 boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
//               }}
//             >
//               <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold" pt={0.5}>
//                 Booking Details:
//               </Typography>
//               <div sx={{ display: 'flex', alignItems: 'center' }}>
//                 <Box sx={{ display: 'column', paddingTop: '0.5rem', marginLeft: '0.5rem' }}>
//                   <Typography sx={{ fontSize: "1.125rem" }}  pl={0.5}>Check-in</Typography>
//                   <Typography sx={{ fontSize: "1rem", fontWeight: 'bold' }} pl={0.5}>{checkin_date}</Typography>
//                   <div style={{ display: 'flex' }}>
//                   <Typography sx={{ fontSize: "1rem", fontWeight: 'bold' }} pl={0.5}>
//                     {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_in_from)} -
//                     {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_in_until)}
//                   </Typography>

//                   </div>
//                 </Box>
//                 <Divider orientation="vertical" flexItem />
//                 <Box sx={{ display: 'column', paddingTop: '0.5rem', marginLeft: '0.5rem' }}>
//                   <Typography sx={{ fontSize: "1rem" }} pl={0.5}>Check-out</Typography>
//                   <Typography sx={{ fontSize: "1.125rem", fontWeight: 'bold' }} pl={0.5}>{checkout_date}</Typography>
//                   <div style={{ display: 'flex' }}>
//                   <Typography sx={{ fontSize: "1rem", fontWeight: 'bold' }} pl={0.5}>
//                     {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_out_from)} -
//                     {convertTimeTo12HourFormat(PropertyData.property_houserules[0].check_out_until)}
//                   </Typography>
//                   </div>
//                 </Box>
//               </div>
//               <Divider sx={{mt:'1rem'}}/>
//               <Typography sx={{ fontSize: "1rem" }} ml={1 }mt={1} pt={0.5} >
//                 Lenght of stay:
//               </Typography>
//               <Typography sx={{ fontSize: "1.125rem" , fontWeight:'bold'}}  ml={1} pt={0.5} >
//                 {lengthStay} night/s
//               </Typography>
//               <Typography sx={{ fontSize: "1rem" }} ml={1 }mt={1} pt={0.5} >
//                 Number of Guests:
//               </Typography>
//               <Typography sx={{ fontSize: "1.125rem" , fontWeight:'bold'}}  ml={1} pt={0.5} >
//                 {guestCapacity} guests
//               </Typography>
//             </Card>
            
//             {/* Price Summary */}
//             <Card 
//               sx={{
//                 border: '0.1rem solid rgba(0, 0, 0, 0.1)',
//                 padding: '1rem',
//                 borderRadius: '0.6rem',
//                 mt: 3,
//                 // width: '100%',
//                 boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
//               }}
//             >
//                 <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold" pt={0.5}>
//                   Invoice Summary:
//                 </Typography>
//                 <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
//                   <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
//                     Base Price
//                   </Typography>
//                   <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
//                     Php {PropertyData.property_unitpricing.min_price}
//                   </Typography>
//                 </Stack>
//                 <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
//                   <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
//                     + Taxes and Charges (12%) VAT
//                   </Typography>
//                   <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
//                     {vat}
//                   </Typography>
//                 </Stack>
//                 <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
//                   <Typography gutterBottom  component="div" sx={{fontSize: "1.5rem" , fontWeight:'bold'}}>
//                     Price
//                   </Typography>
//                   <Typography gutterBottom  component="div" sx={{fontSize: "1.5rem" , fontWeight:'bold'}}>
//                     Php {price}
//                   </Typography>
//               </Stack>
//             </Card>
//               {/* Booking Policies */}
//               <Card 
//           sx={{
//             border: '0.1rem solid rgba(0, 0, 0, 0.1)',
//             padding: '1rem',
//             borderRadius: '0.6rem',
//             mt: 3,
//             // width: '100%',
//             boxShadow: '0 0.3rem 0.8rem rgba(0, 0, 0, 0.1)',
//           }}
//         >
//               <Typography sx={{ fontSize: "1.125rem" }} ml={1} fontWeight="bold" pt={0.5}>
//                 Cancellation/Modification Policies:
//               </Typography>
//               <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
//                 <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
//                 If you cancel, you'll pay 
//                 </Typography>
//                 <Typography gutterBottom sx={{fontSize: "1rem" , color:'grey'}} component="div">
//                   Php 1900.34
//                 </Typography>
//               </Stack>
             
//             </Card>

//           </Box>
//         {/* </Grid>
//         <Grid item xs={12} md={8}>
//           <Box p={2} bgcolor="white">
//             Main content (70%)
//           </Box>
//         </Grid>
//       </Grid> */}
//     </>
//   );
// }

// export default BookingDetails;
// src/BookingDetails.js
import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Divider, Stack, Chip, ThemeProvider } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import HotelIcon from '@mui/icons-material/Hotel';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info'; // Icon for property type
import BookingDetailsTheme from './theme/theme';
import { Hotel } from '@mui/icons-material';

function BookingDetails({ lengthStay, setLengthStay, onPriceChange, PropertyData, guestCapacity, checkin_date, checkout_date, address , details, facilities, houseRules}) {
  const [price, setPrice] = useState(0);
  const [vat, setVat] = useState(0);
  const [allServices, setAllServices] = useState([]);
  const unitData = PropertyData?.[0]; // Access the first item in PropertyData array



  useEffect(() => {
    
    if (unitData.unitpricing.min_price) {
      const calculatedVat = (unitData.unitpricing.min_price * 0.12).toFixed(2);
      const totalPrice = (parseFloat(unitData.unitpricing.min_price) + parseFloat(calculatedVat)).toFixed(2);
      setVat(calculatedVat);
      setPrice(totalPrice);
      onPriceChange(parseFloat(totalPrice));
    } else {
      setPrice('N/A'); // Handle case when min_price is not available
    }
  }, [unitData, onPriceChange]);
  

  useEffect(() => {
    const services = [
      ...PropertyData?.property_facilities?.map(facility => facility.facilities_name) || [],
      ...PropertyData?.property_services?.map(service => service.service_name) || [],
      ...PropertyData?.property_amenities?.map(amenity => amenity.amenity_name) || []
    ];
    setAllServices(services);
  }, [PropertyData]);

  const convertTimeTo12HourFormat = (time) => {
    if (!time) return 'N/A'; // Fallback for undefined times
    const [hours, minutes] = time.split(':');
    const amPm = hours >= 12 ? 'PM' : 'AM';
    const twelveHourFormat = `${((hours % 12) || 12)}:${minutes} ${amPm}`;
    return twelveHourFormat;
  };

  console.log("house rules", houseRules);

  return (
    <ThemeProvider theme={BookingDetailsTheme}>
      <Box mt={3} ml={0} >
        <Card >
          <Box mb={2}>
            <Typography variant="h6" color="primary" ml={1} display="flex" alignItems="center">
              <InfoIcon sx={{ color: 'primary.main', mr: 1 }} />
              {details.property_type}
            </Typography>
            <Typography variant="h4" ml={1} pt={0.5}>
              {details.property_name}
            </Typography>
            <Typography variant="body1" color="textSecondary" ml={1} pt={0.5}>
               ID #{details.propertyid}
            </Typography>
            <Typography variant="body1" color="textSecondary" ml={1} pt={0.5}>
              {address.address}, {address.zipcode}
            </Typography>
          </Box>
          <Box pt={1}>
            <Box 
              sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                gap: 2,
                alignItems: 'start'
              }}
            >
              {facilities.map((facility) => (
                <Chip label={facility.facilities_name} key={facility.facilitiesid} />
              ))}
            </Box>
          </Box>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" color="primary" ml={1} pt={0.5}>
            <AccessTimeIcon sx={{ verticalAlign: 'middle', color: 'primary.main', mr: 1 }} />
            Booking Details:
          </Typography>
          <Stack direction="row" alignItems="center" spacing={2} mt={2}>
            <Box sx={{ flex: 1, p: 1 }}>
              <Typography variant="body1">Check-in</Typography>
              <Typography variant="body1" fontWeight="bold">{checkin_date}</Typography>
              <Typography variant="body1" color="textSecondary">
                {convertTimeTo12HourFormat(houseRules[0].check_in_from)} - 
                {convertTimeTo12HourFormat(houseRules[0].check_in_until)}
              </Typography>
            </Box>
            <Divider orientation="vertical" flexItem />
            <Box sx={{ flex: 1, p: 1 }}>
              <Typography variant="body1">Check-out</Typography>
              <Typography variant="body1" fontWeight="bold">{checkout_date}</Typography>
              <Typography variant="body1" color="textSecondary">
                {convertTimeTo12HourFormat(houseRules[0].check_out_from)} - 
                {convertTimeTo12HourFormat(houseRules[0].check_out_from)}
              </Typography>
            </Box>
          </Stack>
          <Divider sx={{ mt: 2 }} />
          <Typography variant="h6" color="primary" ml={1} mt={2}>
            <Hotel sx={{ verticalAlign: 'middle', color: 'primary.main', mr: 1 }} />
            Length of stay:
          </Typography>
          <Typography variant="body1" fontWeight="bold" ml={2}>
            {lengthStay} night/s
          </Typography>
          <Typography variant="h6" color="primary" ml={1} mt={2}>
            <Hotel sx={{ verticalAlign: 'middle', color: 'primary.main', mr: 1 }} />
              Number of Guests:
          </Typography>
          <Typography variant="body1" fontWeight="bold" ml={2}>
            {guestCapacity} guests
          </Typography>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" color="primary" ml={1} pt={0.5}>
            <PriceCheckIcon sx={{ verticalAlign: 'middle', color: 'primary.main', mr: 1 }} />
            Invoice Summary:
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
            <Typography variant="body1" color="textSecondary">
              Base Price
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Php {unitData?.unitpricing?.min_price || 'N/A'}
            </Typography>
          </Stack>
          <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
            <Typography variant="body1" color="textSecondary">
              VAT (12%)
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Php {vat}
            </Typography>
          </Stack>
          <Divider sx={{ my: 1 }} />
          <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
            <Typography variant="body1" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              Php {price}
            </Typography>
          </Stack>
        </Card>

        <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" color="primary" ml={1} pt={0.5}>
            <CancelIcon sx={{ verticalAlign: 'middle', color: 'primary.main', mr: 1 }} />
            Cancellation Policy:
          </Typography>
          <Box ml={1} mt={1}>
            <Typography variant="body1" fontWeight="bold">
              {PropertyData?.property_bookingpolicy?.is_cancel_plan ? 'Cancellation Plan Available' : 'No Cancellation Plan'}
            </Typography>
            {PropertyData?.property_bookingpolicy?.is_cancel_plan && (
              <Typography variant="body1" color="textSecondary" mt={1}>
                Cancel within {PropertyData.property_bookingpolicy.cancel_days} days for a refund.
              </Typography>
            )}
            {PropertyData?.property_bookingpolicy?.non_refundable && (
              <Typography variant="body1" color="textSecondary" mt={1}>
                Please note that this booking is non-refundable.
              </Typography>
            )}
            {PropertyData?.property_bookingpolicy?.modification_plan && (
              <Typography variant="body1" color="textSecondary" mt={1}>
                Modifications are allowed up to {PropertyData.property_bookingpolicy.cancel_days} days before check-in.
              </Typography>
            )}
            {PropertyData?.property_bookingpolicy?.offer_discount && (
              <Typography variant="body1" color="textSecondary" mt={1}>
                Discounts may apply based on the booking policy.
              </Typography>
            )}
          </Box>
        </Card>
      </Box>
    </ThemeProvider>
  );
}

export default BookingDetails;

