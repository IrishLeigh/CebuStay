import React from 'react';
import './PaymentVerification.css'; // Assuming you have a CSS file for styling

const PaymentVerification = () => {
  return (
    <div className="card">
      <button type="button" className="dismiss">×</button>
      <div className="header">
        <div className="image">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><g stroke-width="0" id="SVGRepo_bgCarrier"></g><g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g><g id="SVGRepo_iconCarrier"> <path stroke-linejoin="round" stroke-linecap="round" stroke-width="1.5" stroke="#000000" d="M20 7L9.00004 18L3.99994 13"></path> </g></svg>
        </div>
        <div className="content">
          <span className="title">Payment Success!</span>
          <p className="message">Thank you for your booking! Your payment has been successfully processed. We look forward to welcoming you.</p>
        </div>
        <div className="actions">
          <button type="button" className="history">Home</button>
          <button type="button" className="track">Invoice: </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentVerification;
