<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Booker;
use App\Models\Guest;

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
}
