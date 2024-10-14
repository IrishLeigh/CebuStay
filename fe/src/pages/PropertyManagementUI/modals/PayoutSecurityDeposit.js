import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../css/payoutSecurityDeposit.css";
import axios from "axios";

const PayoutSecurityDeposit = ({
  bookhistoryid,
  guestName,
  propertyName,
  checkoutDate,
  onClose,
  securityDepo,
  onConfirm, // New prop to handle confirmation
}) => {
  const [securityDeposit, setSecurityDeposit] = useState(0);
  const handleInputChange = (event) => {
    let value = event.target.value;

    // Ensure that only numeric values are processed
    value = value.replace(/[^\d]/g, "");

    // Convert value to a number and check against max
    const numericValue = Number(value);

    // Set securityDeposit to the lesser of the input or the max value
    if (numericValue > securityDepo) {
      setSecurityDeposit(securityDepo); // If input exceeds max, set it to the max value
    } else {
      setSecurityDeposit(numericValue); // Otherwise, use the input value
    }
  };
  useEffect(() => {
    setSecurityDeposit(securityDepo);
  }, [securityDepo]);

  console.log("Security Deposit:", securityDeposit);

  const handleSecurityDeposit = async () => {
    console.log("Checking in: ", securityDeposit);
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/refundsecurity", {
        bhid: bookhistoryid,
        amount: securityDeposit
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

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>
        <div className="modal-header-column">
          <div className="header-item">
            <h2>Guest Name:</h2>
            <input
              type="text"
              value={guestName}
              readOnly
              className="text-field"
            />
          </div>
          <div className="header-item">
            <h2>Property Name:</h2>
            <input
              type="text"
              value={propertyName}
              readOnly
              className="text-field"
            />
          </div>
          <div className="header-item">
            <h2>Checkout Date:</h2>
            <input
              type="text"
              value={checkoutDate}
              readOnly
              className="text-field"
            />
          </div>
        </div>
        <div className="modal-body">
          <div className="security-deposit">
            <h2>Security Deposit:</h2>
            <input
              type="number" // Changed to number input
              value={securityDeposit} // Use the raw numeric value
              className="text-field"
              onChange={handleInputChange} // Update state on change
              max={securityDepo} // Set the max to securityDepo
              placeholder={`₱ ${securityDepo}`} // Add placeholder with formatted value
            />
          </div>
        </div>
        {/* Confirm payout button */}
        <button className="confirm-btn" onClick={handleSecurityDeposit}>
          Confirm Payout
        </button>
      </div>
    </div>
  );
};

export default PayoutSecurityDeposit;
