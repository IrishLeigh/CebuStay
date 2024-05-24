<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\PayMongoService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{
    protected $payMongoService;

    public function __construct(PayMongoService $payMongoService)
    {
        $this->payMongoService = $payMongoService;
    }

    public function createPaymentLink(Request $request)
    {
        $this->enableCors($request);

        // $linkid = null;
        $amount = $request->input('amount');
        $description = $request->input('description');
        $remarks = $request->input('remarks');

        // Create the payment link using the PayMongo service
        $link = $this->payMongoService->createLink($amount, $description, $remarks);

        // Save the payment record in the database
        $payment = new Payment();
        // $payment->linkid = $linkid;
        $payment->amount = $amount;
        $payment->description = $description;
        $payment->remarks = $remarks;
        $payment->save();

        // Return the payment record along with the PayMongo link
        return response()->json([
            'payment' => $payment, // include the payment record in the response
            'link' => $link, // include the PayMongo link in the response
        ]);
    }


    public function retrievePaymentLink($linkId)
    {
        // Retrieve the payment link using the PayMongo service
        $link = $this->payMongoService->retrieveLink($linkId);

        if (!$link) {
            return response()->json(['error' => 'Link not found'], 404);
        }

        return response()->json($link);
    }

    public function retrievePaymentLinkApi(Request $request, $linkId)
    {
        // Retrieve the payment link using the PayMongo service
        $link = $this->payMongoService->retrieveLink($linkId);

        if (!$link) {
            return response()->json(['error' => 'Link not found'], 404);
        }

        return response()->json($link);
    }
    public function updatePaymentLink(Request $request)
    {
        $this->enableCors($request);

        // Retrieve input values
        $pid = $request->input('pid');
        $linkid = $request->input('linkid');
        $amount = $request->input('amount');
        $description = $request->input('description');
        $remarks = $request->input('remarks');

        // Find the existing payment record by pid
        $payment = Payment::find($pid);

        if ($payment) {
            // Update the payment record
            $payment->linkid = $linkid;
            $payment->amount = $amount;
            $payment->description = $description;
            $payment->remarks = $remarks;
            $payment->save();

            return response()->json([
                'message' => 'Payment link updated successfully.',
                'payment' => $payment,
            ]);
        } else {
            return response()->json([
                'message' => 'Payment record not found for updating.',
            ], 404);
        }
    }

    public function getAllPayments()
    {
        $payments = Payment::all();

        return response()->json([
            'payments' => $payments,
        ]);
    }



}
