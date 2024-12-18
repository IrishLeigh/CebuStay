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
import axios from "axios";
import { Stack, Typography, Divider } from "@mui/material";
import PriceCheckIcon from "@mui/icons-material/PriceCheck";
import PayoutSecurityDeposit from "../modals/PayoutSecurityDeposit";
import { InsertEmoticon } from "@mui/icons-material";

const CheckInCheckOut = ({
  category,
  monthlyBasePrice,
  monthlyLengthStay,
  vatMonthly,
  totalMonthlyPrice,
  item,
  invoiceDetails = {
    basePrice: 0,
    extraGuestCost: 0,
    bookingCharge: 0,
    bookingAmount: 0,
    payableAtCheckIn: 0,
    payableNow: 0,
  },
}) => {
  const [saving, setSaving] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [error, setError] = useState(null);
  const [bookerDetails, setBookerDetails] = useState(null);
  const { basePrice, extraGuestCost, bookingCharge } = invoiceDetails;
  const [response, setResponse] = useState();
  const [editedItem, setEditedItem] = useState({ ...item });
  const [isSuccess, setIsSuccess] = useState(false);
  const [isModified, setIsModified] = useState(false);
  const [showPayoutButton, setShowPayoutButton] = useState(false);
  const [showPayoutModal, setShowPayoutModal] = useState(false);

  const handlePayoutButtonClick = () => {
    setShowPayoutModal(true);
  };

  const handleCloseModal = () => {
    setShowPayoutModal(false);
  };

  const handleConfirmPayout = () => {
    // Implement payout logic here
    console.log("Payout confirmed");
    // Close modal after confirming
    setShowPayoutModal(false);
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat("en-PH", {
      style: "currency",
      currency: "PHP",
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A'; // Handle cases where date is not available
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  const onCheckOut = () => {
    if (editedItem.status === "Confirmed") {
      // Update the status to Checked Out
      setEditedItem((prev) => ({ ...prev, status: "Checked Out" }));
      setShowPayoutButton(true); // Show the payout button
    } else {
      alert("You must confirm the booking before checking out.");
    }
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
    basePrice: 0,
    extraGuestCost: 0,
    bookingCharge: bookingCharge,
    bookingAmount: 0,
    payableAtCheckIn: 0,
    payableNow: 0,
    forDetails: `For 1 night, 1 room, and 2 guests`,
    status: "Upcoming",
    paymentStatus: "Pending",
  });

  useEffect(() => {
    const fetchBookerDetails = async () => {
      console.log("Fetching booker and guest details...");
      try {
        const id = item.bookingid ? item.bookingid : item.bhid; // Use bookingid or bhid
        let response = null;

        if (item.bookingid) {
          response = await axios.get(
            "http://127.0.0.1:8000/api/getbookerandguest",
            {
              params: { bookingid: id },
            }
          );
        } else {
          response = await axios.get(
            "http://127.0.0.1:8000/api/getbookerandguest",
            {
              params: { bhid: id },
            }
          );
        }

        if (response.data) {
          console.log("Booker and guest details:", response.data); // Log the fetched data
          setBookerDetails(response.data); // Update state with fetched data
          setResponse(response.data); // Set the response state
        }
      } catch (error) {
        console.error("Error fetching booker details:", error);
        setError(error); // Set error state
      }
    };

    if (item.bookingid || item.bhid) {
      fetchBookerDetails(); // Fetch the booker details when either ID exists
    }
  }, [item.bookingid, item.bhid]); // Ensure bhid is in the dependency array

  useEffect(() => {
    const fetchProperties = async () => {
      try {

        // Fetch images
        const imgResponse = await axios.get('http://127.0.0.1:8000/api/getallfirstimg');
        const imgMap = new Map();
        imgResponse.data.forEach(img => {
          imgMap.set(img.propertyid, img.src);
        });

        console.log('Images:', imgMap);


        setEditedItem(prevItem => ({
          ...prevItem,
          src: imgMap.get(editedItem.propertyid) || null,
        }));

      } catch (error) {
        console.error(error);
      }
    };
    fetchProperties();
  }, []);

  useEffect(() => {
    const nights = Math.ceil(
      (bookingDetails.checkOut - bookingDetails.checkIn) / (1000 * 60 * 60 * 24)
    );
    const { rooms, guests } = bookingDetails;

    const updatedBasePrice = basePrice * nights * rooms;
    const updatedExtraGuestCost =
      extraGuestCost * (guests - 2 > 0 ? guests - 2 : 0);
    const updatedBookingAmount =
      updatedBasePrice + updatedExtraGuestCost + bookingCharge;
    const updatedPayableAtCheckIn = updatedBookingAmount;
    const updatedPayableNow = bookingCharge;

    setDynamicDetails((prevDetails) => ({
      ...prevDetails,
      basePrice: updatedBasePrice,
      extraGuestCost: updatedExtraGuestCost,
      bookingAmount: updatedBookingAmount,
      payableAtCheckIn: updatedPayableAtCheckIn,
      payableNow: updatedPayableNow,
      forDetails: `For ${nights} night${nights > 1 ? "s" : ""}, ${rooms} room${rooms > 1 ? "s" : ""
        }, and ${guests} guest${guests > 1 ? "s" : ""}`,
    }));
  }, [bookingDetails, basePrice, extraGuestCost, bookingCharge]);

  useEffect(() => {
    const now = new Date();
    let status = "Upcoming";
    let paymentStatus = "Pending";

    if (now > bookingDetails.checkOut) {
      status = "Checked Out";
    } else if (now >= bookingDetails.checkIn) {
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

  const handleUpdateDetails = (action) => {
    if (action === "edit") {
      setIsEditMode(true);
    } else if (action === "save") {
      setSaving(true);
      // Simulate saving data to an API
      setTimeout(() => {
        setSaving(false);
        setIsEditMode(false);
        console.log("Saved data:", editedItem);
        setIsModified(false); // Reset modification state after saving
      }, 2000);
    } else if (action === "checkIn" || action === "checkOut") {
      console.log(`${action} clicked`);
    }
  };

  console.log("Saved data:", editedItem);
  const handleCheckIn = async (item) => {
    console.log("Checking in: ", item);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/setcheckin", {
        bookingid: item.bookingid
      }
      );
      console.log('Response:', response.data);
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSecurityDeposit = async (item) => {
    console.log("Checking in: ", item);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/refundsecurity", {
        bhid: item.bhid
      }
      );
      console.log('Response:', response.data);
      if (response.data.status === 'success') {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleCheckOut = async (item) => {
    console.log("Checking out: ", item);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/setcheckout", {
        bookingid: item.bookingid
      }
      );
      console.log('Response:', response.data);
      window.location.reload();

    } catch (error) {
      console.log(error);
    }
  };

  const handleCancelEdit = () => {
    setEditedItem({ ...item }); // Reset to original item
    setIsEditMode(false); // Exit edit mode
    setIsModified(false); // Reset modification state
  };

  const handleCellClick = (field) => {
    if (isEditMode) {
      const input = document.getElementById(field);
      if (input) {
        input.focus();
      }
    }
  };

  const handleChange = (e, field) => {
    // Logic for handling input changes
    setEditedItem((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  console.log("items:", item);
  console.log("dynamicDetails:", dynamicDetails);
  console.log("editedItem:", editedItem);
  return (
    <div className="outer-container" style={{ height: "100vh" }}>
      <div className="container flex-row">
        <div className="left-section flex-col p-6 bg-background rounded-lg shadow-md mr-4">
          <div className="flex-row items-center mb-4">
            <img
              src={editedItem?.src || "/image1.png"}
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
                  <span>{item.guest_count} Guests</span>
                </div>
                <div className="booking-id-container">
                  <span className="icon" style={{ fontSize: "0.75rem" }}>
                    <strong style={{ marginRight: "4px" }}>Booking ID:</strong>
                    <FontAwesomeIcon
                      icon={faHashtag}
                      style={{ marginRight: "4px" }}
                    />
                    {item.bookingid ? item.bookingid : item.bhid}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="booking-details mb-4">
            <table className="table-horizontal editable-table">
              <thead>
                <tr>
                  <th style={{ fontSize: "0.9rem" }}>Check In</th>
                  <th style={{ fontSize: "0.9rem" }}>Check Out</th>
                  <th style={{ fontSize: "0.9rem" }}>Guests</th>
                  <th style={{ fontSize: "0.9rem" }}>Status</th>
                  <th style={{ fontSize: "0.9rem" }}>Payment</th>
                  {item.unit_type === 'Monthly Term' && <th style={{ fontSize: "0.9rem" }}>Due Date</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => handleCellClick("checkin_date")}
                  >
                    {isEditMode ? (
                      <input
                        type="date"
                        id="checkin_date"
                        value={editedItem.checkin_date}
                        onChange={(e) => handleChange(e, "checkin_date")}
                      />
                    ) : (
                      formatDate(editedItem.checkin_date)
                    )}
                  </td>
                  <td
                    style={{ fontSize: "0.8rem" }}
                    onClick={() => handleCellClick("checkout_date")}
                  >
                    {isEditMode ? (
                      <input
                        type="date"
                        id="checkout_date"
                        value={editedItem.checkout_date}
                        onChange={(e) => handleChange(e, "checkout_date")}
                      />
                    ) : (
                      formatDate(editedItem.checkout_date)
                    )}
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>
                    {editedItem.guest_count}
                  </td>
                  <td style={{ fontSize: "0.8rem" }}>{editedItem.status}</td>
                  <td style={{ fontSize: "0.8rem" }}>
                    {editedItem.total_price}
                  </td>
                  {item.unit_type === 'Monthly Term' && <td style={{ fontSize: "0.8rem" }}>{formatDate(editedItem.due_date)}</td>}
                </tr>
              </tbody>
            </table>
          </div>

          <div className="update-details-container">

            {editedItem.status !== 'Cancelled' && editedItem.status !== 'Checked out' && (
              <>

              </>
            )}

            <button
              className="btn-check-in"
              onClick={() => handleCheckIn(item)}
              disabled={editedItem.status !== "Confirmed"}
              style={{
                backgroundColor: editedItem.status !== "Confirmed" ? "gray" : "",
                color: editedItem.status !== "Confirmed" ? "#ffffff" : "",
                cursor: editedItem.status !== "Confirmed" ? "not-allowed" : "pointer"
              }}
            >
              Check In
            </button>
            <button
              className="btn-check-out"
              onClick={() => handleCheckOut(item)}
              disabled={editedItem.status !== "Checked in"}
              style={{
                backgroundColor: editedItem.status !== "Checked in" ? "gray" : "",
                color: editedItem.status !== "Checked in" ? "#ffffff" : "",
                cursor: editedItem.status !== "Checked in" ? "not-allowed" : "pointer"
              }}
            >
              Check Out
            </button>

          </div>

          <div className="description mt-4">
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                fontSize: "1.25rem",
                fontWeight: "bold",
                padding: "15px 0",
              }}
            >
              Booker
            </div>
            <table className="table-horizontal editable-table">
              <thead>
                <tr>
                  <th style={{ fontSize: "0.9rem" }}>Full Name</th>
                  <th style={{ fontSize: "0.9rem" }}>Email</th>
                  <th style={{ fontSize: "0.9rem" }}>Phone No.</th>
                  <th style={{ fontSize: "0.9rem" }}>Country</th>
                  <th style={{ fontSize: "0.9rem" }}>Special Instructions</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ fontSize: "0.8rem" }}>{item.guestname}</td>
                  <td style={{ fontSize: "0.8rem" }}>{item.booker.email}</td>
                  <td style={{ fontSize: "0.8rem" }}>{item.booker.phonenum}</td>
                  <td style={{ fontSize: "0.8rem" }}>{item.booker.country}</td>
                  <td style={{ fontSize: "0.8rem" }}>{item.special_request}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="right-section flex-col p-6 bg-background rounded-lg shadow-md">
          {item.unit_type === 'Monthly Term' ? (<>
            <div>
              <Typography variant="h6" color="primary" ml={1} pt={0.5}>
                <PriceCheckIcon sx={{ color: "primary.main", mr: 1 }} />
                Invoice Summary:
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                m={1}
              >
                <Typography variant="body1" color="textSecondary">
                  Base price per month
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {formatPrice(item.min_price / 1.12) || "N/A"}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                m={1}
              >
                <Typography variant="body1" color="textSecondary">
                  X {item.stay_length / 31} total months booked
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {formatPrice((item.stay_length / 31) * (item.min_price / 1.12)) || "N/A"}
                </Typography>
              </Stack>
              {/* Conditional rendering for Security Deposit */}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                m={1}
              >
                <Typography variant="body1" color="textSecondary">
                  VAT (12%)
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {formatPrice(item.total_price * 0.12) || "N/A"}
                </Typography>
              </Stack>
              {monthlyLengthStay !== 1 && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  m={1}
                >
                  {item.securityDeposit === 0 ? (<>
                    <Typography variant="body1" color="textSecondary">
                      Security Deposit
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {formatPrice(item.min_price) || "N/A"}
                    </Typography></>

                  ) : (<>
                    <Typography variant="body1" color="textSecondary">
                      Security Deposit
                    </Typography>
                    <Typography variant="body1" color="textSecondary">
                      {0}
                    </Typography></>)}

                </Stack>
              )}
              <Divider sx={{ my: 1 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                m={1}
              >
                <Typography variant="body1" fontWeight="bold">
                  Total Amount
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatPrice(item.total_price) || "N/A"}
                </Typography>
              </Stack>
            </div>
            <div>
              {item.status === "Checked out" && item.securityDeposit === 0 && (
                <button className="payout-btn"
                  // onClick={() => handleSecurityDeposit(item)}>
                  onClick={handlePayoutButtonClick} >
                  Payout Security Deposit
                </button>
              )}

              {showPayoutModal && (
                <PayoutSecurityDeposit
                  bookhistoryid={item?.bhid || 0}
                  guestName={item?.guestname || 'Guest Name'} // Default value in case of null/undefined
                  propertyName={item?.property_name || 'Property Name'}
                  checkoutDate={item?.checkout_date || 'Date'}
                  securityDepo={item?.min_price || 0}
                  onClose={handleCloseModal}
                  onConfirm={handleConfirmPayout}
                />
              )}
            </div>

          </>) : (<>
            <div>
              <Typography variant="h6" color="primary" ml={1} pt={0.5}>
                <PriceCheckIcon sx={{ color: "primary.main", mr: 1 }} />
                Invoice Summary:
              </Typography>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                m={1}
              >
                <Typography variant="body1" color="textSecondary">
                  Base price per day
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {formatPrice(item.min_price / 1.12) || "N/A"}
                </Typography>
              </Stack>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                m={1}
              >
                <Typography variant="body1" color="textSecondary">
                  X {item.stay_length} total days booked
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {formatPrice((item.stay_length) * (item.min_price / 1.12)) || "N/A"}
                </Typography>
              </Stack>
              {/* Conditional rendering for Security Deposit */}

              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                m={1}
              >
                <Typography variant="body1" color="textSecondary">
                  VAT (12%)
                </Typography>
                <Typography variant="body1" color="textSecondary">
                  {formatPrice(item.total_price * 0.12) || "N/A"}
                </Typography>
              </Stack>
              {monthlyLengthStay !== 1 && (
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  m={1}
                >
                  <Typography variant="body1" color="textSecondary">
                    Security Deposit
                  </Typography>
                  <Typography variant="body1" color="textSecondary">
                    +{formatPrice(item.min_price) || "N/A"}
                  </Typography>
                </Stack>
              )}
              <Divider sx={{ my: 1 }} />
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                m={1}
              >
                <Typography variant="body1" fontWeight="bold">
                  Total Amount
                </Typography>
                <Typography variant="body1" fontWeight="bold">
                  {formatPrice(item.total_price)}
                </Typography>
              </Stack>
              {/* {!showPayoutButton && (
            <button
              className="cancel-booking-btn w-full mt-4"
              onClick={() => setIsSuccess(true)}
            >
              Cancel Booking
            </button>
          )} */}
            </div>

          </>)}

        </div>
      </div>
    </div>
  );
};

export default CheckInCheckOut;
