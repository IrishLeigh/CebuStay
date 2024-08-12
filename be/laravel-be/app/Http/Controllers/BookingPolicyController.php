<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookingPolicy;

class BookingPolicyController extends CORS
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
            $bookingpolicy->cancel_days = false;
            $bookingpolicy->is_cancel_plan = false;
        }
        $request->input('non_refundable') === null ? $bookingpolicy->non_refundable = false : $bookingpolicy->non_refundable = true;
        $request->input('modification_plan') === null ? $bookingpolicy->modification_plan = false : $bookingpolicy->modification_plan = true;
        $request->input('offer_discount') === null ? $bookingpolicy->offer_discount = false : $bookingpolicy->offer_discount = true;

        $bookingpolicy->save();

        return response()->json([
            "status" => 'success',
            "message" => "Booking policy created successfully"
        ]);
    }
}
