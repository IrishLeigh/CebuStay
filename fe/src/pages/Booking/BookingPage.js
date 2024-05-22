import React, { useEffect, useState } from "react";
import { AppBar, Toolbar, Typography, Grid, Button, Box } from "@mui/material";
import BookingDetails from "./BookingDetails";
import BookingGuestDetails from "./BookingGuestDetails";
import "./BookingPage.css";
import axios from "axios";
function BookingPage() {
  const [price, setPrice] = useState();
  const [basePrice, setBasePrice] = useState(1900.24);
  const [guests, setGuests] = useState("2");
  const [lengthStay, setLengthStay] = useState(2);
  const [guestDetails, setGuestDetails] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const propertyid = 60; // Replace with the property id with kang kaye
        const propertyres = await axios.get(
          "http://127.0.0.1:8000/api/getproperty",
          {
            params: {
              propertyid: propertyid,
            },
          }
        );
        console.log("Propertydata: ", propertyres.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  // Callback function to handle saving data and proceeding to payment
  const handleNextPayment = () => {
    console.log("Price:", price);
    console.log("Guests:", guests);
    console.log("Length of Stay:", lengthStay);
    console.log("Guest Details:", guestDetails); // Log guest details along with other data
    const postBooking = async () => {
      try {
        const userid = 6; // Replace with the logged in user's id
        const propertyid = 1; // Replace with the property id
        const booker_fname = guestDetails.firstName;
        const booker_lname = guestDetails.lastName;
        const booker_email = guestDetails.email;
        const booker_phone = guestDetails.phoneNumber;
        const booker_country = guestDetails.selectedCountry;
        const booker_country_code = guestDetails.countryCode;
        const is_my_book = guestDetails.bookingFor === "myself" ? true : false;
        const guestname = guestDetails.guestName;
        const guestemail = guestDetails.guestEmail;
        const stay_length = lengthStay;
        const guest_count = guests;
        const checkin_date = "2024-06-01"; // Replace with the check-in date
        const checkout_date = "2024-06-10"; // Replace with the check-out date
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
          }
        );
        console.log(bookingres.data.message);
        //BERT PADAYUN DIRE
        console.log("Booking data:", bookingres.data);
        if (bookingres) {

          try {
            const response = await axios.post('http://localhost:8000/api/create-payment-link', {
              amount: price * 100,
              description: guests,
              remarks: lengthStay,
            });

            const link = response.data.link.data.attributes.checkout_url;

            const getRes = await axios.put('http://localhost:8000/api/bookings', {
              bookingid: bookingres.data.bookingid.bookingid,
              pid: response.data.payment.pid
            });
            const postData = {
              pid: response.data.payment.pid,
              linkid: response.data.link.data.id,
              amount: price * 100,
              description: guests,
              remarks: lengthStay,
            };

            await axios.put('http://localhost:8000/api/update-payment-link', postData);

            window.open(link, '_blank');

          } catch (error) {
            console.error('Error creating payment link:', error);
          }

        }

      } catch (error) {
        console.log(error);
      }
    };

    postBooking();
  };

  const handlePriceChange = (newPrice) => {
    setPrice(newPrice);
  };

  const handleGuestDetailsChange = (guestDetails) => {
    setGuestDetails(guestDetails); // Update guest details state
  };

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
            basePrice={basePrice}
            setBasePrice={setBasePrice}
            guests={guests}
            setGuests={setGuests}
            lengthStay={lengthStay}
            setLengthStay={setLengthStay}
            onPriceChange={handlePriceChange}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <BookingGuestDetails
            onGuestDetailsChange={handleGuestDetailsChange}
          />
          <Box mt={2} sx={{ display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleNextPayment}
            >
              Next : Payment
            </Button>
          </Box>
        </Grid>
      </Grid>
    </div>
  );
}

export default BookingPage;
