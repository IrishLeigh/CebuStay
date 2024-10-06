<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Payout;
class PayoutController
{
    public function getPayouts(Request $request)
    {
        $payouts = Payout::all();
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
