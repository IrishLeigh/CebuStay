<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Booker;
use App\Models\Guest;
use App\Models\Property;
use App\Models\Location;

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
            'tbl_booking.type', // Select type from tbl_booking table
            'property.property_name', // Select property_name from property table
            'property.property_type', // Select property_type from property table
            'property.property_desc', // Select property_desc from property table
            'tbl_guest.guestname' // Select guestname from tbl_guest table
        )
            ->join('property', 'tbl_booking.propertyid', '=', 'property.propertyid')
            ->join('tbl_guest', 'tbl_booking.guestid', '=', 'tbl_guest.guestid') // Join tbl_guest table
            ->where('property.userid', $userId)
            ->get();

        // Format the bookings
        $formattedBookings = $bookings->map(function ($booking) {
            return [
                'bookingid' => $booking->bookingid,
                'booking_date' => $booking->booking_date,
                'propertyid' => $booking->propertyid,
                'property_name' => $booking->property_name,
                'property_type' => $booking->property_type, // Add property_type
                'property_desc' => $booking->property_desc, // Add property_desc
                'guestid' => $booking->guestid,
                'guestname' => $booking->guestname, // Retrieve guestname from the result
                'checkin_date' => $booking->checkin_date,
                'checkout_date' => $booking->checkout_date,
                'total_price' => $booking->total_price,
                'status' => $booking->status,
                'type' => $booking->type, // Add type from tbl_booking
            ];
        });

        return response()->json($formattedBookings);
    }
}