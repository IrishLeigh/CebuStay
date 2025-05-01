<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PropertyPaymentMethods;

class PropertyPaymentMethodsController extends CORS
{
    public function insertPropertyPaymentMethods(Request $request)
    {
        $this->enableCors($request);
        $propertypayment = new PropertyPaymentMethods();
        $propertypayment->propertyid = $request->input('propertyid');
        $propertypayment->isonline = $request->input('isonline');
        $propertypayment->paymentmethod = $request->input('paymentmethod');
        $propertypayment->save();

        return response()->json([
            'message' => 'Property payment method successfully added.',
            'status' => 'success'
        ]);
    }
}
