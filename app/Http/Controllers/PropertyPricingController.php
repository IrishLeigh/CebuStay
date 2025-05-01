<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PropertyPricing;
use App\Models\Home;
use App\Models\UnitDetails;

class PropertyPricingController extends CORS
{
    public function insertPropertyPricing(Request $request)
    {
        $this->enableCors($request);
        $propertyPricing = new PropertyPricing();
        $propertyPricing->max_price = $request->input('max_price') ?? 0;
        $propertyPricing->min_price = $request->input('min_price');
        $propertyPricing->profit = $request->input('profit');
        $propertyPricing->save();
        $proppricingid = $propertyPricing->proppricingid;
        $unitid = $request->input('unitid');
        $unitref = UnitDetails::where('unitid', $unitid)->first();
        $unitref->proppricingid = $proppricingid;
        $unitref->save();
        // $homeid = $request->input('homeid');
        // $homeref = Home::where('homeid', $homeid)->first();
        // $homeref->proppricingid = $proppricingid;
        // $homeref->save();
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
        // $homePrices = Home::select('proppricingid', 'homeid', 'propertyid')->get();
        $unitPrices = UnitDetails::select('proppricingid', 'unitid', 'propertyid')->get();

        // Create an associative array with proppricingid as keys
        // $homePricesByProppricingId = [];
        $unitPricesByProppricingId = [];

        // foreach ($homePrices as $homePrice) {
        //     if (!isset($homePricesByProppricingId[$homePrice->proppricingid])) {
        //         $homePricesByProppricingId[$homePrice->proppricingid] = [
        //             'homeid' => $homePrice->homeid,
        //             'propertyid' => $homePrice->propertyid
        //         ];
        //     }
        // }
        foreach ($unitPrices as $unitPrice) {
            if (!isset($unitPricesByProppricingId[$unitPrice->proppricingid])) {
                $unitPricesByProppricingId[$unitPrice->proppricingid] = [
                    'unitid' => $unitPrice->unitid,
                    'propertyid' => $unitPrice->propertyid
                ];
            }
        }

        // Add homeid and propertyid to propertyprice list
        // foreach ($propertyPrices as $key => $propertyPrice) {
        //     if (isset($homePricesByProppricingId[$propertyPrice->proppricingid])) {
        //         $propertyPrices[$key]->homeid = $homePricesByProppricingId[$propertyPrice->proppricingid]['homeid'];
        //         $propertyPrices[$key]->propertyid = $homePricesByProppricingId[$propertyPrice->proppricingid]['propertyid'];
        //     } else {
        //         $propertyPrices[$key]->homeid = null;
        //         $propertyPrices[$key]->propertyid = null;
        //     }
        // }

        foreach ($propertyPrices as $key => $propertyPrice) {
            if (isset($unitPricesByProppricingId[$propertyPrice->proppricingid])) {
                $propertyPrices[$key]->unitid = $unitPricesByProppricingId[$propertyPrice->proppricingid]['unitid'];
                $propertyPrices[$key]->propertyid = $unitPricesByProppricingId[$propertyPrice->proppricingid]['propertyid'];
            } else {
                $propertyPrices[$key]->unitid = null;
                $propertyPrices[$key]->propertyid = null;
            }
        }

        return response()->json(['status' => 'success', 'pricings' => $propertyPrices]);
    }




}
