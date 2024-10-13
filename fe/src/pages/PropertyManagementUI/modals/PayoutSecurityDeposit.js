import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import "../css/payoutSecurityDeposit.css";

const PayoutSecurityDeposit = ({
  guestName,
  propertyName,
  checkoutDate,
  securityDeposit,
  onClose,
  onConfirm, // New prop to handle confirmation
}) => {
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
              type="text"
              value={`₱ ${securityDeposit}`}
              readOnly
              className="text-field"
            />
          </div>
        </div>
        {/* Confirm payout button */}
        <button className="confirm-btn" onClick={onConfirm}>
          Confirm Payout
        </button>
      </div>
    </div>
  );
};

export default PayoutSecurityDeposit;
