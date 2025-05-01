<?php

namespace App\Services;
use App\Models\Booking;
use GuzzleHttp\Client;

class PayMongoService
{
    protected $client;
    protected $apiKey;

    // public function __construct()
    // {
    //     $this->client = new Client();
    //     // $this->apiKey = env('PAYMONGO_API_KEY');
    //     $this->apiKey = 'sk_test_eFrCmpKXktDTxx7avwDX7uBQ';
    // }
    public function __construct()
    {
        $this->client = new Client([
            'base_uri' => 'https://api.paymongo.com/v1/',
            'headers' => [
                'Content-Type' => 'application/json',
                'Authorization' => 'sk_test_eFrCmpKXktDTxx7avwDX7uBQ', // Replace with your PayMongo API key
            ],
        ]);
    }

    public function createCheckoutSession($totalprice, $description, $returnUrl, $bookingId)
    {
        $apiKey = 'sk_test_eFrCmpKXktDTxx7avwDX7uBQ'; // Replace with your actual PayMongo API key

        $totalprice = (int) $totalprice;

        $client = new Client([
            'base_uri' => 'https://api.paymongo.com/v1/',
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode($apiKey . ':'),
                'Content-Type' => 'application/json',
            ],
        ]);

        $successUrl = $returnUrl . '?bookingId=' . $bookingId;

        try {
            $response = $client->post('checkout_sessions', [
                'json' => [
                    'data' => [
                        'attributes' => [
                            'amount' => $totalprice,
                            'description' => $description . " Booking",
                            'redirect' => [
                                'success' => $returnUrl,
                                'failed' => $returnUrl,
                            ],
                            'line_items' => [
                                [
                                    'name' => 'Booking at ' . $description,
                                    'quantity' => 1,
                                    'amount' => $totalprice,
                                    'currency' => 'PHP',
                                ],
                            ],
                            'payment_method_types' => [
                                'gcash',
                                'paymaya',
                            ],
                            'reference_number' => null,
                            'send_email_receipt' => false,
                            'show_description' => true,
                            'show_line_items' => true,
                            'status' => 'active',
                            'success_url' => $successUrl,
                            'metadata' => null,
                        ],
                    ],
                ],
            ]);

            // Decode the response to get the checkout URL and payment ID
            $data = json_decode($response->getBody(), true);

            // Retrieve the payment ID and checkout URL from the response
            $checkoutUrl = $data['data']['attributes']['checkout_url']; // Adjust according to actual response
            $paymentId = $data['data']['id']; // The payment ID from the PayMongo response

            return [
                'checkout_url' => $checkoutUrl,
                'payment_id' => $paymentId,
            ];
        } catch (\Exception $e) {
            throw new \Exception('Failed to create checkout session: ' . $e->getMessage());
        }
    }


    public function getRefundService($refundId)
    {
        try {
            // Send the GET request to retrieve refund details
            $response = $this->client->request('GET', 'refunds/' . $refundId, [
                'headers' => [
                    'Accept' => 'application/json',
                    'Authorization' => 'Basic ' . base64_encode(env('PAYMONGO_SECRET_KEY') . ':'), // PayMongo API key
                ],
            ]);

            // Parse the response
            $refundData = json_decode($response->getBody(), true);

            // Return the refund data
            return $refundData;

        } catch (\Exception $e) {
            // Return the error message if the request fails
            return [
                'error' => $e->getMessage()
            ];
        }
    }



}
