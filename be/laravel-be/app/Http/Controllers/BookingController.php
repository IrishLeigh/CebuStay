<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Booker;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Location;

class BookingController extends Controller
{
    public function insertBooking(Request $request)
    {
        $this->enableCors($request);
        $booking = new Booking();
        $booking->userid = $request->input('userid');
        $booking->propertyid = $request->input('propertyid');

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
        $booking->checkin_date = $request->input('checkin_date');
        $booking->checkout_date = $request->input('checkout_date');
        $booking->total_price = $request->input('total_price');
        $booking->special_request = $request->input('special_request');
        $booking->arrival_time = $request->input('arrival_time');
        $booking->status = $request->input('status');
        $booking->booking_date = $request->input('booking_date');
        $booking->save();

        return response()->json(['message' => 'Booking created, Proceed to Payment', 'status' => 'success', 'bookingid' => $booking]);

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
            'tbl_booking.booking_date',
            'tbl_booking.guestid',
            'tbl_booking.checkin_date',
            'tbl_booking.checkout_date',
            'tbl_booking.total_price',
            'tbl_booking.status',
            'property.property_name', // Select property_name from property table
            'tbl_guest.guestname' // Select guestname from guest table
        )
            ->join('property', 'tbl_booking.propertyid', '=', 'property.propertyid')
            ->join('tbl_guest', 'tbl_booking.guestid', '=', 'tbl_guest.guestid') // Join guest table
            ->where('property.userid', $userId)
            ->get();

        // Format the bookings
        $formattedBookings = $bookings->map(function ($booking) {
            return [
                'bookingid' => $booking->bookingid,
                'booking_date' => $booking->booking_date,
                'propertyid' => $booking->propertyid,
                'property_name' => $booking->property_name,
                'guestid' => $booking->guestid,
                'guestname' => $booking->guestname, // Retrieve guestname from the result
                'checkin_date' => $booking->checkin_date,
                'checkout_date' => $booking->checkout_date,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
            ];
        });

        return response()->json($formattedBookings);
    }





}
