<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payout;
use Illuminate\Support\Facades\DB;
class PayoutController
{
    public function getPayouts(Request $request)
    {
        // Manually join the payouts table with property, users, payment, and bookinghistory tables to get all necessary fields
        $payouts = Payout::select(
            'tbl_payout.*',
            'property.property_name',
            DB::raw("CONCAT(users.firstname, ' ', users.lastname) AS customername"),
            DB::raw("DATE_FORMAT(tbl_payment.updated_at, '%M %d, %Y') as payment_date"), // Format the updated_at field
            DB::raw("IFNULL(DATE_FORMAT(tbl_bookinghistory.checkout_date, '%M %d, %Y'), NULL) as checkout_date") // Format the checkout_date or set it to null
        )
            ->join('property', 'tbl_payout.propertyid', '=', 'property.propertyid')
            ->join('users', 'tbl_payout.userid', '=', 'users.userid')
            ->join('tbl_payment', 'tbl_payout.pid', '=', 'tbl_payment.pid') // Join with tbl_payment to get the pid
            ->leftJoin('tbl_bookinghistory', 'tbl_payment.bhid', '=', 'tbl_bookinghistory.bhid') // Left join with tbl_bookinghistory using bhid
            ->get();

        return response()->json($payouts);
    }

    public function setPayout(Request $request)
    {
        $payout_record = Payout::where('payout_id', $request->input('payout_id'))->first();
        $payout_record->status = "Completed";
        //set payout_date field to today below
        $payout_record->payout_date = date('Y-m-d H:i:s');
        if ($request->input('payout_amount')) {
            $payout_record->payout_amount = $request->input('payout_amount');
        }
        if ($request->input('batch_id')) {
            $payout_record->batch_id = $request->input('batch_id');
        }
        if ($request->input('item_id')) {
            $payout_record->item_id = $request->input('item_id');
        }
        $payout_record->save();
        return response()->json(['message' => 'Payout set successfully', 'status' => 'success']);
    }
}
