import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Grid, Button, Box, CircularProgress, Snackbar, Alert } from "@mui/material";
import BookingDetails from "./BookingDetails";
import BookingGuestDetails from "./BookingGuestDetails";
import "./BookingPage.css";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

function BookingDetailsUI() {
  const [price, setPrice] = useState();
 
  const [lengthStay, setLengthStay] = useState(2);
  const [propertyData, setPropertyData] = useState(null);
  const [guestDetails, setGuestDetails] = useState(null);
  const { propertyid } = useParams();
  // const propertyid = 6;
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true); // Loading state for initial data fetching
  const [paymentLoading, setPaymentLoading] = useState(false); // Loading state for payment process
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const location = useLocation();
  const { guestCount, checkin_date, checkout_date } = location.state;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // useEffect(() => {
  //   const handleBeforeUnload = (event) => {
  //     event.preventDefault();
  //     event.returnValue = 'Are you sure you want to leave? Your changes will not be saved.';
  //   };

  //   window.addEventListener('beforeunload', handleBeforeUnload);

  //   return () => {
  //     window.removeEventListener('beforeunload', handleBeforeUnload);
  //   };
  // }, []);

  //decode token
  useEffect(() => {
    const token = localStorage.getItem("auth_token");

    if (token) {
      axios
        .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
        .then((response) => {
          setUser(response.data["data"]);
          console.log("User: ", response.data["data"]);
        })
        .catch((error) => {
          console.log("Error decoding JWT token:", error);
          setUser(null);
        });
    } else {
      setUser(null);
    }
  }, []);

  //fetch property data
  useEffect(() => {
    const fetchData = async () => {
      const propertyId = propertyid;
      try {
        console.log("Propertyid FROM BOOKING DETAILS: ", propertyId);
        const propertyres = await axios.get(
          "http://127.0.0.1:8000/api/getproperty",
          {
            params: {
              propertyid: propertyId,
            },
          }
        );

        console.log("Propertydata: ", propertyres.data);
        setPropertyData(propertyres.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Set loading to false once data is fetched
      }
    };
    fetchData();
  }, [propertyid]);

  const validateGuestDetails = (details) => {
    if (!details) return false;
    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "selectedCountry",
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
      const checkin = checkin_date;
      const checkout = checkout_date
    try {
      const userid = user.userid;
      const unitid = propertyData.property_unitrooms.unitid;  
      const booker_fname = guestDetails.firstName;
      const booker_lname = guestDetails.lastName;
      const booker_email = guestDetails.email;
      const booker_phone = guestDetails.phoneNumber;
      const booker_country = guestDetails.selectedCountry;
      const booker_country_code = guestDetails.countryCode;
      const is_my_book = guestDetails.bookingFor === "myself";
      const guestname = guestDetails.guestName;
      const guestemail = guestDetails.guestEmail;
      const stay_length = lengthStay;
      const guest_count = guestCount;
      const checkin_date = checkin;
      const checkout_date = checkout;
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

      const bookingres = await axios.post(
        "http://127.0.0.1:8000/api/insertbooking",
        {
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
        }
      );

      console.log("Booking data:", bookingres.data);
      console.log("Booking ID:", bookingres.data.bookingid);

      if (bookingres) {
        try {
          const paymentResponse = await axios.post(
            "http://127.0.0.1:8000/api/create-payment-link",
            {
              amount: price * 100,
              description: propertyData.property_details.property_name,
              return_url: "http://localhost:3000/paymentVerification",
              bookingid: bookingres.data.bookingid,
            }
          );

          const checkoutUrl = paymentResponse.data.checkout_session_url;
          
          const getRes = await axios.put("http://localhost:8000/api/bookings", {
            bookingid: bookingres.data.bookingid,
            pid: paymentResponse.data.payment.pid,
          });

          if (checkoutUrl) {
            window.location.href = checkoutUrl;
          } else {
            console.error("Checkout session URL not found in the response data");
            setSnackbarMessage("Checkout session URL not found.");
            setOpenSnackbar(true);
          }
        } catch (error) {
          console.error("Error creating checkout session:", error);
          setSnackbarMessage("Error creating checkout session.");
          setOpenSnackbar(true);
        }
      }
    } catch (e) {
      console.error(e);
      // setSnackbarMessage("Error processing booking.");
      // setOpenSnackbar(true);
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

  console.log("User", user);
  console.log("GUEEEEEEEEEEEEEST CAPACITYYY", guestCount);
  console.log("CHECKIIIIIIIIIING DATEEE", checkin_date);
  console.log("CHECKOUT DATEEE", checkout_date);

  return (
    <div>
      <AppBar position="static" sx={{ background: "#16B4DD" }}>
        <Toolbar>
          <Typography variant="h6">Your Booking Details</Typography>
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
          <BookingGuestDetails onGuestDetailsChange={handleGuestDetailsChange} User={user} PropertyData={propertyData}/>
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
