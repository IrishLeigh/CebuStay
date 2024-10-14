<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Payout;
use App\Models\MonthlyPayment;
use App\Models\Property;
use App\Services\PayMongoService;
use Carbon\Carbon;
use App\Models\PropertyPricing;
use App\Models\UnitDetails;
use Illuminate\Http\Request;
use App\Models\BookingHistory;
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
        $monthlyAmount = $request->input('monthlyAmount') ?? 0;
        $amount = $request->input('amount');
        $description = $request->input('description');
        $status = $request->input('status') ?? 'Pending';
        $lengthStay = $request->input('length') ?? 1;
        $returnUrl = $request->input('return_url');
        $bookingId = $request->input('bookingid');
        $propertyId = $request->input('propertyid');
        $resubmit = $request->input('resubmit') ?? false;

        $payment = Payment::where('bookingid', $bookingId)->first();
        $property = Property::find($request->input('propertyid'));

        if($resubmit) {
            //add here for resubmitting payment
            $payment->delete();
        }

        $totalprice = null;
        // $isMonthlyPayment = $property->unit_type === 'Monthly Term';
        if ($property->unit_type === 'Monthly Term') {
            $description = 'Monthly Payment';
            // $totalprice = round($monthlyAmount * 100);
            if ($monthlyAmount > 0) {
                $totalprice = round($monthlyAmount * 100);
            } else {
                $totalprice = $amount * 100;
            }

        } else if (!$payment) {
            $totalprice = $amount * $lengthStay;
            $totalprice *= 100;
        } else {
            $totalprice = $amount * 100;
        }



        // Create the checkout session using the PayMongo service
        try {
            $checkoutData = $this->payMongoService->createCheckoutSession($totalprice, $description, $returnUrl, $bookingId);
            $checkoutUrl = $checkoutData['checkout_url'];
            $paymentId = $checkoutData['payment_id'];

            if ($payment && !$resubmit) {
                // if ($payment->status === 'Pending' && !$isMonthlyPayment) {
                //     $payment->status = 'Paid';
                //     $payment->save();
                // }
            } else {
                // Save the payment record in the database
                $payment = new Payment();
                $booking = Booking::find($bookingId);
                $monthlyPayment = MonthlyPayment::where('bookingid', $request->input('bookingid'))
                    ->latest('created_at')
                    ->first();
                
                $payment->amount = $totalprice / 100;
                if ($property->unit_type === 'Monthly Term') {
                    $unitDetails = UnitDetails::where('propertyid', $propertyId)->first();
                    $proppricing = PropertyPricing::where('proppricingid', $unitDetails->proppricingid)->first();
                    // $payment->amount = $proppricing->min_price;
                    $payment->amount = number_format($monthlyAmount, 2, '.', '');
                } else {
                    $payment->amount = $totalprice / 100;
                }
                $payment->description = $description;
                $payment->status = $status;
                $payment->paymentid = $paymentId;
                $payment->bookingid = $bookingId;

                $payment->save();

                // if(!$monthlyPayment){
                    
                //     if($monthlyAmount > 0){
                //         $monthlyPayment = new MonthlyPayment();
                //         $monthlyPayment->status = 'Pending';
                //         $monthlyPayment->due_date = $booking->checkout_date;
                //         $monthlyPayment->amount_due = $payment->amount;
                //         $monthlyPayment->bookingid = $request->input('bookingid');
                //         $monthlyPayment->userid = $booking->userid;
                //         $monthlyPayment->amount_due = $payment->amount;
                //         $monthlyPayment->amount_paid = number_format($monthlyAmount, 2, '.', '');
                        
                //         $monthlyPayment->save();
                //     }
                // }
            }



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
        $booking = Booking::find($request->input('bookingid'));

        if (!$payment) {
            return response()->json(['error' => 'Payment not found'], 404);
        }

        $payment->status = $request->input('status');
        // $payment->amount += $request->input('amount');
        $payment->save();


        $property = Property::find($booking->propertyid);
        if ($property->unit_type === 'Monthly Term') {
            $unitDetails = UnitDetails::where('propertyid', $property->propertyid)->first();
            $proppricing = PropertyPricing::where('proppricingid', $unitDetails->proppricingid)->first();
            if ($payment->status === 'Paid') {
                // Retrieve the latest monthly payment or create a new one
                $monthlyPayment = MonthlyPayment::where('bookingid', $request->input('bookingid'))
                    ->latest('created_at')
                    ->first();

                if (!$monthlyPayment) {
                    // If there is no previous monthly payment, create a new one
                    $monthlyPayment = new MonthlyPayment();
                }

                // Get booking check-in and check-out dates
                $checkinDate = Carbon::parse($booking->checkin_date);
                $checkoutDate = Carbon::parse($booking->checkout_date);

                // Calculate the next due date
                if ($monthlyPayment->due_date) {
                    // If there is already a due date, calculate the next one (next month)
                    $nextDueDate = Carbon::parse($monthlyPayment->due_date)->addMonth();
                } else {
                    // If this is the first payment, use the check-in date as the initial due date
                    $nextDueDate = $checkinDate->addMonths(2);
                }

                $dueDateChecker = $nextDueDate;

                // Ensure the next due date does not exceed the checkout date
                if ($nextDueDate->addMonth()->greaterThan($checkoutDate)) {
                    $monthlyPayment->status = 'Paid';
                    $monthlyPayment->due_date = $checkoutDate; // Set the final due date to the checkout date
                    $monthlyPayment->bookingid = $request->input('bookingid');
                    $monthlyPayment->userid = $booking->userid;
                    if ($monthlyPayment->amount_paid <= 0) {
                        $monthlyPayment->amount_paid = $payment->amount;
                    } else {
                        $monthlyPayment->amount_paid += $monthlyPayment->amount_due;
                    }
                    $monthlyPayment->amount_due = 0;

                    $monthlyPayment->save();

                    $charge = $booking->total_price * .15;
                    $paymentId = $payment->pid;

                    return response()->json(['message' => 'No further payments needed, stay is completed', 'monthlyPayment' => $monthlyPayment]);

                } else {
                    $monthlyPayment->status = 'Pending';
                }

                // Update or create the monthly payment
                $monthlyPayment->bookingid = $request->input('bookingid');
                $monthlyPayment->userid = $booking->userid;
                $monthlyPayment->amount_due =number_format($proppricing->min_price, 2, '.', ''); ; // Assuming the amount is the same each month
                if($monthlyPayment->amount_paid <= 0){
                    $monthlyPayment->amount_paid = $payment->amount;
                }else{
                    $monthlyPayment->amount_paid += $monthlyPayment->amount_due;
                }
                // $monthlyPayment->status = 'paid';
                $monthlyPayment->due_date = $nextDueDate; // Set the next due date
                $monthlyPayment->save();
            }
        }



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
        $monthlyPayment = MonthlyPayment::where('bookingid', $bookingid)->first();
        $isMonthlyPayment = $monthlyPayment ? true : false;

        // Get request data
        $paymentId = $payment->linkid;
        $percentage = $request->input('percentage');
        $reason = $request->input('reason', 'others'); // Default reason is 'others'
        $amountToRefund = null;
        if ($isMonthlyPayment) {
            $totalAmount = $monthlyPayment->amount_paid;
        } else {
            $totalAmount = $payment->amount;
        }

        $sendRefund = 0;
        if ($isCancel === 1) {
            if ($dayresult === 1) {
                $amountToRefund = round((100 / 100) * $totalAmount);
            } else {
                $amountToRefund = round(($percentage / 100) * $totalAmount);
            }
            if($monthlyPayment){
                $sendRefund = $monthlyPayment->amount_paid - $amountToRefund; // Subtract the refunded amount
                if ($dayresult === 1) {
                    $sendRefund =  $amountToRefund;
                } else {
                    $sendRefund = $monthlyPayment->amount_paid - $amountToRefund;
                }
            }else{
                if ($dayresult === 1) {
                    $sendRefund = $amountToRefund;
                } else {
                    $sendRefund = $payment->amount - $amountToRefund;
                }
            }
        } else {
            $payment->status = 'Cancelled'; // Set the status to 'cancelled'
            $payment->save(); // Save changes to the database

            $booking->status = 'Cancelled';
            $booking->save();

            // Return the refund data
            return response()->json([
                'message' => 'Refund successful',
                'status' => 'success',
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
                            'amount' => $sendRefund * 100, // Convert amount to centavos
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
                
                if($monthlyPayment){
                    $payment->refund_amount = $monthlyPayment->amount_paid - $amountToRefund; // Subtract the refunded amount
                    $payment->amount = $amountToRefund;
                }else{
                    if ($dayresult === 1) {
                        $payment->refund_amount = $amountToRefund;
                        $payment->amount = 0;
                    } else {
                        $payment->refund_amount = $payment->amount - $amountToRefund;
                        $payment->amount = $amountToRefund;
                    }
                }
                
                $payment->status = 'Cancelled'; // Set the status to 'cancelled'
                $payment->save(); // Save changes to the database
                if($monthlyPayment){
                    $booking->total_price =$monthlyPayment->amount_paid - $amountToRefund;

                    $monthlyPayment->status = 'Cancelled'; // Set the status to 'cancelled'
                    $monthlyPayment->save();
                }else{
                    $booking->total_price = $amountToRefund;
                }
                
                $booking->status = 'Cancelled';
                $booking->save();

                // $charge = $booking->total_price * .15;
                
                $paymentId = $payment->pid;
                // $payout_record = new Payout();
                // $userid = Payment::join('tbl_booking', 'tbl_payment.bookingid', '=', 'tbl_booking.bookingid')
                //     ->join('users', 'tbl_booking.userid', '=', 'users.userid')
                //     ->where('tbl_payment.pid', $paymentId) // Replace with the actual payment ID
                //     ->value('users.userid');
                // $propertyid = Payment::join('tbl_booking', 'tbl_payment.bookingid', '=', 'tbl_booking.bookingid')
                //     ->join('property', 'tbl_booking.propertyid', '=', 'property.propertyid')
                //     ->where('tbl_payment.pid', $paymentId) // Replace with the actual payment ID
                //     ->value('property.propertyid');
                // $get_manager_userid = Property::where('propertyid', $propertyid)->value('userid');
                // if ($payment->amount > 0) {
                //     $payout_record->userid = $get_manager_userid;
                //     $payout_record->propertyid = $propertyid;
                //     $payout_record->pid = $paymentId;
                //     // $payout_record->payout_date = $booking->checkout_date;
                //     $charge = $payment->amount * .15;
                //     $payout_record->payout_amount = $payment->amount - $charge;
                //     $payout_record->status = "Pending";
                //     $payout_record->save();
                // }

                
                $bookingHistory = new BookingHistory();
                $charge = $payment->amount * .15;

                $bookingHistory->userid = $booking->userid;
                $bookingHistory->propertyid = $booking->propertyid;
                $bookingHistory->unitid = $booking->unitid;
                $bookingHistory->bookerid = $booking->bookerid;
                $bookingHistory->guestid = $booking->guestid;
                $bookingHistory->pid = $booking->pid;
                $bookingHistory->stay_length = $booking->stay_length;
                $bookingHistory->guest_count = $booking->guest_count;
                $bookingHistory->checkin_date = $booking->checkin_date;
                $bookingHistory->checkout_date = date('Y-m-d H:i:s'); // Set current date and time
                $bookingHistory->total_price = $booking->total_price;
                if ($isMonthlyPayment) {
                    $bookingHistory->total_price = $monthlyPayment->amount_paid;
                } else {
                    $bookingHistory->total_price = $booking->total_price;
                }
                $bookingHistory->special_request = $booking->special_request;
                $bookingHistory->arrival_time = $booking->arrival_time;
                $bookingHistory->status = "Cancelled";
                $bookingHistory->type = $booking->type;
                $bookingHistory->check_type = "Checkout";
                $bookingHistory->booking_date = $booking->booking_date;

                // Save to BookingHistory
                $bookingHistory->save();

                $find_payment = Payment::where('bookingid', $bookingid)->first();

                $find_payment->bhid = $bookingHistory->bhid;
                $find_payment->save();



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



    public function refundSecurity(Request $request)
    {
        $this->enableCors($request);

        $bookingid = $request->input('bhid');
        $amount = $request->input('amount');
        $bookinghistory = BookingHistory::where('bhid', $bookingid)->first();
        $property = Property::find($bookinghistory->propertyid);
        $unitDetails = UnitDetails::where('propertyid', $property->propertyid)->first();
        $pricing = PropertyPricing::where('proppricingid', $unitDetails->proppricingid)->first();
        $payment = Payment::where('bhid', $bookinghistory->bhid)->first();    
        $reason = $request->input('reason', 'others'); 


        if (!$bookingid) {
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
                            'payment_id' => $payment->linkid,
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
                
              $bookinghistory->securityDeposit = 1;
              $bookinghistory->save();
                // Return the refund data
                return response()->json([
                    'message' => 'Sent Security Deposit Refund Successful',
                    'status' => 'success'
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

        $payment = Payment::where('bookingid', $bookingid)->first();

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
