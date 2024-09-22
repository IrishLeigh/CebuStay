<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Services\PayMongoService;
use Illuminate\Http\Request;
use App\Models\Booking;
use GuzzleHttp\Client;

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
        $status = $request->input('status');
        $lengthStay = $request->input('length');
        $returnUrl = $request->input('return_url');
        $bookingId = $request->input('bookingid');

        $totalprice = $amount * $lengthStay;

        // Create the checkout session using the PayMongo service
        try {
            $checkoutUrl = $this->payMongoService->createCheckoutSession($totalprice, $description, $returnUrl, $bookingId);

            // Save the payment record in the database
            $payment = new Payment();
            $payment->amount = $amount / 100;
            $payment->description = $description;
            $payment->status = $status;
            $payment->bookingid = $bookingId;
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

    public function updatePaymentStatus(Request $request)
    {
        $this->enableCors($request);
        
        $payment = Payment::where('bookingid', $request->input('bookingid'))->first();
    
        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }
    
        $payment->status = $request->input('status');
        $payment->save();
    
        return response()->json($payment);
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

    public function refundPayment(Request $request)
    {
        $this->enableCors($request);

        // Get request data
        $paymentId = $request->input('payment_id');
        $amount = $request->input('amount');
        $reason = $request->input('reason', 'others'); // Default reason is 'others'

        if (!$paymentId || !$amount) {
            return response()->json(['error' => 'Payment ID and amount are required.'], 400);
        }

        // Create a Guzzle client to handle the refund request
        $client = new Client();

        try {
            // Prepare the PayMongo secret key
            $apiKey = env('PAYMONGO_SECRET_KEY', 'sk_test_eFrCmpKXktDTxx7avwDX7uBQ'); // Replace with your secret key
            $encodedApiKey = base64_encode($apiKey . ':');

            // Send the refund request to PayMongo
            $response = $client->request('POST', 'https://api.paymongo.com/v1/refunds', [
                'body' => json_encode([
                    'data' => [
                        'attributes' => [
                            'amount' => $amount * 100, // Convert amount to centavos
                            'payment_id' => $paymentId,
                            'reason' => $reason,
                        ]
                    ]
                ]),
                'headers' => [
                    'Authorization' => 'Basic ' . $encodedApiKey,
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ]
            ]);

            // Parse the response
            $refundData = json_decode($response->getBody(), true);

            // Return the refund data
            return response()->json([
                'message' => 'Refund successful',
                'refund' => $refundData,
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getRefund(Request $request)
    {
        $this->enableCors($request);

        // Get refund ID from request
        $refundId = $request->input('refund_id');

        if (!$refundId) {
            return response()->json(['error' => 'Refund ID is required'], 400);
        }

        // Use the PayMongo service to retrieve the refund data
        $refundData = $this->payMongoService->getRefund($refundId);

        if (isset($refundData['error'])) {
            return response()->json(['error' => $refundData['error']], 500);
        }

        // Return the refund details
        return response()->json($refundData, 200);
    }




}
