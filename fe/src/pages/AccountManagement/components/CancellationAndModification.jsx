import React, { useState, useEffect, useMemo } from 'react';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed, faHotel, faSpa, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../css/CancellationAndModification.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { set } from 'date-fns';
import { Alert, CircularProgress, Snackbar } from '@mui/material';
import dayjs from "dayjs";

const CancellationAndModification = ({
  selectedBooking,
  invoiceDetails = {
    basePrice: 0,
    extraGuestCost: 0,
    bookingCharge: 0,
    bookingAmount: 0,
    payableAtCheckIn: 0,

  },
  bookingData
}) => {
  const { basePrice, extraGuestCost, bookingCharge, bookingAmount, payableAtCheckIn } = invoiceDetails;

  const [loading, setLoading] = useState(true);
  const [modifLoading, setModifLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState({});
  const [properties, setProperties] = useState({});
  const [bookingList, setBookingList] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: new Date(selectedBooking.checkIn),
    checkOut: new Date(selectedBooking.checkOut),
    guests: selectedBooking.guests,
    rooms: 1,
  });

  const [originalBookingDetails, setOriginalBookingDetails] = useState({});

  const [cancelLoading, setCancelLoading] = useState(false);

  const [dynamicDetails, setDynamicDetails] = useState({
    basePrice,
    extraGuestCost,
    bookingCharge,
    bookingAmount,
    payableAtCheckIn,
    forDetails: `For 1 night, 1 room, and 2 guests`,
  });

  const [selectedBookingDetails, setSelectedBookingDetails] = useState({
    name: '',
    location: '',
    bookingId: '',
  });

  useEffect(() => {
    const fetchProfile = async () => {
      if (!selectedBooking) return;
      console.log("Selected Booking:", selectedBooking);
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/getproperty`, {
          params: { propertyid: selectedBooking.propertyid },
        });
        const resall = await axios.get(`http://127.0.0.1:8000/api/property/bookinglist`, {
          params: { propertyid: selectedBooking.propertyid },
        });
        setProperties(response.data);
        setBookingList(resall.data);
        console.log("Response Data:", response.data);
        console.log("resall:", resall.data);

        setLoading(false);

      } catch (error) {
        setError("Error fetching booking data.");
        console.error(error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [selectedBooking]);


  const excludedDates = useMemo(() => {
    let dates = [];

    bookingList.forEach(booking => {
      const checkInDate = new Date(bookingDetails.checkIn);
      const checkOutDate = new Date(booking.checkout_date);

      const excludedEndDate = new Date(checkInDate);
      excludedEndDate.setDate(checkInDate.getDate() + selectedBooking.stay_length - 1);
      const allBookings = bookingList.filter(b => b.bookingid !== selectedBooking.id);
      

      allBookings.forEach(booking => {
        const checkInDate = new Date(booking.checkin_date);
        const checkOutDate = new Date(new Date(booking.checkout_date).getTime() + 1 * 24 * 60 * 60 * 1000);

        // Iterate through each day between checkInDate and checkOutDate
        let currentDate = new Date(checkInDate);
        while (currentDate < checkOutDate) { // Use < to exclude the last date
          dates.push(new Date(currentDate)); // Push a copy of the date
          currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
        }
      });

      // Iterate through each day between checkInDate and checkOutDate
      let currentDate = new Date(bookingDetails.checkIn);
      while (currentDate <= excludedEndDate) {
        dates.push(new Date(currentDate)); // Push a copy of the date
        currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
      }
    });

    return dates;
  }, [bookingList, bookingDetails]);

  // const excludedDates = useMemo(() => {
  //   let dates = [];

  //   // Calculate the range of excluded dates based on checkIn and stay_length
  //   if (bookingDetails.checkIn && bookingDetails.stay_length) {
  //     const checkInDate = new Date(bookingDetails.checkIn);
  //     const excludedEndDate = new Date(checkInDate);
  //     excludedEndDate.setDate(checkInDate.getDate() + selectedBooking.stay_length); // Calculate checkIn + stay_length

  //     // Iterate through each day between checkInDate and excludedEndDate
  //     let currentDate = new Date(checkInDate);
  //     while (currentDate < excludedEndDate) { // Use < to exclude the last date
  //       dates.push(new Date(currentDate)); // Push a copy of the date
  //       currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
  //     }
  //   }
  //   console.log('checkInDate', bookingList);

  //   // Iterate through existing bookings and exclude those dates as well
  //   bookingList.forEach(booking => {
  //     const checkInDate = new Date(booking.checkin_date);
  //     const checkOutDate = new Date(booking.checkout_date);

  //     // Iterate through each day between checkInDate and checkOutDate
  //     let currentDate = new Date(checkInDate);
  //     while (currentDate < checkOutDate) { // Use < to exclude the last date
  //       dates.push(new Date(currentDate)); // Push a copy of the date
  //       currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
  //     }
  //   });

  //   return dates;
  // }, [bookingList, bookingDetails]);

  console.log("bookingList", bookingList);
  const excludedCheckInDates = useMemo(() => {
    let dates = [];

    bookingList.forEach(booking => {
      const bookingCheckInDate = new Date(bookingDetails.checkIn);
      const bookingCheckOutDate = new Date(bookingDetails.checkOut);
      const allBookings = bookingList.filter(b => b.bookingid !== selectedBooking.id);

      allBookings.forEach(booking => {
        const checkInDate = new Date(booking.checkin_date);
        const checkOutDate = new Date(new Date(booking.checkout_date).getTime() + 1 * 24 * 60 * 60 * 1000);

        // Iterate through each day between checkInDate and checkOutDate
        let currentDate = new Date(checkInDate);
        while (currentDate < checkOutDate) { // Use < to exclude the last date
          dates.push(new Date(currentDate)); // Push a copy of the date
          currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
        }
      });

      // Exclude dates between checkInDate and one day before checkOutDate
      // let currentDate = new Date(checkInDate);
      // currentDate.setDate(currentDate.getDate() + 1); // Start excluding from the day after check-in
      // while (currentDate <= checkOutDate) {
      //     dates.push(new Date(currentDate)); // Push a copy of the date
      //     currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
      // }
    });

    return dates;
  }, [bookingList, bookingDetails]);

  const handleDateChange = (date, field) => {
    if (field === 'checkIn') {
      const newCheckInDate = date;
      const newCheckOutDate = new Date(date);
      newCheckOutDate.setDate(newCheckOutDate.getDate() + selectedBooking.stay_length); // Set to the next day
      console.log("newCheckOutDate: ", newCheckOutDate);
      console.log("date: ", date);

      if (newCheckInDate >= bookingDetails.checkOut) {
        setBookingDetails({ ...bookingDetails, checkIn: date, checkOut: newCheckOutDate });
      } else if ((new Date(bookingDetails.checkIn).getTime() - new Date(bookingDetails.checkOut).getTime()) < selectedBooking.stay_length) {
        setBookingDetails({ ...bookingDetails, checkIn: date, checkOut: newCheckOutDate });
      }
      else {
        setBookingDetails({ ...bookingDetails, checkIn: date });
      }
    } else {
      const newCheckOutDate = date;
      if (newCheckOutDate <= bookingDetails.checkIn) {
        return; // Don't update if checkout is not valid
      }
      setBookingDetails({ ...bookingDetails, checkOut: newCheckOutDate });
    }
  };

  useEffect(() => {
    if (bookingData) {
      setSelectedBookingDetails({
        name: bookingData.name,
        location: bookingData.location,
        bookingId: bookingData.id,
      });
    }

    if (selectedBooking) {
      setBookings([selectedBooking]);
    }
  }, [bookingData, selectedBooking]);

  // Set original booking details when component mounts
  useEffect(() => {
    setOriginalBookingDetails({ ...bookingDetails });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  // const handleDateChange = (date, field) => {
  //   setBookingDetails({ ...bookingDetails, [field]: date });
  // };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const handleUpdateDetails = async () => {
    setModifLoading(true);
    const allBookings = bookingList.filter(b => b.bookingid !== selectedBooking.id);

    console.log("bookingDetails.checkOut: ", bookingDetails.checkOut);
    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    
    const checkInDate = new Date(bookingDetails.checkIn);  // Create Date object for check-in date
    const checkOutDate = new Date(bookingDetails.checkOut); // Create Date object for check-out date

    console.log("checkInDateDiri: ", checkInDate);
    console.log("checkOutDateDiri: ", checkOutDate);

    if (properties.property_bookingpolicy.isModificationPolicy === 1) {
      try {
        const res = await axios.post("http://127.0.0.1:8000/api/checkbooking", {
          checkin_date: formatDate(checkInDate),  // Format check-in date
          checkout_date: formatDate(checkOutDate), // Format check-out date
          guest_count: selectedBooking.guests,
          propertyid: selectedBooking.propertyid,
          bookingId: selectedBooking.id,
        });
        if (res.data) {
          console.log("Response", res.data);
          if (res.data.status === "error") {
            setSnackbarMessage("Failed to update Booking. Booking dates are not available.");
              setSnackbarSeverity("error");
          } else if (res.data.status === "success") {
            const stayLength = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
            console.log("Stay Length sample");
            console.log("Stay Length: ", stayLength);
            const response = await axios.put(`http://127.0.0.1:8000/api/updatebooking`, {
              bookingid: selectedBooking.id,
              checkin_date: bookingDetails.checkIn.toISOString().split('T')[0],
              checkout_date: bookingDetails.checkOut.toISOString().split('T')[0],
              guest_count: bookingDetails.guests,
              lengthStay: stayLength
            });
    
            if (response.data.status === 'success') {
              setSnackbarMessage("Booking modification successfully updated.");
              setSnackbarSeverity("success");
              const checkoutUrl = response.data.checkout_url;
              console.log("Checkout URL:", response.data);
    
              if (checkoutUrl) {
                window.location.href = checkoutUrl;
              } else {
                window.location.reload();
              }
              setModifLoading(false);
            } else {
              setSnackbarMessage("Failed to update Booking. Booking dates are not available.");
              setSnackbarSeverity("error");
              setModifLoading(false);
            }
            // alert("Booking modification successfully updated.");
          }
        }
        

      } catch (error) {
        console.error("Error updating booking:", error);
        setSnackbarMessage("An error occurred while updating the booking.");
        setSnackbarSeverity("error");
      } finally {
        setModifLoading(false);
        setSnackbarOpen(true);
      }
    }
  };

  // Helper function to check for changes
  const hasChanges = () => {
    const checkInChanged = bookingDetails.checkIn.getTime() !== originalBookingDetails.checkIn?.getTime();
    const checkOutChanged = bookingDetails.checkOut.getTime() !== originalBookingDetails.checkOut?.getTime();
    const guestsChanged = bookingDetails.guests !== originalBookingDetails.guests;
    const roomsChanged = bookingDetails.rooms !== originalBookingDetails.rooms;

    return checkInChanged || checkOutChanged || guestsChanged || roomsChanged;
  };

  // Handle Cancel Booking click
  const handleCancelBooking = () => {
    setShowModal(true); // Show modal when the cancel button is clicked
  };


  const confirmCancelBooking = async () => {
    setCancelLoading(true);
    const priorDays = properties.property_bookingpolicy.cancellationDays;
    const checkinDate = new Date(selectedBooking.checkIn);
    const currentDate = new Date();
    checkinDate.setDate(checkinDate.getDate() - priorDays);
    let dayResult = 0;
    if (currentDate <= checkinDate) {
      dayResult = 1;
    } else {
      console.log("Current date is less than or equal to the check-in date minus prior days.");
    }

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refund-payment', {
        bookingid: selectedBooking.id,
        // percentage: properties.property_bookingpolicy.cancellationCharge ? properties.property_bookingpolicy.CancellationCharge : 100,
        percentage: properties.property_bookingpolicy.CancellationCharge || 100,
        dayResult: dayResult,
        isCancel: properties.property_bookingpolicy.isCancellationPolicy || 0,
      });
      console.log("Response:", response.data);
      console.log("Respons statse:", response.data.status);

      if (response.data.status === 'success') {
        setSnackbarMessage("Successfully cancelled the booking.");
        setSnackbarSeverity("success");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        setSnackbarMessage("Failed to cancel the booking.");
        setSnackbarSeverity("error");
      }

      setShowModal(false); // Hide modal after confirmation

      // Reload the page after both operations are successful
      setCancelLoading(false);
      // window.location.reload();

    } catch (error) {
      console.error("Error occurred during cancellation:", error);
      setSnackbarMessage("An error occurred while cancelling the booking.");
      setSnackbarSeverity("error");
      setCancelLoading(false);
    } finally {
      setCancelLoading(false);
      setSnackbarOpen(true);
    }
  };

  // Cancel modal click
  const closeModal = () => {
    setShowModal(false); // Hide modal
  };




  return (
    <div className="outer-container">
      <div className="container flex-row">
        {/* Left Section */}
        <div className="left-section flex-col p-6 bg-background rounded-lg shadow-md mr-4">
          <div className="upper" style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
            <img
              src={dynamicDetails?.roomImageUrl || './image1.png'}
              alt="Room"
              className="image-class"
              style={{
                marginRight: '16px',  // Space between image and text
                width: '120px',       // Image width
                height: 'auto',       // Maintain aspect ratio
                borderRadius: '8px',  // Add border radius for rounded corners
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)', // Optional: add a subtle shadow for depth
                padding: '4px'        // Optional: inner padding for a cleaner look
              }}
            />
            <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
              {/* Displaying Booking Details Beside Image */}
              <strong style={{ fontSize: '1rem' }}>{selectedBookingDetails.name}</strong>
              <p style={{ fontSize: '0.85rem', color: 'grey', margin: 0 }}>{selectedBookingDetails.location}</p>
              <p style={{ fontSize: '0.85rem', color: 'grey', margin: 0 }}>{`Booking ID: ${selectedBookingDetails.bookingId}`}</p>
              <p style={{ fontSize: '0.85rem', color: 'grey', margin: 0 }}>
                {properties && properties.property_owner ? (
                  `Property Owner: ${properties.property_owner.property_owner.firstname} ${properties.property_owner.property_owner.lastname}`
                ) : (
                  'Property Owner: Not Available'
                )}
              </p>            </div>
          </div>

          {/* Editable Booking Details */}
          <div className="booking-details mb-4">
            <div className="booking-details-table">
              <table className="table-horizontal editable-table">
                <thead>
                  <tr>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Guests</th>
                    {bookings && bookings.length > 0 && bookings[0].type !== 'Home' && <th>Rooms</th>}
                    {/* <th>Rooms</th> */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <DatePicker
                        label="Check-in"
                        selected={bookings && bookings.length > 0 ? bookingDetails.checkIn : null}
                        onChange={(date) => handleDateChange(date, 'checkIn')}
                        disabled={
                          properties &&
                          properties.property_bookingpolicy &&
                          properties.property_bookingpolicy.isModificationPolicy === 0
                        }
                        dateFormat="MMM d, yyyy"
                        className="table-input"
                        excludeDates={excludedCheckInDates}
                        minDate={new Date()}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderTopLeftRadius: "12px",
                            borderBottomLeftRadius: "12px",
                          },
                        }}
                      />
                    </td>
                    <td>
                      <DatePicker
                        label="Check-out"
                        selected={bookings && bookings.length > 0 ? bookingDetails.checkOut : null}
                        onChange={(date) => handleDateChange(date, 'checkOut')}
                        disabled={
                          properties &&
                          properties.property_bookingpolicy &&
                          properties.property_bookingpolicy.isModificationPolicy === 0
                        }
                        dateFormat="MMM d, yyyy"
                        className="table-input"
                        excludeDates={excludedDates}
                        minDate={new Date()} // +1 day for check-out
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderTopRightRadius: "12px",
                            borderBottomRightRadius: "12px",
                          },
                        }}
                      />
                    </td>
                    <td>
                      <select
                        name="guests"
                        value={bookings && bookings.length > 0 ? bookingDetails.guests : null}
                        disabled={properties &&
                          properties.property_bookingpolicy &&
                          properties.property_bookingpolicy.isModificationPolicy === 0}
                        onChange={handleInputChange}
                        className="table-input"
                      >
                        {/* {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))} */}
                        {properties.property_unitdetails && properties.property_unitdetails.length > 0 &&
                          Array.from({ length: properties.property_unitdetails[0].guest_capacity }, (_, index) => (
                            <option key={index + 1} value={index + 1}>{index + 1}</option>
                          ))
                        }
                      </select>
                    </td>

                    {bookings && bookings.length > 0 && bookings[0].type !== "Home" && <td>
                      <select
                        name="rooms"
                        value={bookingDetails.rooms}
                        disabled={properties &&
                          properties.property_bookingpolicy &&
                          properties.property_bookingpolicy.isModificationPolicy === 0}
                        onChange={handleInputChange}
                        className="table-input"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </td>}
                  </tr>
                </tbody>
              </table>

              {/* Update Details Button aligned to the right */}
              <div className="update-details-container">
                <button
                  title={properties &&
                    properties.property_bookingpolicy &&
                    properties.property_bookingpolicy.isModificationPolicy === 0 ? "No Modifications Allowed" : ""}
                  className="update-details-btn"
                  onClick={handleUpdateDetails}
                  disabled={!hasChanges() || modifLoading} // Disable if there are no changes
                  alt="Update Details"
                  style={{
                    backgroundColor: hasChanges() ? '#f8f9fa' : '#e9ecef', // Greyed out if no changes
                    color: hasChanges() ? '#007bff' : '#6c757d', // Darker grey if no changes
                    border: hasChanges() ? '1px solid #007bff' : '1px solid #ced4da', // Change border color based on state
                    padding: '8px 16px',
                    borderRadius: '8px',
                    cursor: hasChanges() ? 'pointer' : 'not-allowed', // Change cursor based on state
                    transition: 'background-color 0.3s ease',
                    marginLeft: 'auto',
                    marginTop: '0.5rem',
                    fontSize: '14px'
                  }}
                >
                  
                  {modifLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Update Details"
                )}
                </button>


              </div>
              <div className="refund-cancellation-note" style={{ textAlign: 'justify', marginTop: '0.5rem' }}>
                <h2 className="text-lg mb-4 font-bold" style={{ textAlign: 'center' }}>Refund and Cancellation Policies</h2>
                {/* <p style={{ fontSize: 'small' }}>
                  <strong>Refund Policy:</strong> Cancellations made more than 48 hours before check-in will receive a full refund.
                  Cancellations made within 48 hours of check-in will incur a charge equivalent to the first night's stay.
                </p> */}

                {properties && properties.property_bookingpolicy ? (
                  <>
                    {/* Cancellation Policy */}
                    {properties.property_bookingpolicy.isCancellationPolicy === 1 ? (
                      <p style={{ fontSize: 'small' }}>
                        <strong>Standard Cancellation Plan:</strong> If you need to cancel your booking and receive a full refund, cancellation can be made {properties.property_bookingpolicy.cancellationDays} days before check-in. After this point, refund will be deducted by {properties.property_bookingpolicy.CancellationCharge}%.
                      </p>
                    ) : (
                      <p style={{ fontSize: 'small' }}>
                        <strong>Non-Refundable Rate Plan:</strong> Once the guest confirms their reservation, cancellation will not be eligible for a refund.
                      </p>
                    )}

                    {/* Modification Policy */}
                    {properties.property_bookingpolicy.isModificationPolicy === 1 ? (
                      <p style={{ fontSize: 'small' }}>
                        <strong>Flexible Modification Rate Policy:</strong> If you need to modify your booking, changes can be made free of charge {properties.property_bookingpolicy.modificationDays} days before check-in. After this point, changes will be charged {properties.property_bookingpolicy.modificationCharge}%.
                      </p>
                    ) : (
                      <p style={{ fontSize: 'small' }}>
                        <strong>Fixed Modification Rate Policy:</strong> Once the guest confirms their reservation, no modifications will be allowed.
                      </p>
                    )}
                  </>
                ) : null}

              </div>



            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section flex-col p-6 bg-background rounded-lg shadow-md ml-4">
          <h2 className="text-lg mb-4 font-bold">Invoice Summary</h2>

          {/* Invoice Details */}
          <div className="invoice-details">
            {/* Base Price */}
            <div className="detail-item flex-row justify-between mb-1">
              <span className="detail-label font-bold" style={{ fontSize: '1rem' }}>Total Amount</span>
              <span className="detail-price font-bold">PHP ₱{bookings && bookings.length > 0 ? bookings[0].amount.toFixed(2) : '0.00'}</span>
            </div>
            <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '16px' }}>
              <p>For {bookings && bookings.length > 0 ? bookings[0].stay_length : ''} night and {bookings && bookings.length > 0 ? bookings[0].guests : ''} guests</p>
            </div>
            <hr className="divider" />

            {/* Extra Guest Cost */}
            <div className="detail-item flex-row justify-between mb-1">
              <span className="detail-label">Base Price</span>
              <span className="detail-price">PHP ₱{bookings && bookings.length > 0 ? (bookings[0].amount / 1.18).toFixed(2) : '0.00'}</span>
            </div>
            <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '8px' }}>
              Price before tax
            </div>

            {/* Booking Charge */}
            <div className="detail-item flex-row justify-between mb-1">
              <span className="detail-label">Tax Price</span>
              <span className="detail-price">PHP ₱{bookings && bookings.length > 0 ? (bookings[0].amount - (bookings[0].amount / 1.18)).toFixed(2) : '0.00'}</span>
            </div>
            <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '8px' }}>
              Tax fees applied
            </div>


          </div>

          {/* Cancel Booking Button */}
          <div className="cancel-booking-container mt-4">
            <button className="cancel-booking-btn" onClick={handleCancelBooking}>
              Cancel Booking
            </button>
          </div>
        </div>

      </div>




      {/* Modal for Cancellation Confirmation */}
      {showModal && (
        <div
          className="modal-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000, // Ensures it appears above other content
          }}
        >
          <div
            className="modal-content"
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              maxWidth: '400px',
              width: '100%',
              textAlign: 'center',
            }}
          >
            <h3
              style={{
                fontSize: '1.2rem',
                marginBottom: '20px',
                color: '#333',
              }}
            >
              Are you sure you want to cancel your booking?
            </h3>

            <div
              className="modal-buttons"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <button
                onClick={confirmCancelBooking}
                className="btn-confirm"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#e74c3c', // Red for cancel confirmation
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s',
                }}
                disabled={cancelLoading}
                onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
              >
                {cancelLoading ? (
                  <CircularProgress size={20} color="inherit" />
                ) : (
                  "Yes"
                )}
              </button>

              <button
                onClick={closeModal}
                className="btn-cancel"
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#95a5a6', // Gray for no action
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s',
                }}
                disabled={cancelLoading}
                onMouseOver={(e) => e.target.style.backgroundColor = '#7f8c8d'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#95a5a6'}
              >
                No
              </button>
            </div>
          </div>
        </div>

      )}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CancellationAndModification;