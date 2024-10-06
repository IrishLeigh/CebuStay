<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Payout;
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
            $checkoutData = $this->payMongoService->createCheckoutSession($totalprice, $description, $returnUrl, $bookingId);
            $checkoutUrl = $checkoutData['checkout_url'];
            $paymentId = $checkoutData['payment_id'];


            // Save the payment record in the database
            $payment = new Payment();
            $payment->amount = $totalprice / 100;
            $payment->description = $description;
            $payment->status = $status;
            $payment->paymentid = $paymentId;
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

        $payment = Payment::where('bookingid', $request->input('bookingid'))->latest('created_at')->first();

        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        $payment->status = $request->input('status');
        $payment->save();

        $charge = $payment->amount * .15;
        $paymentId = $payment->pid;
        $payout_record = new Payout();
        $userid = Payment::join('tbl_booking', 'tbl_payment.bookingid', '=', 'tbl_booking.bookingid')
            ->join('users', 'tbl_booking.userid', '=', 'users.userid')
            ->where('tbl_payment.pid', $paymentId) // Replace with the actual payment ID
            ->value('users.userid');
        $propertyid = Payment::join('tbl_booking', 'tbl_payment.bookingid', '=', 'tbl_booking.bookingid')
            ->join('property', 'tbl_booking.propertyid', '=', 'property.propertyid')
            ->where('tbl_payment.pid', $paymentId) // Replace with the actual payment ID
            ->value('property.propertyid');

        $payout_record->userid = $userid;
        $payout_record->propertyid = $propertyid;
        $payout_record->pid = $paymentId;
        $payout_record->payout_amount = $payment->amount - $charge;
        $payout_record->status = "Pending";
        $payout_record->save();

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

        $bookingid = $request->input('bookingid');
        $dayresult = $request->input('dayResult');
        $isCancel = $request->input('isCancel');

        $payment = Payment::where('bookingid', $bookingid)->first();
        $booking = Booking::find($bookingid);

        // Get request data
        $paymentId = $payment->linkid;
        $percentage = $request->input('percentage');
        $reason = $request->input('reason', 'others'); // Default reason is 'others'
        $amountToRefund = null;
        $totalAmount = $payment->amount; // Assuming this is the total amount paid

        if ($isCancel === 1) {
            if ($dayresult === 1) {
                $amountToRefund = round((100 / 100) * $totalAmount);
            } else {
                $amountToRefund = round(($percentage / 100) * $totalAmount);
            }
        } else {
            $payment->status = 'Cancelled'; // Set the status to 'cancelled'
            $payment->save(); // Save changes to the database

            $booking->status = 'Cancelled';
            $booking->save();

            // Return the refund data
            return response()->json([
                'message' => 'Cancelation successful',
                'status' => 'cancelled',
            ], 200);
        }

        // $refundAmount = $amountToRefund * 100;

        if (!$paymentId) {
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
                            'amount' => $amountToRefund * 100, // Convert amount to centavos
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

            // Check if the refund was successful
            if (isset($refundData['data']['id'])) {
                // Update the payment record in the database
                $payment->amount -= $amountToRefund; // Subtract the refunded amount
                $payment->status = 'Cancelled'; // Set the status to 'cancelled'
                $payment->save(); // Save changes to the database

                $booking->total_price -= $amountToRefund;
                $booking->status = 'Cancelled';
                $booking->save();

                // Return the refund data
                return response()->json([
                    'message' => 'Refund successful',
                    'status' => 'success',
                    'refund' => $refundData,
                    'payment' => $amountToRefund
                ], 200);
            } else {
                return response()->json(['error' => 'Failed to process the refund.'], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function getPaymentId(Request $request)
    {
        $this->enableCors($request);

        $bookingid = $request->input('bookingid');

        $payment = Payment::where('bookingid', $bookingid)->latest('created_at')->first();

        // Get request data
        $paymentId = $payment->paymentid;


        if (!$paymentId) {
            return response()->json(['error' => 'Payment ID is required.'], 400);
        }

        // Create a Guzzle client to handle the refund request
        $client = new Client();

        try {
            // Prepare the PayMongo secret key
            $apiKey = env('PAYMONGO_SECRET_KEY', 'sk_test_eFrCmpKXktDTxx7avwDX7uBQ'); // Replace with your secret key
            $encodedApiKey = base64_encode($apiKey . ':');

            // Send the refund request to PayMongo
            $response = $client->request('GET', "https://api.paymongo.com/v1/checkout_sessions/{$paymentId}", [
                'headers' => [
                    'accept' => 'application/json',
                    'authorization' => 'Basic c2tfdGVzdF9lRnJDbXBLWGt0RFR4eDdhdndEWDd1QlE6',
                ],
            ]);

            // Parse the response
            // Decode the response body
            $checkoutData = json_decode($response->getBody(), true);

            // Extract the payment ID from the response
            $paymentId = $checkoutData['data']['attributes']['payments'][0]['id'];

            // Update the payment record in the database
            $payment = Payment::where('bookingid', $bookingid)->latest('created_at')->first();

            if ($payment) {
                $payment->linkid = $paymentId; // Set the link ID to the payment ID
                $payment->save(); // Save the updated payment record

                // $booking = Booking::find($bookingid);
                // $booking->total_price += $payment->amount;

                // $booking->save();
            } else {
                return response()->json(['error' => 'Payment record not found.'], 404);
            }

            return response()->json(['message' => 'Payment ID saved successfully.', 'payment_id' => $paymentId], 200);

        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // public function getRefund(Request $request)
    // {
    //     $this->enableCors($request);
    //     $bookingid = $request->input('bookingid');

    //     $payment = Payment::where('bookingid', $bookingid)->first();;

    //     // Get refund ID from request
    //     $refundId = $request->input('refund_id');

    //     if (!$refundId) {
    //         return response()->json(['error' => 'Refund ID is required'], 400);
    //     }

    //     // Use the PayMongo service to retrieve the refund data
    //     $refundData = $this->payMongoService->getRefundService($payment.$linkid);

    //     if (isset($refundData['error'])) {
    //         return response()->json(['error' => $refundData['error']], 500);
    //     }

    //     // Return the refund details
    //     return response()->json($refundData, 200);
    // }




}
