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
import { set } from 'date-fns';

function BookingDetails({ lengthStay, onPriceChange, PropertyData, guestCapacity, checkin_date, checkout_date, address , details, facilities, houseRules}) {
  const [price, setPrice] = useState(0);
  const [vatDaily, setVatDaily] = useState(0);
  const [vatMonthly, setVatMonthly] = useState(0);
  const [allServices, setAllServices] = useState([]);
  const unitData = PropertyData?.[0]; // Access the first item in PropertyData array
  const [basePrice, setBasePrice] = useState(0);
  const [monthlyBasePrice, setMonthlyBasePrice] = useState(0);
  const [totalDailyPrice, setTotalDailyPrice] = useState(0);
  const [totalMonthlyPrice, setTotalMonthlyPrice] = useState(0);
  const [isDaily, setIsDaily] = useState(details?.unit_type === 'Daily Term' ? true : false);
  const [isMonthly, setIsMonthly] = useState(details?.unit_type === 'Monthly Term' ? true : false);
  const [lengthStayMonths, setLengthStayMonths] = useState(0);

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(value);
  };

  useEffect(() => {
    if (unitData?.unitpricing?.min_price) {
      const basePrice = unitData.unitpricing.min_price / 1.12; // Base price excluding VAT (12%)
      const dailyPriceWithService = (basePrice * lengthStay).toFixed(2); // Base price multiplied by length of stay
      const calculatedVat = (dailyPriceWithService * 0.12).toFixed(2); // VAT calculation
      const totalDailyPriceWithService = parseFloat(dailyPriceWithService) + parseFloat(calculatedVat); // Total with VAT
  
      // Set daily pricing states
      setBasePrice(basePrice.toFixed(2));
      setVatDaily(calculatedVat);
      setPrice(dailyPriceWithService);
      setTotalDailyPrice(totalDailyPriceWithService.toFixed(2));
  
      // Monthly Calculations
      const monthlyPrice = unitData.unitpricing.min_price;
      const calculateMonths = Math.ceil(lengthStay / 31); // Calculate number of months
      const monthlyPriceWithService = (monthlyPrice * 1).toFixed(2); // Total monthly price
      const securityDeposit = monthlyPrice; // Security deposit equals one month base price
      const oneMonthAdvance = monthlyPrice; // One month advance payment
  
      // Calculate total monthly price with service and fees
      const totalMonthlyPriceWithService = parseFloat(monthlyPriceWithService) + parseFloat(securityDeposit);
      const calculatedMonthlyVat = (totalMonthlyPriceWithService * 0.12).toFixed(2); // Calculate VAT per month
  
      // Set state with calculated values
      setLengthStayMonths(calculateMonths);
      setMonthlyBasePrice(monthlyPrice.toFixed(2));
      setVatMonthly(calculatedMonthlyVat);
      setTotalMonthlyPrice(totalMonthlyPriceWithService.toFixed(2));
  
      if (isDaily) {
        // Call price change function with the total daily price
        onPriceChange(totalDailyPriceWithService);
      } else {
        // When not daily, set total monthly price with service
        onPriceChange(totalMonthlyPriceWithService);
      }
    }
  }, [unitData, onPriceChange, lengthStay, isDaily]);
  
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
  console.log("PropertyData sa BOOKING", PropertyData);
  console.log("isDaily", isDaily);

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
            {guestCapacity} guest/s
          </Typography>
        </Card>
        
      {/* For Daily Term */}
        {isDaily ? (
          <Card sx={{ p: 3, mt: 3 }}>
          <Typography variant="h6" color="primary" ml={1} pt={0.5}>
            <PriceCheckIcon sx={{ verticalAlign: 'middle', color: 'primary.main', mr: 1 }} />
            Invoice Summary:
          </Typography>
          <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
            <Typography variant="body1" color="textSecondary">
              Base Price Per Night
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatPrice(basePrice) || 'N/A'}
            </Typography>
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
            <Typography variant="body1" color="textSecondary">
              X {lengthStay || 'N/A'} =
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatPrice(price) || 'N/A'}
            </Typography>
          </Stack>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
            <Typography variant="body1" color="textSecondary">
              VAT (12%)
            </Typography>
            <Typography variant="body1" color="textSecondary">
              {formatPrice(vatDaily) || 'N/A'}
            </Typography>
          </Stack>

          <Divider sx={{ my: 1 }} />

          <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
            <Typography variant="body1" fontWeight="bold">
              Total Amount
            </Typography>
            <Typography variant="body1" fontWeight="bold">
              {formatPrice(totalDailyPrice)}
            </Typography>
          </Stack>
        </Card>
          
        ) : (
          <Card sx={{ p: 3, mt: 3 }}>
            <Typography variant="h6" color="primary" ml={1} pt={0.5}>
              <PriceCheckIcon sx={{ verticalAlign: 'middle', color: 'primary.main', mr: 1 }} />
              Invoice Summary:
            </Typography>
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                Base Price Per Month
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {formatPrice(basePrice) || 'N/A'}
              </Typography>
            </Stack>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                X 1 month advance =
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {formatPrice(basePrice) || 'N/A'}
              </Typography>
            </Stack>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                Security Deposit
              </Typography>
              <Typography variant="body1" color="textSecondary">
                +{formatPrice(monthlyBasePrice) || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                VAT (12%)
              </Typography>
              <Typography variant="body1" color="textSecondary">
                +{formatPrice(vatMonthly) || 'N/A'}
              </Typography>
            </Stack>

            <Divider sx={{ my: 1 }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" fontWeight="bold">
                Total Amount
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatPrice(totalMonthlyPrice)}
              </Typography>
            </Stack>
          </Card>

        )}

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

