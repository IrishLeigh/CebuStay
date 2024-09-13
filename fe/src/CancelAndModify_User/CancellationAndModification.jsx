import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faDoorClosed, faHotel, faSpa, faUsers } from '@fortawesome/free-solid-svg-icons';
import './CancellationAndModification.css';
import 'react-datepicker/dist/react-datepicker.css';

const CancellationAndModification = ({
  houseRulesComponent,
  invoiceDetails = {
    basePrice: 0,
    extraGuestCost: 0,
    bookingCharge: 0,
    bookingAmount: 0,
    payableAtCheckIn: 0,
  }
}) => {
  // Destructuring invoiceDetails to extract values
  const { basePrice, extraGuestCost, bookingCharge, bookingAmount, payableAtCheckIn } = invoiceDetails;

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: new Date(),
    checkOut: new Date(),
    guests: 3,
    rooms: 1,
  });

  const [dynamicDetails, setDynamicDetails] = useState({
    basePrice,
    extraGuestCost,
    bookingCharge,
    bookingAmount,
    payableAtCheckIn,
    forDetails: `For 1 night, 1 room, and 2 guests`,
  });

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  // Handle date change
  const handleDateChange = (date, field) => {
    setBookingDetails({ ...bookingDetails, [field]: date });
  };
  const roomTypeMapping = {
    private: { icon: faDoorClosed, label: 'Private Room' },
    hotel: { icon: faHotel, label: 'Hotel Room' },
    resort: { icon: faSpa, label: 'Resort' },
    // You can add more types in the future as per API response
  };

  // Handle Update Details click
  // Handle Update Details click
const handleUpdateDetails = () => {
  const nights = Math.ceil((bookingDetails.checkOut - bookingDetails.checkIn) / (1000 * 60 * 60 * 24));
  const rooms = bookingDetails.rooms;
  const guests = bookingDetails.guests;

  // Calculate the base price, extra guest cost, and total amount
  const updatedBasePrice = basePrice * nights * rooms; // If price scales with rooms
  const updatedExtraGuestCost = extraGuestCost * (guests - 2 > 0 ? guests - 2 : 0);
  const updatedBookingAmount = updatedBasePrice + updatedExtraGuestCost + bookingCharge;
  const updatedPayableAtCheckIn = updatedBookingAmount;

  // Update dynamic details with new values
  setDynamicDetails({
    basePrice: updatedBasePrice,
    extraGuestCost: updatedExtraGuestCost,
    bookingCharge,
    bookingAmount: updatedBookingAmount,
    payableAtCheckIn: updatedPayableAtCheckIn,
    forDetails: `For ${nights} night${nights > 1 ? 's' : ''}, ${rooms} room${rooms > 1 ? 's' : ''}, and ${guests} guest${guests > 1 ? 's' : ''}`,
  });
};

  return (
    <div className="outer-container">
      <div className="container flex-row">
        {/* Left Section */}
        <div className="left-section flex-col p-6 bg-background rounded-lg shadow-md mr-4">
        <div className="flex-row items-center mb-4">
  <img src={dynamicDetails?.roomImageUrl || './image1.png'} alt="Room" className="image-class mr-4" />
  
  <div>
    {/* Room Title */}
    <h2 className="text-lg">{dynamicDetails?.roomTitle || 'A vibrant stay for leisure travellers, 1.9 km from Baga Beach'}</h2>

    {/* Location */}
    <p className="text-muted-foreground">{dynamicDetails?.location || 'Baga, North Goa, Goa'}</p>



    <div className="flex-row items-center justify-start mt-2" style={{ gap: '2px' }}>
  {/* Property Type and Guests Together */}
  <div className="flex-row items-center" style={{ fontSize: '0.75rem', color: '#6c757d', gap: '2px' }}>
    {/* Room Type Icon */}
    <span className="icon" style={{ fontSize: '0.75rem' }}>
      <FontAwesomeIcon icon={roomTypeMapping[dynamicDetails?.roomType]?.icon || faDoorClosed} />
    </span>
    {/* Room Type Text */}
    <span>
      {roomTypeMapping[dynamicDetails?.roomType]?.label || 'Private Room'}
    </span>

    {/* Divider (Optional) */}
    <span style={{ margin: '0 4px', color: '#6c757d' }}>•</span>

    {/* Guest Icon */}
    <span className="icon" style={{ fontSize: '0.75rem' }}>
      <FontAwesomeIcon icon={faUsers} />
    </span>
    {/* Guests Text */}
    <span>{dynamicDetails?.guests || '2'} Guests</span>
  </div>
</div>



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
      <button className="btn-update-details-light" onClick={handleUpdateDetails}>
        Update Details
      </button>
    </div>
  </div>
</div>



          {/* House Rules Placeholder */}
          <div className="house-rules mt-4">
            {/* Replace this with your component */}
            <h3 className="text-lg">House Rules</h3>
            <ul className="list-disc list-inside">
              <li>No smoking</li>
              <li>No pets allowed</li>
              <li>Check-in after 3 PM</li>
            </ul>
            {houseRulesComponent /* Placeholder for the house rules component */}
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section flex-col p-6 bg-background rounded-lg shadow-md ml-4">
  <h2 className="text-lg mb-4 font-bold">Invoice Summary</h2>

  {/* Invoice Details */}
  <div className="invoice-details">
    {/* Base Price */}
    <div className="detail-item flex-row justify-between mb-2">
      <span className="detail-label">Base Price</span>
      <span className="detail-price">USD ${dynamicDetails?.basePrice?.toFixed(2) ?? '0.00'}</span>
    </div>
    <div className="detail-info">{dynamicDetails?.forDetails ?? 'No details available'}</div>
    <hr className="divider" />

    {/* Extra Guest Cost */}
    <div className="detail-item flex-row justify-between mb-2">
      <span className="detail-label">Extra Guest Cost</span>
      <span className="detail-price">USD ${dynamicDetails?.extraGuestCost?.toFixed(2) ?? '0.00'}</span>
    </div>
    <div className="detail-info">For additional guests</div>
    <hr className="divider" />

    {/* Booking Charge */}
    <div className="detail-item flex-row justify-between mb-2">
      <span className="detail-label">Booking Charge</span>
      <span className="detail-price">USD ${dynamicDetails?.bookingCharge?.toFixed(2) ?? '0.00'}</span>
    </div>
    <div className="detail-info">Processing fee</div>
    <hr className="divider" />

    {/* Total Booking Amount */}
    <div className="detail-item flex-row justify-between mb-2">
      <span className="detail-label detail-bold" style={{fontSize:'medium'}}>Total Booking Amount</span>
      <span className="detail-price detail-bold">USD ${dynamicDetails?.bookingAmount?.toFixed(2) ?? '0.00'}</span>
    </div>
    <hr className="divider" />

    {/* Payable Now */}
    <div className="detail-item flex-row justify-between mb-2">
      <span className="detail-label">Payable Now</span>
      <span className="detail-price">USD ${dynamicDetails?.payableNow?.toFixed(2) ?? '0.00'}</span>
    </div>
    <hr className="divider" />

    {/* Payable at Check In */}
    <div className="detail-item flex-row justify-between mb-2">
      <span className="detail-label">Payable at Check In</span>
      <span className="detail-price">USD ${dynamicDetails?.payableAtCheckIn?.toFixed(2) ?? '0.00'}</span>
    </div>
    </div>
    <button className="cancel-booking-btn w-full mt-4">Cancel Booking</button>

  </div>

  {/* Cancel Booking Button */}
</div>

      </div>
  );
};

export default CancellationAndModification;
