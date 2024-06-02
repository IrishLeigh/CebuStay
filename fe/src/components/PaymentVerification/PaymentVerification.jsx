import React, { useEffect, useState } from 'react';
import './PaymentVerification.css';
import { CircularProgress } from "@mui/material";
import axios from "axios";

const PaymentVerification = () => {
    const [bookingId, setBookingId] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [payment, setPayment] = useState(null);

    useEffect(() => {
        const getQueryParam = (name) => {
            const params = new URLSearchParams(window.location.search);
            return params.get(name);
        };

        const id = getQueryParam('bookingId');

        setBookingId(id);
        const fetchData = async () => {
            try {
                console.log("Booking id", bookingId);
                const getRes = await axios.put('http://localhost:8000/api/bookingStatus', {
                    bookingid: id,
                    status: 'Paid'
                });

                const getDetails = await axios.get('http://localhost:8000/api/property/bookingId', {

                    params: {
                        bookingid: id
                    }
                });

                const getPayment = await axios.get('http://localhost:8000/api/getpayments', {
                    params: {
                        bookingid: id
                    }
                });
                setPayment(getPayment.data);
                setBookingDetails(getDetails.data);
            } catch (error) {
                console.error(error);
            }
        };
        fetchData();
    }, []);

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    return (
        <div className="card" style={{ margin: '0 auto', marginTop: '5rem' }}>


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
                    <button type="button" className="history" onClick={() => window.location.href = "/Book"}>Home</button>
                    <button type="button" className="track" onClick={toggleModal}>Invoice</button>
                </div>
            </div>
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-content" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                            <h3>Payment Details:</h3>

                            {bookingDetails && payment ? (
                                <>
                                    <p>Length of Stay: {bookingDetails.stay_length}</p>
                                    <p>Number of Guests: {bookingDetails.guest_count}</p>
                                    <p>Booking Date: {bookingDetails.booking_date}</p>
                                    <p>Checked In Date: {bookingDetails.checkin_date}</p>
                                    <p>Checked Out Date: {bookingDetails.checkout_date}</p>
                                    <p>Payment Status: {bookingDetails.status}</p>
                                    <p>Amount: ₱ {payment.amount}</p>
                                </>
                            ) : (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                                    <CircularProgress />
                                </div>
                                
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PaymentVerification;
