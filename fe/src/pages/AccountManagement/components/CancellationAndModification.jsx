import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDoorClosed, faHotel, faSpa, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../css/CancellationAndModification.css';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { set } from 'date-fns';
import { CircularProgress } from '@mui/material';

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
  const [error, setError] = useState('');
  const [bookings, setBookings] = useState({});
  const [properties, setProperties] = useState({});
  const [showModal, setShowModal] = useState(false);

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
        setProperties(response.data);
        console.log("Response Data:", response.data);

        setLoading(false);

      } catch (error) {
        setError("Error fetching profile data.");
        console.error(error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [selectedBooking]);




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

  const handleDateChange = (date, field) => {
    setBookingDetails({ ...bookingDetails, [field]: date });
  };

  const handleUpdateDetails = () => {
    const nights = Math.ceil((bookingDetails.checkOut - bookingDetails.checkIn) / (1000 * 60 * 60 * 24));
    const rooms = bookingDetails.rooms;
    const guests = bookingDetails.guests;

    const updatedBasePrice = basePrice * nights * rooms;
    const updatedExtraGuestCost = extraGuestCost * (guests - 2 > 0 ? guests - 2 : 0);
    const updatedBookingAmount = updatedBasePrice + updatedExtraGuestCost + bookingCharge;
    const updatedPayableAtCheckIn = updatedBookingAmount;

    setDynamicDetails({
      basePrice: updatedBasePrice,
      extraGuestCost: updatedExtraGuestCost,
      bookingCharge,
      bookingAmount: updatedBookingAmount,
      payableAtCheckIn: updatedPayableAtCheckIn,
      forDetails: `For ${nights} night${nights > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}, and ${guests} guest${guests > 1 ? 's' : ''}`,
    });
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
    console.log("Booking Cancelled: ", selectedBooking.id);
    console.log("Cancellation: ", properties.property_bookingpolicy.CancellationCharge);
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/refund-payment', {
        bookingid: selectedBooking.id,
        // percentage: properties.property_bookingpolicy.cancellationCharge ? properties.property_bookingpolicy.CancellationCharge : 100,
        percentage: properties.property_bookingpolicy.CancellationCharge || 100
      });

      console.log("Booking Cancelled: ", selectedBooking.id);
      setShowModal(false); // Hide modal after confirmation

      // Now handle the set cancel request
      // await axios.post("http://127.0.0.1:8000/api/setcancel", {
      //   bookingid: selectedBooking.id
      // });

      // Reload the page after both operations are successful
      setCancelLoading(false);
      window.location.reload();

    } catch (error) {
      console.error("Error occurred during cancellation:", error);
      setCancelLoading(false);
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
            </div>
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
                        selected={bookings && bookings.length > 0 ? bookingDetails.checkIn : null}
                        onChange={(date) => handleDateChange(date, 'checkIn')}
                        disabled={properties &&
                          properties.property_bookingpolicy &&
                          properties.property_bookingpolicy.isModificationPolicy === 0}
                        dateFormat="MMM d, yyyy"
                        className="table-input"
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={bookings && bookings.length > 0 ? bookingDetails.checkOut : null}
                        onChange={(date) => handleDateChange(date, 'checkOut')}
                        disabled={properties &&
                          properties.property_bookingpolicy &&
                          properties.property_bookingpolicy.isModificationPolicy === 0}
                        dateFormat="MMM d, yyyy"
                        className="table-input"
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
                  disabled={!hasChanges()} // Disable if there are no changes
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
                  Update Details
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
                        <strong>Standard Cancellation Plan:</strong> If you need to cancel your booking and receive a full refund, cancellation can be made up to {properties.property_bookingpolicy.cancellationDays} days before check-in. After this point, cancellation will not be eligible for a refund.
                      </p>
                    ) : (
                      <p style={{ fontSize: 'small' }}>
                        <strong>Non-Refundable Rate Plan:</strong> Once the guest confirms their reservation, cancellation will not be eligible for a refund.
                      </p>
                    )}

                    {/* Modification Policy */}
                    {properties.property_bookingpolicy.isModificationPolicy === 1 ? (
                      <p style={{ fontSize: 'small' }}>
                        <strong>Flexible Modification Rate Policy:</strong> If you need to modify your booking, changes can be made up to {properties.property_bookingpolicy.modificationDays} days before check-in. After this point, no modifications are permitted.
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

            {/* Total Amount */}
            {/* <div className="detail-item flex-row justify-between mb-1">
              <span className="detail-label font-bold" style={{ fontSize: '1rem' }}>Total Amount</span>
              <span className="detail-price font-bold" style={{ fontSize: '1rem' }}>USD ${dynamicDetails?.bookingAmount?.toFixed(2) ?? '0.00'}</span>
            </div>
            <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '16px' }}>
              Total charges for your booking.
            </div> */}

            {/* Payable at Check-In */}
            {/* <div className="detail-item flex-row justify-between mb-1">
              <span className="detail-label font-bold">Payable at Check-In</span>
              <span className="detail-price">USD ${dynamicDetails?.payableAtCheckIn?.toFixed(2) ?? '0.00'}</span>
            </div>
            <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '16px' }}>
              This amount is due upon arrival.
            </div> */}

            {/* Refund Policy */}
            {/* <hr className="divider" />
              <div className="detail-item flex-row justify-between mb-1">
                <span className="detail-label font-bold">Refund Policy</span>
                <span className="detail-info" style={{ fontSize: '0.75rem', color: 'grey' }}>
                  Please note that refunds are processed within 5-7 business days.
                </span>
              </div> */}

            {/* Cancellation Fee */}
            {/* <div className="detail-item flex-row justify-between mb-1">
              <span className="detail-label font-bold">Cancellation Fee</span>
              <span className="detail-price">USD $50</span>
            </div>
            <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '16px' }}>
            </div> */}
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
    </div>
  );
};

export default CancellationAndModification;
