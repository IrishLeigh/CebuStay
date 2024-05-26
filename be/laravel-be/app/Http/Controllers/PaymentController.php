<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\PayMongoService;
use Illuminate\Http\Request;
use App\Models\Booking;

class PaymentController extends CORS
{
    protected $payMongoService;

    public function __construct(PayMongoService $payMongoService)
    {
        $this->payMongoService = $payMongoService;
    }


    public function createPaymentLink(Request $request)
    {
        // Enable CORS if needed
        $this->enableCors($request);
    
        // Get request data
        $amount = $request->input('amount');
        $description = $request->input('description');
        $returnUrl = $request->input('return_url');
        $bookingId = $request->input('bookingid'); 
    
        // Create the checkout session using the PayMongo service
        try {
            $checkoutUrl = $this->payMongoService->createCheckoutSession($amount, $description, $returnUrl, $bookingId);
    
            // Save the payment record in the database
            $payment = new Payment();
            $payment->amount = $amount / 100;
            $payment->description = $description;
            $payment->save();
    
            // Return the payment record along with the PayMongo checkout session link
            return response()->json([
                'payment' => $payment,
                'checkout_session_url' => $checkoutUrl,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }
    


    public function getPayments(Request $request)
    {
        $this->enableCors($request);
        $bookingId = $request->input('bookingid');
        $booking = Booking::find($bookingId);
        $pid = $booking->pid;
        $payments = Payment::find($pid);

      
        return response()->json($payments);
    }

    public function paymentCallback(Request $request)
    {
        $this->enableCors($request);

        $data = $request->all();

        if (isset($data['data']['attributes']['status']) && $data['data']['attributes']['status'] === 'paid') {
            $metadata = $data['data']['attributes']['metadata'];
            $bookingId = $metadata['bookingid'];

            // Update the booking status in your database
            $booking = Booking::find($bookingId);
            if ($booking) {
                $booking->status = 'Paid';
                $booking->save();

                return response()->json([
                    'message' => 'Payment confirmed and booking updated.'
                ]);
            } else {
                return response()->json([
                    'message' => 'Booking not found.'
                ], 404);
            }
        } else {
            return response()->json([
                'message' => 'Payment not successful.'
            ], 400);
        }
    }



}
