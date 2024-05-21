<?php

namespace App\Services;

use GuzzleHttp\Client;

class PayMongoService
{
    protected $client;
    protected $apiKey;

    public function __construct()
    {
        $this->client = new Client();
        // $this->apiKey = env('PAYMONGO_API_KEY');
        $this->apiKey = 'sk_test_eFrCmpKXktDTxx7avwDX7uBQ';
    }

    public function createLink($amount, $description, $remarks)
    {
        $response = $this->client->post('https://api.paymongo.com/v1/links', [
            'headers' => [
                'accept' => 'application/json',
                'authorization' => 'Basic ' . base64_encode($this->apiKey),
                'content-type' => 'application/json',
            ],
            'body' => json_encode([
                'data' => [
                    'attributes' => [
                        'amount' => $amount,
                        'description' => $description,
                        'remarks' => $remarks,
                    ]
                ]
            ]),
        ]);

        return json_decode($response->getBody(), true);
    }

    public function retrieveLink($linkId)
    {
        $response = $this->client->get('https://api.paymongo.com/v1/links/' . $linkId, [
            'headers' => [
                'accept' => 'application/json',
                'authorization' => 'Basic ' . base64_encode($this->apiKey),
            ],
        ]);

        return json_decode($response->getBody(), true);
    }
}
