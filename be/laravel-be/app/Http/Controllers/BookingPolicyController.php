<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookingPolicy;

class BookingPolicyController extends Controller
{

    public function InsertBookingPolicyInfo(Request $request)
    {
        $this->enableCors($request);
        $bookingpolicy = new BookingPolicy();
        $bookingpolicy->propertyid = $request->input('propertyid');
        $bookingpolicy->is_cancel_plan = $request->input('is_cancel_plan');
        if ($bookingpolicy->is_cancel_plan == true) {
            $bookingpolicy->cancel_days = $request->input('cancel_days');
        } else {
            $bookingpolicy->cancel_days = null;
        }
        $bookingpolicy->non_refundable = $request->input('non_refundable');
        $bookingpolicy->modification_plan = $request->input('modification_plan');
        $bookingpolicy->offer_discount = $request->input('offer_discount');
        $bookingpolicy->save();

        return response()->json([
            "status" => 'success',
            "message" => "Booking policy created successfully"
        ]);
    }
}
