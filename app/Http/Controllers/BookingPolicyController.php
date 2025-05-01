<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BookingPolicy;

class BookingPolicyController extends CORS
{

    public function InsertBookingPolicyInfo(Request $request)
    {
        $this->enableCors($request);

        $bookingPolicy = new BookingPolicy();
        $bookingPolicy->propertyid = $request->input('propertyid');
        $bookingPolicy->isCancellationPolicy = $request->input('isCancellationPolicy');
        $bookingPolicy->cancellationDays = $request->input('cancellationDays');
        $bookingPolicy->cancellationCharge = $request->input('cancellationCharge');
        $bookingPolicy->isModificationPolicy = $request->input('isModificationPolicy');
        $bookingPolicy->modificationDays = $request->input('modificationDays');
        $bookingPolicy->modificationCharge = $request->input('modificationCharge');
        
        $bookingPolicy->save();

        return response()->json([
            "status" => 'success',
            "message" => "Booking policy created successfully"
        ]);
    }

    public function getBookingPolicy(Request $request)
    {
        $this->enableCors(request());

        $propertyid = $request->input('propertyid');

        $bookingPolicy = BookingPolicy::where('propertyid', $propertyid)->first();

        if ($bookingPolicy) {
            return response()->json([
                "status" => 'success',
                "data" => $bookingPolicy
            ]);
        } else {
            return response()->json([
                "status" => 'error',
                "message" => "Booking policy not found"
            ], 404);
        }
    }

    public function updateBookingPolicy(Request $request)
    {
        $this->enableCors($request);

        $propertyid = $request->input('propertyid');
        $bookingPolicy = BookingPolicy::where('propertyid', $propertyid)->first();


        if ($bookingPolicy) {
            $bookingPolicy->propertyid = $request->input('propertyid', $bookingPolicy->propertyid);
            $bookingPolicy->isCancellationPolicy = $request->input('isCancellationPolicy', $bookingPolicy->isCancellationPolicy);
            $bookingPolicy->cancellationDays = $request->input('cancellationDays', $bookingPolicy->cancellationDays);
            $bookingPolicy->cancellationCharge = $request->input('cancellationCharge', $bookingPolicy->cancellationCharge);
            $bookingPolicy->isModificationPolicy = $request->input('isModificationPolicy', $bookingPolicy->isModificationPolicy);
            $bookingPolicy->modificationDays = $request->input('modificationDays', $bookingPolicy->modificationDays);
            $bookingPolicy->modificationCharge = $request->input('modificationCharge', $bookingPolicy->modificationCharge);
            
            $bookingPolicy->save();

            return response()->json([
                "status" => 'success',
                "message" => "Booking policy updated successfully"
            ]);
        } else {
            return response()->json([
                "status" => 'error',
                "message" => "Booking policy not found"
            ], 404);
        }
    }
}
