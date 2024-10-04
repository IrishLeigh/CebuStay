<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http; // Import Laravel's HTTP client

class PayPalController extends CORS
{
    private $clientId;
    private $clientSecret;
    private $baseUrl;

    public function __construct()
    {
        $this->clientId = env('PAYPAL_CLIENT_ID');
        $this->clientSecret = env('PAYPAL_CLIENT_SECRET');
        $this->baseUrl = env('PAYPAL_API_URL', 'https://api-m.sandbox.paypal.com'); // Sandbox or live URL
    }

    // Function to get PayPal access token
    private function getAccessToken()
    {
        $response = Http::withBasicAuth($this->clientId, $this->clientSecret)
            ->asForm()
            ->post("{$this->baseUrl}/v1/oauth2/token", [
                'grant_type' => 'client_credentials',
            ]);

        if ($response->successful()) {
            return $response->json()['access_token'];
        }

        throw new \Exception('Unable to get PayPal access token');
    }

    // Function for handling PayPal Payouts
    public function sendPayout(Request $request)
    {
        try {
            $accessToken = $this->getAccessToken(); // Get the PayPal access token

            // Prepare the payout data
            $payoutData = [
                "sender_batch_header" => [
                    "sender_batch_id" => uniqid("Payouts_", true), // Unique batch ID
                    "email_subject" => "You have a payout!",
                    "email_message" => "You have received a payout! Thanks for using our service!"
                ],
                "items" => $request->input('items') // Payout items sent in the request
            ];

            // Send the payout request to PayPal API
            $response = Http::withToken($accessToken)
                ->post("{$this->baseUrl}/v1/payments/payouts", $payoutData);

            if ($response->successful()) {
                // Return the PayPal response for successful payout
                return response()->json(['message' => 'Payout successful', 'data' => $response->json()], 200);
            } else {
                // Return an error if PayPal API call fails
                return response()->json(['error' => $response->json()], 400);
            }
        } catch (\Throwable $th) {
            // Return an exception error response
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    // Function for checking payout status
    public function checkPayoutStatus($payoutItemId)
    {
        try {
            $accessToken = $this->getAccessToken(); // Get the PayPal access token

            // Send GET request to check payout status
            $response = Http::withToken($accessToken)
                ->get("{$this->baseUrl}/v1/payments/payouts-item/{$payoutItemId}");

            if ($response->successful()) {
                // Return the payout status response
                return response()->json(['data' => $response->json()], 200);
            } else {
                // Return an error if PayPal API call fails
                return response()->json(['error' => $response->json()], 400);
            }
        } catch (\Throwable $th) {
            // Return an exception error response
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }

    public function getPayoutBatchDetails($batchId)
    {
        try {
            $accessToken = $this->getAccessToken();

            $response = Http::withToken($accessToken)
                ->get("{$this->baseUrl}/v1/payments/payouts/{$batchId}");

            if ($response->successful()) {
                return response()->json(['message' => 'Payout batch details retrieved successfully', 'data' => $response->json()], 200);
            } else {
                return response()->json(['error' => $response->json()], 400);
            }
        } catch (\Throwable $th) {
            return response()->json(['error' => $th->getMessage()], 500);
        }
    }
}
