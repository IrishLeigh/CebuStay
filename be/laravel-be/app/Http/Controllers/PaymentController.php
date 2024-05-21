<?php

namespace App\Http\Controllers;

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
        $request->validate([
            'amount' => 'required|integer|min:100', // PayMongo requires the amount in cents
            'description' => 'required|string|max:255',
            'remarks' => 'nullable|string|max:255',
        ]);

        $amount = $request->input('amount');
        $description = $request->input('description');
        $remarks = $request->input('remarks', '');

        $link = $this->payMongoService->createLink($amount, $description, $remarks);

        return response()->json($link);
    }

    public function retrievePaymentLink($linkId)
    {
        $link = $this->payMongoService->retrieveLink($linkId);

        if (!$link) {
            return response()->json(['error' => 'Link not found'], 404);
        }

        return response()->json($link);
    }

    public function retrievePaymentLinkApi(Request $request, $linkId)
    {
        $link = $this->payMongoService->retrieveLink($linkId);

        if (!$link) {
            return response()->json(['error' => 'Link not found'], 404);
        }

        return response()->json($link);
    }
}
