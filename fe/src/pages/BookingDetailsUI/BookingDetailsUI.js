import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Grid, Button, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import BookingDetails from "./BookingDetails";
import BookingGuestDetails from "./BookingGuestDetails";
import "./BookingPage.css";
import { useParams, useLocation } from "react-router-dom";

function BookingDetailsUI() {
  const [price, setPrice] = useState();
  const [lengthStay, setLengthStay] = useState(2);
  const [propertyData, setPropertyData] = useState(null);
  const [guestDetails, setGuestDetails] = useState(null);
  const { propertyid } = useParams();
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true); // Loading state for initial data fetching
  const [paymentLoading, setPaymentLoading] = useState(false); // Loading state for payment process
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const location = useLocation();
  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const guestCount = searchParams.get("guestCount") || 0;
  const checkin_date = searchParams.get("checkInDate") || '';
  const checkout_date = searchParams.get("checkOutDate") || '';
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const dummyUser = {
      userid: 1,
      name: "John Doe",
      email: "john@example.com",
    };
    setUser(dummyUser);
  }, []);

  console.log("checkin", checkin_date);

  useEffect(() => {
    const dummyPropertyData = {
      property_details: {
        property_name: "Dummy Property",
        property_type: "Hotel",
      },
      property_address: {
        address: "123 Fake St",
        zipcode: "12345",
      },
      property_unitpricing: {
        min_price: 1000,
      },
      property_facilities: [
        { facilities_name: "Free WiFi" },
        { facilities_name: "Parking Lot" },
        { facilities_name: "Swimming Pool" },
      ],
      property_services: [
        { service_name: "Room Service" },
        { service_name: "Laundry Service" },
      ],
      property_amenities: [
        { amenity_name: "Air Conditioning" },
        { amenity_name: "Television" },
      ],
      property_houserules: [
        {
          check_in_from: "14:00",
          check_in_until: "18:00",
          check_out_from: "10:00",
          check_out_until: "12:00",
        },
      ],
      property_unitrooms: {
        unitid: 1,
      },
    };
    setPropertyData(dummyPropertyData);
    setLoading(false);
  }, []);

  const validateGuestDetails = (details) => {
    if (!details) return false;
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      // "selectedCountry",
      "countryCode",
      "guestName",
    ];

    for (let field of requiredFields) {
      if (!details[field]) {
        return false;
      }
    }
    return true;
  };

  
  const handleNextPayment = async () => {
    console.log("Price:", price);
    console.log("Guests:", guestCount);
    console.log("Length of Stay:", lengthStay);
    console.log("Guest Details:", guestDetails);

    if (!validateGuestDetails(guestDetails)) {
      setSnackbarMessage("Please fill in all required fields.");
      setOpenSnackbar(true);
      return;
    }

    setPaymentLoading(true); // Start loading state for payment process

    try {
      const userid = user.userid;
      const unitid = propertyData.property_unitrooms.unitid;
      const booker_fname = guestDetails.firstName;
      const booker_lname = guestDetails.lastName;
      const booker_email = guestDetails.email;
      const booker_phone = guestDetails.phoneNumber;
      // const booker_country = guestDetails.selectedCountry;
      const booker_country = "Philippines";
      const booker_country_code = guestDetails.countryCode;
      const is_my_book = guestDetails.bookingFor === "myself";
      const guestname = guestDetails.guestName;
      const guestemail = guestDetails.guestEmail;
      const stay_length = lengthStay;
      const guest_count = guestCount;
      const checkin_date = checkin_date;
      const checkout_date = checkout_date;
      const total_price = price;
      const special_request = guestDetails.requests;
      const arrival_time = guestDetails.arrivalTime;
      const status = "Pending";

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };

      const booking_date = formatDate(new Date());

      console.log("Booking data:", {
        userid,
        propertyid,
        booker_fname,
        booker_lname,
        booker_email,
        booker_phone,
        booker_country,
        booker_country_code,
        is_my_book,
        guestname,
        guestemail,
        stay_length,
        guest_count,
        checkin_date,
        checkout_date,
        total_price,
        special_request,
        arrival_time,
        status,
        booking_date,
        unitid,
      });

      const checkoutUrl = "https://dummy-payment-link.com/checkout";

      if (checkoutUrl) {
        window.location.href = checkoutUrl;
      } else {
        console.error("Checkout session URL not found in the response data");
        setSnackbarMessage("Checkout session URL not found.");
        setOpenSnackbar(true);
      }
    } catch (e) {
      console.error(e);
      setSnackbarMessage("Error processing booking.");
      setOpenSnackbar(true);
    } finally {
      setPaymentLoading(false); // End loading state for payment process
    }
  };

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
  };

  const handleGuestDetailsChange = (guestDetails) => {
    setGuestDetails(guestDetails);
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      <AppBar position="static" sx={{ background: "#16B4DD" }}>
        <Toolbar>
          <Typography variant="h6">
            Your Booking Details</Typography>
        </Toolbar>
      </AppBar>
      <Grid container spacing={2} p={3}>
        <Grid item xs={12} md={4}>
          <BookingDetails
            lengthStay={lengthStay}
            setLengthStay={setLengthStay}
            onPriceChange={handlePriceChange}
            PropertyData={propertyData}
            checkin_date={checkin_date}
            checkout_date={checkout_date}
            guestCapacity={guestCount}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <BookingGuestDetails onGuestDetailsChange={handleGuestDetailsChange} User={user} PropertyData={propertyData} />
          <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              sx={{ mr: 1, backgroundColor: "#16B4DD" }}
              onClick={handleNextPayment}
              disabled={paymentLoading}
            >
              {paymentLoading ? <CircularProgress size={24} /> : "Next: Payment"}
            </Button>
          </Box>
        </Grid>
      </Grid>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={() => setOpenSnackbar(false)}>
        <Alert onClose={() => setOpenSnackbar(false)} severity="error">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default BookingDetailsUI;
