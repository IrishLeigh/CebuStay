<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PropertyPricing;
use App\Models\Home;

class PropertyPricingController extends CORS
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

    // public function getAllPropertyPricing(Request $request)
    // {
    //     $this->enableCors($request);
    //     $propertyprice = PropertyPricing::select('proppricingid', 'max_price', 'min_price', 'profit')->get();
    //     $homeprice = Home::select('proppricingid', 'homeid')->get();


    //     return response()->json(['status' => 'success', 'properties' => $propertyprice]);
    // }

    public function getAllPropertyPricing(Request $request)
    {
        $this->enableCors($request);

        // Retrieve property prices
        $propertyPrices = PropertyPricing::select('proppricingid', 'max_price', 'min_price', 'profit')->get();

        // Retrieve home prices
        $homePrices = Home::select('proppricingid', 'homeid', 'propertyid')->get();

        // Create an associative array with proppricingid as keys
        $homePricesByProppricingId = [];
        foreach ($homePrices as $homePrice) {
            if (!isset($homePricesByProppricingId[$homePrice->proppricingid])) {
                $homePricesByProppricingId[$homePrice->proppricingid] = [
                    'homeid' => $homePrice->homeid,
                    'propertyid' => $homePrice->propertyid
                ];
            }
        }

        // Add homeid and propertyid to propertyprice list
        foreach ($propertyPrices as $key => $propertyPrice) {
            if (isset($homePricesByProppricingId[$propertyPrice->proppricingid])) {
                $propertyPrices[$key]->homeid = $homePricesByProppricingId[$propertyPrice->proppricingid]['homeid'];
                $propertyPrices[$key]->propertyid = $homePricesByProppricingId[$propertyPrice->proppricingid]['propertyid'];
            } else {
                $propertyPrices[$key]->homeid = null;
                $propertyPrices[$key]->propertyid = null;
            }
        }

        return response()->json(['status' => 'success', 'pricings' => $propertyPrices]);
    }




}
