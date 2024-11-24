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
import { yellow } from '@mui/material/colors'; // Import yellow color

function BookingDetails({ lengthStay, onPriceChange, PropertyData, propertyData2, guestCapacity, checkin_date, checkout_date, address , details, facilities, houseRules}) {
  const [price, setPrice] = useState(0);
  const [vatDaily, setVatDaily] = useState(0);
  const [vatMonthly, setVatMonthly] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [monthlyBasePrice, setMonthlyBasePrice] = useState(0);
  const [totalDailyPrice, setTotalDailyPrice] = useState(0);
  const [totalMonthlyPrice, setTotalMonthlyPrice] = useState(0);
  const [isDaily, setIsDaily] = useState(details?.unit_type === 'Daily Term' ? true : false);
  const [isMonthly, setIsMonthly] = useState(details?.unit_type === 'Monthly Term' ? true : false);
  const [allServices, setAllServices] = useState({});
  const [monthlyLengthStay, setMonthlyLengthStay] = useState(0);
  const unitData = PropertyData?.[0];

  const formatPrice = (value) => {
    const roundedValue = Math.ceil(value); // Round up to the nearest whole number
    return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(roundedValue);
  };

  useEffect(() => {
    if (unitData?.unitpricing?.min_price) {
      if (isDaily) {
        const basePrice = unitData.unitpricing.min_price / 1.12; // Base price excluding VAT (12%)
        const dailyPriceWithService = (basePrice * lengthStay).toFixed(2); // Base price multiplied by length of stay without VAT
        const calculatedVat = (dailyPriceWithService * 0.12).toFixed(2); // VAT calculation
        const totalDailyPriceWithService = parseFloat(dailyPriceWithService) + parseFloat(calculatedVat); // Total with VAT

        // Set daily pricing states
        setBasePrice(basePrice.toFixed(2));
        setVatDaily(calculatedVat);
        setPrice(dailyPriceWithService);
        setTotalDailyPrice(totalDailyPriceWithService.toFixed(2));

        // Call price change function with the total daily price
        onPriceChange(totalDailyPriceWithService);
      } else {
        // Monthly Calculations
        const monthlyPrice = unitData.unitpricing.min_price; // With VAT
        const baseMonthlyPrice = monthlyPrice / 1.12; // Base price excluding VAT
        const calculateMonths = Math.ceil(lengthStay / 31); // Calculate number of months
        console.log("calculated months: ", calculateMonths);

        let securityDeposit = 0; // Initialize security deposit
        let monthsAdvance = 0; // Initialize advance payment

        // Determine security deposit and advance payment based on months
        if (calculateMonths === 1) {
          securityDeposit = baseMonthlyPrice; // Security deposit equals one month base price
          monthsAdvance = baseMonthlyPrice; // Advance payment equals one month base price
        } else if (calculateMonths >= 2) {
          securityDeposit = baseMonthlyPrice; // Security deposit equals one month base price
          monthsAdvance = baseMonthlyPrice * 2; // Two months advance payment
        }

        // Total monthly price without VAT
        const totalMonthlyWithoutVAT = parseFloat(monthsAdvance) ;
        const calculatedTotalMonthlyVat = (totalMonthlyWithoutVAT * 0.12).toFixed(2); // Calculate VAT
        const totalMonthlyPriceWithService = totalMonthlyWithoutVAT + parseFloat(calculatedTotalMonthlyVat) + monthlyPrice; // Total with VAT

        // Set state with calculated values
        setMonthlyBasePrice(baseMonthlyPrice.toFixed(2));
        setVatMonthly(calculatedTotalMonthlyVat);
        setTotalMonthlyPrice(totalMonthlyPriceWithService.toFixed(2)); // Add VAT to total monthly price
        setMonthlyLengthStay(calculateMonths);

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

  // console.log("house rules", houseRules);
  console.log("PropertyData sa BOOKING DETAILS UI", propertyData2);
  // console.log("isDaily", isDaily);

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
                X {lengthStay || 'N/A'} nights =
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

            {/* Total Amount to Pay Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                Base Price Per Month
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {formatPrice(monthlyBasePrice) || 'N/A'}
              </Typography>
            </Stack>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                X {monthlyLengthStay} total months booked
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {formatPrice(monthlyLengthStay * monthlyBasePrice) || 'N/A'}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                VAT (12%)
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {formatPrice((monthlyLengthStay * monthlyBasePrice) * 0.12) || 'N/A'}
              </Typography>
            </Stack>
            
            <Divider sx={{ my: 1 }} />
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" fontWeight="bold">
                Total Amount
              </Typography>
              <Typography variant="body1" fontWeight="bold">
                {formatPrice((monthlyLengthStay * monthlyBasePrice) * 1.12)}
              </Typography>
            </Stack>
            
            {/* Down Payment Section */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1} mt={4}>
              <Typography variant="body1" fontWeight="bold">
                For Downpayment to pay now
              </Typography>
              {/* <Typography variant="body1" color="textSecondary">
                {formatPrice(monthlyBasePrice) || 'N/A'}
              </Typography> */}
            </Stack>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                {monthlyLengthStay === 1 ? "X 1 month advance =" : "X 2 months advance ="}
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {formatPrice(monthlyLengthStay === 1 ? monthlyBasePrice : monthlyBasePrice * 2) || 'N/A'}
              </Typography>
            </Stack>
            
           

            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                VAT (12%)
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {formatPrice(vatMonthly) || 'N/A'}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" color="textSecondary">
                Security Deposit
              </Typography>
              <Typography variant="body1" color="textSecondary">
                + {formatPrice(unitData?.unitpricing?.min_price) || 'N/A'}
              </Typography>
            </Stack>
            
            <Divider sx={{ my: 1 }} />
            {/* Security Deposit Information */}
            <Stack direction="row" alignItems="center" m={1}>
              <InfoIcon sx={{ color: 'info.main', mr: 1 }} style={{ color: yellow[600] }} /> {/* Info Icon */}
              <Typography variant="body2" >
                The security deposit is refundable at the end of the rental period, subject to conditions.
              </Typography>
            </Stack>
            
            <Stack direction="row" justifyContent="space-between" alignItems="center" m={1}>
              <Typography variant="body1" fontWeight="bold">
                Downpayment Amount 
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
    Cancellation Policies
  </Typography>
  <Box ml={1} mt={2} display="grid" gridTemplateColumns="1fr 1fr" gap={2}>
    {/* Cancellation Policy */}
    <Typography variant="body1" fontWeight="bold">
      Can guests cancel their booking?
    </Typography>
    <Typography variant="body1">
      {propertyData2?.property_bookingpolicy?.isCancellationPolicy === 1
        ? 'Yes, Allowed'
        : 'No, Not Allowed'}
    </Typography>

    {propertyData2?.property_bookingpolicy?.isCancellationPolicy === 1 && (
      <>
        <Typography variant="body1" fontWeight="bold">
          Free Cancellation: Number of Days Before Check-in
        </Typography>
        <Typography variant="body1">
          {propertyData2.property_bookingpolicy.cancellationDays}
        </Typography>

        <Typography variant="body1" fontWeight="bold">
          Cancellation Fee (If cancelled after the free period)
        </Typography>
        <Typography variant="body1">
          ${propertyData2.property_bookingpolicy.CancellationCharge}
        </Typography>
      </>
    )}

    {/* Modification Policy */}
    <Typography variant="body1" fontWeight="bold">
      Can guests modify their booking?
    </Typography>
    <Typography variant="body1">
      {propertyData2?.property_bookingpolicy?.isModificationPolicy === 1
        ? 'Yes, Allowed'
        : 'No, Not Allowed'}
    </Typography>

    {propertyData2?.property_bookingpolicy?.isModificationPolicy === 1 && (
      <>
        <Typography variant="body1" fontWeight="bold">
          Free Modification: Number of Days Before Check-in
        </Typography>
        <Typography variant="body1">
          {propertyData2.property_bookingpolicy.modificationDays}
        </Typography>

        <Typography variant="body1" fontWeight="bold">
          Modification Fee (If modified after the free period)
        </Typography>
        <Typography variant="body1">
          ${propertyData2.property_bookingpolicy.modificationCharge}
        </Typography>
      </>
    )}
  </Box>
</Card>


      </Box>
    </ThemeProvider>
  );
}

export default BookingDetails;

