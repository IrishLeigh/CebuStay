<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PropertyPricing;
use App\Models\Home;

class PropertyPricingController extends Controller
{
    public function insertPropertyPricing(Request $request)
    {
        $this->enableCors($request);
        $propertyPricing = new PropertyPricing();
        $propertyPricing->max_price = $request->input('max_price');
        $propertyPricing->min_price = $request->input('min_price');
        $propertyPricing->profit = $request->input('profit');
        $propertyPricing->save();
        $proppricingid = $propertyPricing->proppricingid;
        $homeid = $request->input('homeid');
        $homeref = Home::where('homeid', $homeid)->first();
        $homeref->proppricingid = $proppricingid;
        $homeref->save();
        return response()->json(["status" => 'success', "message" => "Property Pricing inserted successfully"]);
    }
}
