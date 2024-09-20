import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorClosed,
  faHotel,
  faSpa,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";
import "./CheckInCheckOut.css";
import "react-datepicker/dist/react-datepicker.css";
import PropertyHouseRules from "../PropertyDetailsUI/components/PropertyHouseRules";

const CheckInCheckOut = ({
  propertyinfo,
  invoiceDetails = {
    basePrice: 0,
    extraGuestCost: 0,
    bookingCharge: 0,
    bookingAmount: 0,
    payableAtCheckIn: 0,
    payableNow: 0, // New field for payable amount now
  },
}) => {
  // Destructuring invoiceDetails to extract values
  const {
    basePrice,
    extraGuestCost,
    bookingCharge,
    bookingAmount,
    payableAtCheckIn,
    payableNow, // Destructured for dynamic calculation
  } = invoiceDetails;

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
    payableNow, // Add payableNow to dynamic details
    forDetails: `For 1 night, 1 room, and 2 guests`,
    status: "Upcoming", // Default status
    paymentStatus: "Pending", // Default payment status
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
    private: { icon: faDoorClosed, label: "Private Room" },
    hotel: { icon: faHotel, label: "Hotel Room" },
    resort: { icon: faSpa, label: "Resort" },
  };

  // Handle Update Details click
  const handleUpdateDetails = (type) => {
    const nights = Math.ceil(
      (bookingDetails.checkOut - bookingDetails.checkIn) / (1000 * 60 * 60 * 24)
    );
    const rooms = bookingDetails.rooms;
    const guests = bookingDetails.guests;

    // Calculate the base price, extra guest cost, and total amount
    const updatedBasePrice = basePrice * nights * rooms;
    const updatedExtraGuestCost =
      extraGuestCost * (guests - 2 > 0 ? guests - 2 : 0);
    const updatedBookingAmount =
      updatedBasePrice + updatedExtraGuestCost + bookingCharge;
    const updatedPayableAtCheckIn = updatedBookingAmount;
    const updatedPayableNow = bookingCharge; // You can adjust this logic for deposit

    // Update dynamic details with new values
    setDynamicDetails({
      ...dynamicDetails,
      basePrice: updatedBasePrice,
      extraGuestCost: updatedExtraGuestCost,
      bookingCharge,
      bookingAmount: updatedBookingAmount,
      payableAtCheckIn: updatedPayableAtCheckIn,
      payableNow: updatedPayableNow,
      forDetails: `For ${nights} night${nights > 1 ? "s" : ""}, ${rooms} room${
        rooms > 1 ? "s" : ""
      }, and ${guests} guest${guests > 1 ? "s" : ""}`,
    });
  };

  // Dynamically determine status and payment status
  useEffect(() => {
    const now = new Date();
    let status = "Upcoming";
    let paymentStatus = "Pending";

    if (now > bookingDetails.checkOut) {
      status = "Checked Out";
    } else if (
      now >= bookingDetails.checkIn &&
      now <= bookingDetails.checkOut
    ) {
      status = "Checked In";
    }

    if (dynamicDetails.payableNow > 0) {
      paymentStatus = "Partially Paid";
    }

    setDynamicDetails((prevDetails) => ({
      ...prevDetails,
      status,
      paymentStatus,
    }));
  }, [bookingDetails, dynamicDetails.payableNow]);

  return (
    <div className="outer-container" style={{ height: "100vh" }}>
      <div className="container flex-row">
        {/* Left Section */}
        <div className="left-section flex-col p-6 bg-background rounded-lg shadow-md mr-4">
          <div className="flex-row items-center mb-4">
            <img
              src={dynamicDetails?.roomImageUrl || "./image1.png"}
              alt="Room"
              className="image-class mr-4"
            />

            <div>
              <h2 className="text-lg">
                {dynamicDetails?.roomTitle ||
                  "A vibrant stay for leisure travellers, 1.9 km from Baga Beach"}
              </h2>
              <p className="text-muted-foreground">
                {dynamicDetails?.location || "Baga, North Goa, Goa"}
              </p>

              <div
                className="flex-row items-center justify-start mt-2"
                style={{ gap: "2px" }}
              >
                <div
                  className="flex-row items-center"
                  style={{ fontSize: "0.75rem", color: "#6c757d", gap: "2px" }}
                >
                  <span className="icon" style={{ fontSize: "0.75rem" }}>
                    <FontAwesomeIcon
                      icon={
                        roomTypeMapping[dynamicDetails?.roomType]?.icon ||
                        faDoorClosed
                      }
                    />
                  </span>
                  <span>
                    {roomTypeMapping[dynamicDetails?.roomType]?.label ||
                      "Private Room"}
                  </span>
                  <span style={{ margin: "0 4px", color: "#6c757d" }}>•</span>
                  <span className="icon" style={{ fontSize: "0.75rem" }}>
                    <FontAwesomeIcon icon={faUsers} />
                  </span>
                  <span>{dynamicDetails?.guests || "2"} Guests</span>
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
                    <th>Status</th> {/* Status column */}
                    <th>Payment</th> {/* Payment column */}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <DatePicker
                        selected={bookingDetails.checkIn}
                        onChange={(date) => handleDateChange(date, "checkIn")}
                        dateFormat="MMM d, yyyy"
                        className="table-input"
                      />
                    </td>
                    <td>
                      <DatePicker
                        selected={bookingDetails.checkOut}
                        onChange={(date) => handleDateChange(date, "checkOut")}
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
                        {[1, 2, 3, 4, 5, 6].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
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
                        {[1, 2, 3, 4].map((num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td>{dynamicDetails.status}</td> {/* Display status */}
                    <td>{dynamicDetails.paymentStatus}</td>{" "}
                    {/* Display payment status */}
                  </tr>
                </tbody>
              </table>

              <div className="update-details-container">
                <button
                  className="btn-check-in"
                  onClick={() => handleUpdateDetails("checkIn")}
                >
                  Check In
                </button>
                <button
                  className="btn-check-out"
                  onClick={() => handleUpdateDetails("checkOut")}
                >
                  Check Out
                </button>
              </div>
            </div>
          </div>

          <div className="description mt-4">
            <PropertyHouseRules propertyinfo={propertyinfo} />
          </div>
        </div>

        {/* Right Section */}
        <div className="right-section flex-col p-6 bg-background rounded-lg shadow-md">
          <h4>Price Details</h4>
          <div className="flex-row items-center justify-between">
            <p>{dynamicDetails.forDetails}</p>
            <p>
              <span>Base Price: </span>
              <span>₱ {dynamicDetails.basePrice.toFixed(2)}</span>
            </p>
          </div>
          <div className="flex-row items-center justify-between">
            <p>Extra Guest Cost:</p>
            <p>₱ {dynamicDetails.extraGuestCost.toFixed(2)}</p>
          </div>
          <div className="flex-row items-center justify-between">
            <p>Booking Charge:</p>
            <p>₱ {dynamicDetails.bookingCharge.toFixed(2)}</p>
          </div>
          <div className="flex-row items-center justify-between">
            <p>Total Amount:</p>
            <p>₱ {dynamicDetails.bookingAmount.toFixed(2)}</p>
          </div>
          <div className="flex-row items-center justify-between">
            <p>Payable Now:</p>
            <p>₱ {dynamicDetails.payableNow.toFixed(2)}</p>
          </div>
          <div className="flex-row items-center justify-between">
            <p>Payable at Check In:</p>
            <p>₱ {dynamicDetails.payableAtCheckIn.toFixed(2)}</p>
          </div>
          <div className="detail-item flex-row justify-between mb-2">
            <span className="detail-label">Payable at Check In</span>
            <span className="detail-price">
              USD ${dynamicDetails?.payableAtCheckIn?.toFixed(2) ?? "0.00"}
            </span>
          </div>

          <button className="cancel-booking-btn w-full mt-4">
            Cancel Booking
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckInCheckOut;
