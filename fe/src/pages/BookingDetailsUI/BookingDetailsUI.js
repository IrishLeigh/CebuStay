import React, { useEffect, useRef, useState } from "react";
import { AppBar, Toolbar, Typography, Grid, Button, Box, CircularProgress, Snackbar, Alert, Container } from "@mui/material";
import BookingDetails from "./BookingDetails";
import BookingGuestDetails from "./BookingGuestDetails";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import countryCodePatterns from "../../components/Booking/countryCodePatterns";
import { set } from "date-fns";

function BookingDetailsUI() {
  const [price, setPrice] = useState(null);
  const [lengthStay, setLengthStay] = useState();
  const [propertyData, setPropertyData] = useState(null);
  const [guestDetails, setGuestDetails] = useState(null);
  const { propertyid } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [paymentLoading, setPaymentLoading] = useState(false); 
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const location = useLocation();
  const [propertyImages, setPropertyImages] = useState([]);
  const [propertyUnitDetails, setPropertyUnitDetails] = useState([]);
  const [userProfile, setUserProfile] = useState(null);
  const [errorMessage, setErrorMessage] = useState([]);

  
  // Extract query parameters
  const searchParams = new URLSearchParams(location.search);
  const guestCount = searchParams.get("guestCount") || 0;
  const checkin_date = searchParams.get("checkInDate") || '';
  const checkout_date = searchParams.get("checkOutDate") || '';
  const topRef = useRef(null); // Create a ref for scrolling to the top

  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [propertyData, user]); // Add dependencies based on when you want to scroll
  
  useEffect(() => {

    if (checkin_date && checkout_date) {
      const checkIn = new Date(checkin_date);
      const checkOut = new Date(checkout_date);
      
      // Calculate the difference in time and convert it to days
      const timeDifference = checkOut - checkIn;
      const dayDifference = timeDifference / (1000 * 3600 * 24);
      
      setLengthStay(dayDifference > 0 ? dayDifference : 1); // Ensure at least 1 day
    }
  }, [checkin_date, checkout_date]);
  
 //  Get Token
 useEffect(() => {
  const token = localStorage.getItem("auth_token");
  if (token) {
    axios
      .post("http://127.0.0.1:8000/api/decodetoken", { token: token })
      .then((response) => {
        setUser(response.data["data"]);
        console.log("RESPONSE DATA: ", response.data["data"]);
      })
      .catch((error) => {
        console.log("Error decoding JWT token:", error);
        setUser(null);
      });
  } else {
    setUser(null);
  }
}, []);

  // Fetch property and user data
  useEffect(() => {
    const fetchPropertyData = async () => {
      try {
        const res = await axios.get(`http://127.0.0.1:8000/api/getfiles/${propertyid}`);
        if (res.data) {
          const images = res.data.img.map((image, index) => ({
            id: image.id,
            caption: image.caption,
            src: image.src,
            rows: index === 0 ? 2 : 1,
            cols: index === 0 ? 2 : 1,
          }));
          setPropertyImages(images);
          
          const res2 = await axios.get("http://127.0.0.1:8000/api/getproperty", {
            params: { propertyid }
          });
          if (res2.data) {
            setPropertyData(res2.data);
            setPropertyUnitDetails(res2.data.property_unitdetails);
          }
        }
      } catch (err) {
        console.error("Error fetching property data:", err);
      } finally {
        setLoading(false); 
      }
    };


    fetchPropertyData();

  }, [propertyid]);

// Validate phone number based on country code pattern
const validatePhoneNumber = (countryCode, phoneNumber) => {
  const pattern = countryCodePatterns[countryCode];
  return pattern ? pattern.test(phoneNumber) : false;
};

  // Guest details validation
  const validateGuestDetails = () => {
    setErrorMessage([]); // Reset errors before validation
  
    let errors = []; // Temporarily store errors
  
    if(guestDetails.arrivalTime === "") {
      errors.push("Please select arrival time");
    }
    if(guestDetails.bookingFor === 0 && guestDetails.guestName === "" ) {
      errors.push("Please enter guest name");
    }
    if(guestDetails.bookingFor === 0 && guestDetails.guestEmail === "") {
      errors.push("Please enter guest email");
    }
    if(guestDetails.requests === "") {
      errors.push("Please enter special request");
    }
    if(guestDetails.phoneNumber === "") {
      errors.push("Please enter phone number");
    }
    if(validatePhoneNumber(guestDetails.countryCode, guestDetails.phoneNumber) === false) {
      errors.push("Please enter a valid phone number");
    }
  
    if (errors.length > 0) {
      setErrorMessage(errors); // Set errors in state
      return false;
    }
    return true;
  };

  const handleNextPayment = async () => {
    if (!validateGuestDetails()) {
      setSnackbarMessage("Please fill in all required fields.");
      setOpenSnackbar(true);
      return;
    }

    setPaymentLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:8000/api/insertbooking", { 
          userid: user.userid,
          propertyid,
          unitid: propertyData.property_unitdetails[0].unitid,
          booker_fname: guestDetails.firstName,
          booker_lname: guestDetails.lastName,
          booker_email: guestDetails.email,
          booker_phone: guestDetails.phoneNumber,
          booker_country: "Philippines",
          booker_country_code: guestDetails.countryCode,
          is_my_book: guestDetails.bookingFor,
          guestname: guestDetails.guestName,
          stay_length: lengthStay,
          guest_count: guestCount,
          checkin_date,
          checkout_date,
          total_price: propertyData.property_unitdetails[0].unitpricing.min_price,
          special_request: guestDetails.requests,
          arrival_time: guestDetails.arrivalTime,
          status: "Pending",
          booking_date: new Date().toISOString().split("T")[0],
        });
        console.log("HERE", res.data);

        if( res.data.status === "success") {
          const res2 = await axios.post("http://127.0.0.1:8000/api/create-payment-link", {
              monthlyAmount : price,
              propertyid,
              amount : propertyData.property_unitdetails[0].unitpricing.min_price,
              description: propertyData.property_details.property_name,
              status: "Pending",
              length: lengthStay,
              return_url: 'http://localhost:3000/paymentVerification',
              bookingid: res.data.bookingid,
            });
            const checkoutUrl = res2.data.checkout_session_url;
            console.log("Checkout URL:", checkoutUrl);
            window.location.href = checkoutUrl;
            
      

          }else {
            setSnackbarMessage(res.data.message);
            setOpenSnackbar(true);
          }
     
      // window.location.href = checkoutUrl;
    } catch (e) {
      console.error("Booking error:", e);
        setSnackbarMessage("Error processing booking.");
        setOpenSnackbar(true);
    } finally {
      setPaymentLoading(false);
    }
  };


  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" , width: '100%'}}>
        <CircularProgress />
      </Box>
    );
  }

  // console.log("Property Price MAO GYUD NI :", price);
  console.log("guest", guestDetails);
  return (
    <div ref={topRef} style={{ width : '100%'  }}>
      <AppBar position="static" sx={{ background: "#16B4DD" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ margin: '0 auto', maxWidth: 'lg', width: '100%' ,padding: '1%' }}>
            Booking Details
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
      <Grid container spacing={2} >
        <Grid item xs={12} md={4}>
          <BookingDetails
            lengthStay={lengthStay}
            setLengthStay={setLengthStay}
            onPriceChange={setPrice}
            PropertyData={propertyUnitDetails}
            propertyData2 = {propertyData}
            checkin_date={checkin_date}
            checkout_date={checkout_date}
            guestCapacity={guestCount}
            address = {propertyData?.property_address}
            details = {propertyData?.property_details}
            facilities = {propertyData.property_facilities}
            houseRules = {propertyData?.property_houserules}
         
          />
        </Grid>
        <Grid item xs={12} md={8} pb = {2}>
          <BookingGuestDetails
            onGuestDetailsChange={setGuestDetails}
            User={user}
            PropertyData={propertyData}
            errorMessage = {errorMessage}
          />
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
      <Snackbar 
        open={openSnackbar} 
        autoHideDuration={6000} 
        onClose={() => setOpenSnackbar(false)} 
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
        <Alert onClose={() => setOpenSnackbar(false)} severity="error" variant="filled"> 
          {snackbarMessage}
        </Alert>
      </Snackbar>
      </Container>
     
    </div>
  );
}

export default BookingDetailsUI;
