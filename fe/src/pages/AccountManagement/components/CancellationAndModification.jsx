import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faDoorClosed, faHotel, faSpa, faUsers } from '@fortawesome/free-solid-svg-icons';
import '../css/CancellationAndModification.css';
import 'react-datepicker/dist/react-datepicker.css';

const CancellationAndModification = ({
  houseRulesComponent,
  invoiceDetails = {
    basePrice: 0,
    extraGuestCost: 0,
    bookingCharge: 0,
    bookingAmount: 0,
    payableAtCheckIn: 0,
  },
  bookingData // New prop to receive booking data
}) => {
  const { basePrice, extraGuestCost, bookingCharge } = invoiceDetails;

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: new Date(),
    checkOut: new Date(),
    guests: 3,
    rooms: 1,
  });

  // New state to store original booking details
  const [originalBookingDetails, setOriginalBookingDetails] = useState({}); 

  const [dynamicDetails, setDynamicDetails] = useState({
    basePrice,
    extraGuestCost,
    bookingCharge,
    bookingAmount: 0,
    payableAtCheckIn: 0,
    pricePerNight: 0, // Add pricePerNight to dynamic details
    forDetails: `For 1 night, 1 room, and 2 guests`,
  });

  const [selectedBookingDetails, setSelectedBookingDetails] = useState({
    name: '',
    location: '',
    bookingId: '',
  });

  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  // Use useEffect to set booking data when bookingData prop changes
  useEffect(() => {
    if (bookingData) {
      setSelectedBookingDetails({
        name: bookingData.name,
        location: bookingData.location,
        bookingId: bookingData.id,
      });
    }
  }, [bookingData]);

  // Set original booking details when component mounts
  useEffect(() => {
    setOriginalBookingDetails({ ...bookingDetails });
  }, []);

  // Update dynamic details based on the booking details
  useEffect(() => {
    updateDynamicDetails();
  }, [bookingDetails]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleDateChange = (date, field) => {
    setBookingDetails({ ...bookingDetails, [field]: date });
  };

  // Function to update dynamic details based on booking information
  const updateDynamicDetails = () => {
    const nights = Math.ceil((bookingDetails.checkOut - bookingDetails.checkIn) / (1000 * 60 * 60 * 24));
    const rooms = bookingDetails.rooms;
    const guests = bookingDetails.guests;

    const updatedBasePrice = basePrice * nights * rooms;
    const updatedExtraGuestCost = extraGuestCost * (guests - 2 > 0 ? guests - 2 : 0);
    const updatedBookingAmount = updatedBasePrice + updatedExtraGuestCost + bookingCharge;
    const updatedPayableAtCheckIn = updatedBookingAmount;

    // Calculate price per night
    const updatedPricePerNight = updatedBasePrice / nights; // Make sure to handle division by zero if needed

    setDynamicDetails({
      basePrice: updatedBasePrice,
      extraGuestCost: updatedExtraGuestCost,
      bookingCharge,
      bookingAmount: updatedBookingAmount,
      payableAtCheckIn: updatedPayableAtCheckIn,
      pricePerNight: updatedPricePerNight, // Update pricePerNight
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

  // Confirm Cancel Booking
  const confirmCancelBooking = () => {
    // Logic to handle booking cancellation
    console.log("Booking Cancelled: ", selectedBookingDetails.bookingId);
    setShowModal(false); // Hide modal after confirmation
  };

  // Cancel modal click
  const closeModal = () => {
    setShowModal(false); // Hide modal
  };

  // New function to handle updating the booking details
  const handleUpdateDetails = () => {
    // Logic to handle updating booking details
    console.log("Booking Updated: ", bookingDetails);
    // You may also want to reset originalBookingDetails if needed
    setOriginalBookingDetails({ ...bookingDetails });
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
                    <th>Rooms</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <DatePicker
                        selected={bookingDetails.checkIn}
                        onChange={(date) => handleDateChange(date, 'checkIn')}
                        dateFormat="MMM d, yyyy"
                        className="table-input"
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={bookingDetails.checkOut}
                        onChange={(date) => handleDateChange(date, 'checkOut')}
                        dateFormat="MMM d, yyyy"
                        className="table-input"
                      />
                    </td>
                    <td>
                      <select
                        name="guests"
                        value={bookingDetails.guests}
                        onChange={handleInputChange}
                        className="table-input"
                      >
                        {[1, 2, 3, 4, 5, 6].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        name="rooms"
                        value={bookingDetails.rooms}
                        onChange={handleInputChange}
                        className="table-input"
                      >
                        {[1, 2, 3, 4].map(num => (
                          <option key={num} value={num}>{num}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Update Details Button aligned to the right */}
              <div className="update-details-container">
                <button 
                  className="update-details-btn" 
                  onClick={handleUpdateDetails}
                  disabled={!hasChanges()} // Disable if there are no changes
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
              <div className="refund-cancellation-note" style={{textAlign:'justify', marginTop:'0.5rem'}}>
        <h2 className="text-lg mb-4 font-bold" style={{textAlign:'center'}}>Refund and Cancellation Policies</h2>
        <p style={{fontSize:'small'}}>
          <strong>Refund Policy:</strong> Cancellations made more than 48 hours before check-in will receive a full refund. 
          Cancellations made within 48 hours of check-in will incur a charge equivalent to the first night's stay.
        </p>
        <p style={{fontSize:'small'}}>
          <strong>Cancellation Policy:</strong> If you need to modify your booking, changes can be made up to 24 hours before check-in.
          No modifications are allowed within 24 hours of check-in, and cancellations during this period will be charged in full.
        </p>
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
      <span className="detail-label font-bold">Base Price</span>
      <span className="detail-price font-bold">USD ${dynamicDetails?.basePrice?.toFixed(2) ?? '0.00'}</span>
    </div>
    <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '16px' }}>
      {dynamicDetails.forDetails} {/* Dynamic description */}
    </div>
    <hr className="divider" />
    {/* Price Per Night */}
    <div className="detail-item flex-row justify-between mb-1">
      <span className="detail-label" style={{ fontSize: '0.85rem' }}>Price Per Night</span> {/* Smaller font size */}
      <span className="detail-price" style={{ fontSize: '0.85rem' }}>
        USD ${dynamicDetails?.pricePerNight?.toFixed(2) ?? '0.00'}
      </span>
    </div>
    <hr className="divider" />

    {/* Extra Guest Cost */}
    <div className="detail-item flex-row justify-between mb-1">
      <span className="detail-label" style={{ fontSize: '0.85rem' }}>Extra Guest Cost</span>
      <span className="detail-price" style={{ fontSize: '0.85rem' }}>USD ${dynamicDetails?.extraGuestCost?.toFixed(2) ?? '0.00'}</span>
    </div>
    <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '8px' }}>
      For each guest over 2.
    </div>
    <hr className="divider" />

    {/* Booking Charge */}
    <div className="detail-item flex-row justify-between mb-1">
      <span className="detail-label" style={{ fontSize: '0.85rem' }}>Booking Charge</span>
      <span className="detail-price" style={{ fontSize: '0.85rem' }}>USD ${dynamicDetails?.bookingCharge?.toFixed(2) ?? '0.00'}</span>
    </div>
    <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '8px' }}>
      Service fees applied.
    </div>
    <hr className="divider" />

    {/* Total Amount */}
    <div className="detail-item flex-row justify-between mb-1">
      <span className="detail-label font-bold" style={{ fontSize: '1rem' }}>Total Amount</span>
      <span className="detail-price font-bold" style={{ fontSize: '1rem' }}>USD ${dynamicDetails?.bookingAmount?.toFixed(2) ?? '0.00'}</span>
    </div>
    <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '16px' }}>
      Total charges for your booking.
    </div>
    <hr className="divider" />


    {/* Payable at Check-In */}
    <div className="detail-item flex-row justify-between mb-1">
      <span className="detail-label font-bold" style={{ fontSize: '0.85rem' }}>Payable at Check-In</span>
      <span className="detail-price" style={{ fontSize: '0.85rem' }}>USD ${dynamicDetails?.payableAtCheckIn?.toFixed(2) ?? '0.00'}</span>
    </div>
    <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '16px' }}>
      This amount is due upon arrival.
    </div>
    <hr className="divider" />

    {/* Cancellation Fee */}
    <div className="detail-item flex-row justify-between mb-1">
      <span className="detail-label font-bold" style={{ fontSize: '0.85rem' }}>Cancellation Fee</span>
      <span className="detail-price" style={{ fontSize: '0.85rem' }}>USD $50</span>
    </div>
    <div className="detail-info" style={{ fontSize: '0.75rem', color: 'grey', marginBottom: '16px' }}>
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
        onMouseOver={(e) => e.target.style.backgroundColor = '#c0392b'}
        onMouseOut={(e) => e.target.style.backgroundColor = '#e74c3c'}
      >
        Yes
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
