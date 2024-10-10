import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDoorClosed,
  faUsers,
  faHashtag,
} from "@fortawesome/free-solid-svg-icons";
import "react-datepicker/dist/react-datepicker.css";
import "../css/CheckInCheckOut.css"; // Adjust path as necessary
import { Typography } from "@mui/material";

const CheckInCheckOut = ({
  invoiceDetails = {
    basePrice: 0,
    extraGuestCost: 0,
    bookingCharge: 0,
    bookingAmount: 0,
    payableAtCheckIn: 0,
    payableNow: 0,
  },
}) => {
  const {
    basePrice,
    extraGuestCost,
    bookingCharge,
    bookingAmount,
    payableAtCheckIn,
    payableNow,
  } = invoiceDetails;

  const reservation = {
    guestname: "John Doe",
    special_request: "Late check-in",
    booker: {
      email: "john.doe@example.com",
      phonenum: "+123456789",
      country: "USA",
      bookerid: "17",
    },
  };

  const [bookingDetails, setBookingDetails] = useState({
    checkIn: new Date(),
    checkOut: new Date(),
    guests: 3,
    rooms: 1,
  });

  const [editableFields, setEditableFields] = useState({
    checkIn: false,
    checkOut: false,
    guests: false,
    rooms: false,
  });

  const [dynamicDetails, setDynamicDetails] = useState({
    basePrice,
    extraGuestCost,
    bookingCharge,
    bookingAmount,
    payableAtCheckIn,
    payableNow,
    forDetails: `For 1 night, 1 room, and 2 guests`,
    status: "Upcoming",
    paymentStatus: "Pending",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingDetails({ ...bookingDetails, [name]: value });
  };

  const handleDateChange = (date, field) => {
    setBookingDetails({ ...bookingDetails, [field]: date });
  };

  const [saving, setSaving] = useState(false);
  const handleBlur = (field) => {
    // Any logic you want to execute on blur, for example, validation or state updates
    console.log(`${field} blurred`); // Just an example
  };

  const handleUpdateDetails = (type) => {
    if (type === "edit") {
      setEditableFields({
        checkIn: true,
        checkOut: true,
        guests: true,
        rooms: true,
      });
      return; // Exit early for editing
    }

    if (type === "save") {
      setSaving(true); // Disable the save button
    }

    const nights = Math.ceil(
      (bookingDetails.checkOut - bookingDetails.checkIn) / (1000 * 60 * 60 * 24)
    );
    const rooms = bookingDetails.rooms;
    const guests = bookingDetails.guests;

    const updatedBasePrice = basePrice * nights * rooms;
    const updatedExtraGuestCost =
      extraGuestCost * (guests - 2 > 0 ? guests - 2 : 0);
    const updatedBookingAmount =
      updatedBasePrice + updatedExtraGuestCost + bookingCharge;
    const updatedPayableAtCheckIn = updatedBookingAmount;
    const updatedPayableNow = bookingCharge;

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

    if (type === "save") {
      setEditableFields({
        checkIn: false,
        checkOut: false,
        guests: false,
        rooms: false,
      });
      setTimeout(() => {
        setSaving(false); // Enable the button again after save
      }, 2000); // Set a delay of 2 seconds, for example
    }
  };

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
                    <FontAwesomeIcon icon={faDoorClosed} />
                  </span>
                  <span>{dynamicDetails?.roomType || "Private Room"}</span>
                  <span style={{ margin: "0 4px", color: "#6c757d" }}>•</span>
                  <span className="icon" style={{ fontSize: "0.75rem" }}>
                    <FontAwesomeIcon icon={faUsers} />
                  </span>
                  <span>{dynamicDetails?.guests || "2"} Guests</span>
                </div>
                <div className="booking-id-container">
                  <span className="icon" style={{ fontSize: "0.75rem" }}>
                    <strong style={{ marginRight: "4px" }}>Booking ID:</strong>
                    <FontAwesomeIcon
                      icon={faHashtag}
                      style={{ marginRight: "4px" }}
                    />
                    {reservation.booker.bookerid}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-details mb-4">
            <div className="booking-details-table">
              <table className="table-horizontal editable-table">
                <thead>
                  <tr>
                    <th>Check In</th>
                    <th>Check Out</th>
                    <th>Guests</th>
                    <th>Rooms</th>
                    <th>Status</th>
                    <th>Payment</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {editableFields.checkIn ? (
                        <DatePicker
                          selected={bookingDetails.checkIn}
                          onChange={(date) => handleDateChange(date, "checkIn")}
                          dateFormat="MMM d, yyyy"
                          className="table-input"
                          onBlur={() => handleBlur("checkIn")}
                        />
                      ) : (
                        <span>
                          {bookingDetails.checkIn.toLocaleDateString()}
                        </span>
                      )}
                    </td>

                    <td>
                      {editableFields.checkOut ? (
                        <DatePicker
                          selected={bookingDetails.checkOut}
                          onChange={(date) =>
                            handleDateChange(date, "checkOut")
                          }
                          dateFormat="MMM d, yyyy"
                          className="table-input"
                          onBlur={() => handleBlur("checkOut")}
                        />
                      ) : (
                        <span>
                          {bookingDetails.checkOut.toLocaleDateString()}
                        </span>
                      )}
                    </td>

                    <td>
                      {editableFields.guests ? (
                        <select
                          name="guests"
                          value={bookingDetails.guests}
                          onChange={handleInputChange}
                          className="table-input"
                          onBlur={() => handleBlur("guests")}
                        >
                          {[1, 2, 3, 4, 5, 6].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{bookingDetails.guests}</span>
                      )}
                    </td>

                    <td>
                      {editableFields.rooms ? (
                        <select
                          name="rooms"
                          value={bookingDetails.rooms}
                          onChange={handleInputChange}
                          className="table-input"
                          onBlur={() => handleBlur("rooms")}
                        >
                          {[1, 2, 3, 4].map((num) => (
                            <option key={num} value={num}>
                              {num}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <span>{bookingDetails.rooms}</span>
                      )}
                    </td>
                    <td>{dynamicDetails.status}</td>
                    <td>{dynamicDetails.paymentStatus}</td>
                  </tr>
                </tbody>
              </table>
              <div className="update-details-container">
                <button
                  className="btn-edit"
                  onClick={() => handleUpdateDetails("edit")}
                >
                  Edit
                </button>
                <button
                  className="btn-save"
                  onClick={() => handleUpdateDetails("save")}
                  disabled={saving} // Disable when saving
                >
                  {saving ? "Saving..." : "Save"} {/* Show feedback */}
                </button>

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
            <Typography sx={{ mt: 2, fontSize: "1.25rem", fontWeight: "bold" }}>
              Booker
            </Typography>
            <table className="table-horizontal editable-table">
              <thead>
                <tr>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Phone No.</th>
                  <th>Country</th>
                  <th>Special Instructions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{reservation.guestname}</td>
                  <td>{reservation.booker.email}</td>
                  <td>{reservation.booker.phonenum}</td>
                  <td>{reservation.booker.country}</td>
                  <td>{reservation.special_request}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

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
