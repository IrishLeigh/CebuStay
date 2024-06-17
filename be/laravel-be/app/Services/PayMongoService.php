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

    public function createCheckoutSession($amount, $description, $returnUrl, $bookingId)
    {
        $apiKey = 'sk_test_eFrCmpKXktDTxx7avwDX7uBQ'; // Replace with your actual PayMongo API key
    
        $amount = (int) $amount;
    
        $client = new Client([
            'base_uri' => 'https://api.paymongo.com/v1/',
            'headers' => [
                'Authorization' => 'Basic ' . base64_encode($apiKey . ':'),
                'Content-Type' => 'application/json',
            ],
        ]);
        $successUrl = $returnUrl . '?bookingId=' . $bookingId;
        $response = $client->post('checkout_sessions', [
            'json' => [
                'data' => [
                    'attributes' => [
                        'amount' => $amount,
                        'description' => $description . " Booking",
                        'redirect' => [
                            'success' => $returnUrl,
                            'failed' => $returnUrl,
                        ],
                        'line_items' => [
                            [
                                'name' => 'Booking at ' . $description ,
                                'quantity' => 1,
                                'amount' => $amount,
                                'currency' => 'PHP',
                            ],
                        ],
                        'payment_method_types' => [
                            'gcash',
                        ],
                        "reference_number" => null,
                        "send_email_receipt"=> false,
                        "show_description"=> true,
                        "show_line_items"=> true,
                        "status"=> "active",
                        "success_url"=> $successUrl,
                        "created_at"=> 1716666027,
                        "updated_at"=> 1716666027,
                        "metadata"=> null
                    ],
                ],
            ],
        ]);
    
        $data = json_decode($response->getBody(), true);
    
        // Check if the data structure is correct and return the URL
        if (isset($data['data']['attributes']['checkout_url'])) {
            return $data['data']['attributes']['checkout_url'];
        } else {
            throw new \Exception('Checkout URL not found in the response.');
        }


  
    }
    
    
    
}