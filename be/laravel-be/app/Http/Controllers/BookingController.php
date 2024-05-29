<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Booker;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Location;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use App\Models\Payment;

class BookingController extends CORS
{
    public function insertBooking(Request $request)
    {
        $this->enableCors($request);

        try {
            DB::beginTransaction();

            // Retrieve and validate the check-in and check-out dates
            $checkin = $request->input('checkin_date');
            $checkout = $request->input('checkout_date');

            if (!preg_match('/\d{4}-\d{2}-\d{2}/', $checkin) || !preg_match('/\d{4}-\d{2}-\d{2}/', $checkout)) {
                return response()->json(['message' => 'Invalid date format. Use yyyy-mm-dd.', 'status' => 'error']);
            }

            // Retrieve all bookings for the given unitid
            $bookings = Booking::where('unitid', $request->input('unitid'))->get();

            // Perform validation check for date conflict
            foreach ($bookings as $booking) {
                if (
                    ($checkin >= $booking->checkin_date && $checkin <= $booking->checkout_date) ||
                    ($checkout >= $booking->checkin_date && $checkout <= $booking->checkout_date) ||
                    ($checkin < $booking->checkin_date && $checkout > $booking->checkout_date)
                ) {
                    return response()->json(['message' => 'The selected dates conflict with an existing booking.', 'status' => 'error']);
                }
            }

            // Check if today is the check-in date
            $today = date('Y-m-d');
            $isCheckinToday = ($checkin === $today);

            // Set booking type
            $bookingType = 'reservation'; // Default type is 'reservation'

            // Check if there are no existing bookings for today for the same unit
            if ($isCheckinToday) {
                $existingBookingsToday = Booking::where('unitid', $request->input('unitid'))
                    ->where('checkin_date', $today)
                    ->exists();

                // If there are no existing bookings for today, set type to 'booking'
                if (!$existingBookingsToday) {
                    $bookingType = 'booking';
                }
            }

            $booking = new Booking();
            $booking->userid = $request->input('userid');
            $booking->propertyid = $request->input('propertyid');
            $booking->unitid = $request->input('unitid');

            $booker = new Booker();
            $booker->firstname = $request->input('booker_fname');
            $booker->lastname = $request->input('booker_lname');
            $booker->email = $request->input('booker_email');
            $booker->phonenum = $request->input('booker_phone');
            $booker->country = $request->input('booker_country');
            $booker->countrycode = $request->input('booker_country_code');
            $booker->is_my_book = $request->input('is_my_book');
            $booker->save();

            $booking->bookerid = $booker->bookerid;

            $guest = new Guest();
            $guest->guestname = $request->input('guestname');
            $guest->guestemail = $request->input('guestemail');
            $guest->save();

            $booking->guestid = $guest->guestid;
            $booking->pid = $request->input('pid');
            $booking->stay_length = $request->input('stay_length');
            $booking->guest_count = $request->input('guest_count');
            $booking->checkin_date = $checkin;
            $booking->checkout_date = $checkout;
            $booking->total_price = $request->input('total_price');
            $booking->special_request = $request->input('special_request');
            $booking->arrival_time = $request->input('arrival_time');
            $booking->status = $request->input('status');
            $booking->booking_date = date('Y-m-d'); // Assuming booking_date is the current date
            $booking->type = $bookingType; // Set booking type

            $booking->save();

            DB::commit();

            return response()->json(['message' => 'Booking created, Proceed to Payment', 'status' => 'success', 'bookingid' => $booking->bookingid, 'ischeck' => $today]);
        } catch (\Exception $e) {
            DB::rollback();

            return response()->json(['message' => 'Failed to create booking: ' . $e->getMessage(), 'status' => 'error']);
        }
    }



    public function updateBookingPid(Request $request)
    {
        $this->enableCors($request);
        $bookingid = $request->input('bookingid');
        $booking = Booking::find($bookingid);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found', 'status' => 'error'], 404);
        }

        $booking->pid = $request->input('pid');
        $booking->save();

        return response()->json(['message' => 'Booking PID updated successfully', 'status' => 'success']);
    }

    public function sendEmail($bookerFirstName, $bookerLastName, $bookerEmail, $bookingId)
    {
        $booking = Booking::find($bookingId);
        $pid = $booking->pid;
        $payment = Payment::find($pid);

        // $guestName = $guest->guestname;
        $length = $booking->stay_length;
        $guestCount = $booking->guest_count;
        $bookingDate = $booking->booking_date;
        $checkin = $booking->checkin_date;
        $checkout = $booking->checkout_date;
        $status = $booking->status;
        $amount = $payment->amount;

        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        //Enable SMTP authentication
        $mail->Host = 'smtp.gmail.com';                     //Set the SMTP server to send through                                 
        $mail->Username = 'misternonoy11@gmail.com';                     //SMTP username
        $mail->Password = 'tkuz tiec nnxt zuqj';

        $mail->SMTPSecure = 'tls';            //Enable implicit TLS encryption
        $mail->Port = 587;

        $mail->setFrom('misternonoy11@email.com', $bookerFirstName);
        $mail->addAddress($bookerEmail);     //Add a recipient

        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'Email Verification from CebuStay';

        $email_template = "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Booking Confirmation</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 0;
                    background-color: #f4f4f4;
                }
                .container {
                    width: 80%;
                    margin: auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }
                .header {
                    background-color: #00aaff;
                    color: #fff;
                    padding: 20px;
                    text-align: center;
                    border-top-left-radius: 10px;
                    border-top-right-radius: 10px;
                }
                .header img {
                    max-width: 100px;
                }
                .content {
                    padding: 20px;
                }
                .content h1 {
                    text-align: center;
                    color: #333;
                }
                .content p {
                    font-size: 16px;
                    line-height: 1.5;
                    color: #333;
                }
                .booking-details, .payment-details {
                    margin: 20px 0;
                }
                .booking-details table, .payment-details table {
                    width: 100%;
                    border-collapse: collapse;
                }
                .booking-details th, .booking-details td, .payment-details th, .payment-details td {
                    border: 1px solid #ddd;
                    padding: 8px;
                    text-align: left;
                }
                .booking-details th, .payment-details th {
                    background-color: #f2f2f2;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    background-color: #00aaff;
                    color: #fff;
                    border-bottom-left-radius: 10px;
                    border-bottom-right-radius: 10px;
                }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <img src='Logo.png' alt='CebuStay Logo'>
                </div>
                <div class='content'>
                    <h1>Booking Confirmation</h1>
                    <p>Dear $bookerFirstName $bookerLastName,</p>
                    <p>We are delighted to inform you that your booking with <strong>PROPERTY NAME</strong> has been successfully confirmed! We greatly appreciate your trust in us and look forward to providing you with an exceptional experience.</p>
                    <div class='booking-details'>
                        <h2>Booking Details</h2>
                        <table>
                            <tr>
                                <th>Booking ID</th>
                                <td>$bookingId</td>
                            </tr>
                            <tr>
                                <th>Service/Reservation</th>
                                <td>SERVICE NAME</td>
                            </tr>
                            <tr>
                                <th>Date and Time</th>
                                <td>$bookingDate</td>
                            </tr>
                            <tr>
                                <th>Location</th>
                                <td>LOCATION</td>
                            </tr>
                            <tr>
                                <th>Special Notes</th>
                                <td>SPECIAL NOTES</td>
                            </tr>
                        </table>
                    </div>
                    <p>Additionally, we have received your payment for the booking. Thank you for choosing to pay in advance, ensuring a smooth and hassle-free experience for you.</p>
                    <p>If you have any special requests or require further assistance, feel free to reach out to our customer support team at <a href='mailto:cebstaycustomersupport@gmail.com'>cebstaycustomersupport@gmail.com</a></p>
                    <p>Thank you once again for choosing <strong>CebuStay</strong>. We are thrilled to serve you and look forward to exceeding your expectations.</p>
                    <p>Warm regards,<br>CebuStay</p>
                    <div class='payment-details'>
                        <h2>Payment Details</h2>
                        <table>
                            <tr>
                                <th>Booking Date</th>
                                <th>Property Name</th>
                                <th>Type</th>
                                <th>Check-in</th>
                                <th>Check-out</th>
                                <th>Length of stay</th>
                                <th># of Guests</th>
                                <th>Status</th>
                                <th>Amount Paid</th>
                            </tr>
                            <tr>
                                <td>$bookingDate</td>
                                <td>PROPERTY NAME</td>
                                <td>TYPE</td>
                                <td>$checkin</td>
                                <td>$checkout</td>
                                <td>$length</td>
                                <td>$guestCount</td>
                                <td>$status</td>
                                <td>$amount</td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div class='footer'>
                    cebustay est 2024
                </div>
            </div>
        </body>
        </html>
    ";

        $mail->Body = $email_template;
        try {
            $mail->send();
            // echo "na send";
            return 1; // Email sent successfully

        } catch (Exception $e) {
            // echo "wala na send";
            return 0; // Error occurred while sending email
        }
    }

    public function updateBookingStatus(Request $request)
    {
        $this->enableCors($request);
        $bookingid = $request->input('bookingid');
        $booking = Booking::find($bookingid);

        if (!$booking) {
            return response()->json(['message' => 'Booking not found', 'status' => 'error'], 404);
        }

        $booking->status = $request->input('status');
        $booking->save();

        $bookingId = $booking->bookingid;
        $bookerId = $booking->bookerid;
        $guestId = $booking->guestid;

        $booker = Booker::find($bookerId);
        $guest = Guest::find($guestId);


        $bookerEmail = $booker->email;
        $bookerFirstName = $booker->firstname;
        $bookerLastName = $booker->lastname;


        $result = $this->sendEmail($bookerFirstName, $bookerLastName, $bookerEmail, $bookingId);

        if ($result) {
            return response()->json(['message' => 'Booking PID updated successfully. Email sent.', 'status' => 'success']);
        } else {
            return response()->json(['message' => 'Booking PID updated successfully. Error sending email.', 'status' => 'error']);
        }
    }

    public function getAllBookingByUserId(Request $request)
    {
        $this->enableCors($request);

        $userid = $request->input('userid');

        // Eager load the property and location relationships
        $bookings = Booking::with(['property.location'])
            ->select('bookingid', 'booking_date', 'propertyid', 'guest_count', 'total_price', 'status')
            ->where('userid', $userid)
            ->get();

        // Format the response to include the additional property and location data
        $formattedBookings = $bookings->map(function ($booking) {
            return [
                'bookingid' => $booking->bookingid,
                'booking_date' => $booking->booking_date,
                'property_name' => $booking->property->property_name,
                'property_type' => $booking->property->property_type,
                'address' => $booking->property->location->address,
                'guest_count' => $booking->guest_count,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
            ];
        });

        return response()->json($formattedBookings);
    }

    public function getAllBookingByProperty(Request $request)
    {
        $this->enableCors($request);
        $userId = $request->input('userid');

        // Fetch all bookings related to properties of the given user
        $bookings = Booking::select(
            'tbl_booking.propertyid',
            'tbl_booking.bookingid',
            'tbl_booking.unitid',
            'tbl_booking.booking_date',
            'tbl_booking.guestid',
            'tbl_booking.checkin_date',
            'tbl_booking.checkout_date',
            'tbl_booking.total_price',
            'tbl_booking.status',
            'tbl_booking.stay_length',
            'tbl_booking.guest_count',
            'tbl_booking.special_request',
            'tbl_booking.type', // Select type from tbl_booking table
            'tbl_booking.bookerid',
            'property.property_name', // Select property_name from property table
            'property.property_type', // Select property_type from property table
            'property.property_desc', // Select property_desc from property table
            'property.unit_type', // Select unit_type from property table
            'tbl_guest.guestname' // Select guestname from tbl_guest table
        )
            ->join('property', 'tbl_booking.propertyid', '=', 'property.propertyid')
            ->join('tbl_guest', 'tbl_booking.guestid', '=', 'tbl_guest.guestid') // Join tbl_guest table
            ->where('property.userid', $userId)
            ->get();

        // Format the bookings
        $formattedBookings = $bookings->map(function ($booking) {
            $booker = Booker::find($booking->bookerid);
            $payment = Payment::find($booking->pid);
            return [
                'bookingid' => $booking->bookingid,
                'booking_date' => $booking->booking_date,
                'propertyid' => $booking->propertyid,
                'unitid' => $booking->unitid,
                'stay_length' => $booking->stay_length,
                'special_request' => $booking->special_request,
                'guest_count' => $booking->guest_count,
                'property_name' => $booking->property_name,
                'property_type' => $booking->property_type, // Add property_type
                'property_desc' => $booking->property_desc, // Add property_desc
                'unit_type' => $booking->unit_type, // Add unit_type
                'guestid' => $booking->guestid,
                'guestname' => $booking->guestname, // Retrieve guestname from the result
                'checkin_date' => $booking->checkin_date,
                'checkout_date' => $booking->checkout_date,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
                'type' => $booking->type, // Add type from tbl_booking
                'booker' => $booker, // Add booker details
            ];
        });

        return response()->json($formattedBookings);
    }

    public function getAllBookingByBookingId(Request $request)
    {
        $this->enableCors($request);
        $bookingId = $request->input('bookingid');

        $booking = Booking::find($bookingId);
        if (!$booking) {
            return response()->json(['message' => 'Booking not found', 'status' => 'error'], 404);
        }

        return response()->json($booking);
    }





}
