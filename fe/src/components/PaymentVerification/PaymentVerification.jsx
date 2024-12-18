import React, { useEffect, useState, useRef } from 'react';
import './PaymentVerification.css';
import { CircularProgress, Modal } from "@mui/material";
import axios from "axios";

const PaymentVerification = () => {
    const [bookingId, setBookingId] = useState(null);
    const [bookingDetails, setBookingDetails] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [payment, setPayment] = useState(null);
    
    const modalRef = useRef(); // Create a ref for the modal content

    useEffect(() => {
        const getQueryParam = (name) => {
            const params = new URLSearchParams(window.location.search);
            return params.get(name);
        };

        const id = getQueryParam('bookingId');
        if (id) {
            setBookingId(id);
        }
    }, []); 

    useEffect(() => {

        const fetchData = async () => {
            setLoading(true);
            try {
                if (bookingId !== null) {
                    const bookstatus = await axios.put('http://127.0.0.1:8000/api/bookingStatus', {
                        bookingid: bookingId,
                        status: 'Confirmed'
                    });
                    const paymentstatus = await axios.put('http://127.0.0.1:8000/api/update-payment-status', {
                        bookingid: bookingId,
                        status: 'Paid'
                    });
                    const getDetails = await axios.get('http://127.0.0.1:8000/api/property/bookingId', {
                        params: { bookingid: bookingId }
                    });
                    const getPayment = await axios.get('http://127.0.0.1:8000/api/getpayments', {
                        params: { bookingid: bookingId }
                    });
                    const getpaymentid = await axios.get('http://127.0.0.1:8000/api/getpaymentid', {
                        params: { bookingid: bookingId }
                    });
                    setPayment(getPayment.data);
                    setBookingDetails(getDetails.data);
                    
                    if(bookstatus && paymentstatus && getDetails && getPayment && getpaymentid) {
                        console.log('update payment', paymentstatus.data);
                        setLoading(false);
                    }
                }
                
                
            } catch (error) {
                console.error(error);
                setLoading(false);
            }
        };
        fetchData();
    }, [bookingId]);

    console.log('Payment', payment);
    console.log('Booking Details', bookingDetails);
    const toggleModal = () => {
        setShowModal(!showModal);
    };

    // Close modal if clicking outside of it
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setShowModal(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="card" style={{ margin: '0 auto', marginTop: '5rem' }}>
            {loading ? (
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}><CircularProgress /></div>
                
            ) : (
                <>
                    {/* <button type="button" className="dismiss">×</button> */}
                    
                    <div className="header">
                    {/* <img src="/Logo2.png" alt="Logo" style = {{ width: '10%'}}/> */}
                        <div className="image">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <g stroke-width="0" id="SVGRepo_bgCarrier"></g>
                        <g stroke-linejoin="round" stroke-linecap="round" id="SVGRepo_tracerCarrier"></g>
                        <g id="SVGRepo_iconCarrier"> <path stroke-linejoin="round" stroke-linecap="round" 
                        stroke-width="1.5" stroke="#000000" d="M20 7L9.00004 18L3.99994 13"></path> </g></svg>
                        
                        </div>
                        
                        <div className="content">
                            <span className="message" style ={{ color: '#007bff', fontSize: '1.5rem' }}>Payment Success!</span>
                            <p className="message">Thank you for booking! Your payment has been successfully processed. <br /><br />An email with the invoice has been sent to your email.</p>
                        </div>
                        <div className="actions">
                            <button type="button" className="history" onClick={() => window.location.href = "/"}>Home</button>
                            {/* <button type="button" className="track" onClick={toggleModal}>Invoice</button> */}
                        </div>
                    </div>
                    {/* <Modal open={showModal} onClose={toggleModal}>
                        <div className="modal-overlay">
                            <div ref={modalRef}>
                                <div className="modal-content" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
                                    <h3>Payment Details:</h3>
                                    {bookingDetails && payment ? (
                                        <>
                                            <p>Length of Stay: {bookingDetails.stay_length}</p>
                                            <p>Number of Guests: {bookingDetails.guest_count}</p>
                                            <p>Booking Date: {bookingDetails.booking_date}</p>
                                            <p>Checked In Date: {bookingDetails.checkin_date}</p>
                                            <p>Checked Out Date: {bookingDetails.checkout_date}</p>
                                            <p>Booking Status: {bookingDetails.status}</p>
                                            <p>Amount: ₱ {bookingDetails.total_price * bookingDetails.stay_length}</p>
                                        </>
                                    ) : (
                                        <div style={{ display: 'flex', justifyContent: 'center', padding: '1rem' }}>
                                            <CircularProgress />
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Modal> */}
                </>
            )}
        </div>
    );
};

export default PaymentVerification;
