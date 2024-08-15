<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Amenity;

class AmenityController extends CORS
{
    /**
     * Create a new amenity for a property.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->enableCors($request);
        $amenity = new Amenity();
        $unitid = $request->input('unitid');
        if ($unitid != null) {
            $amenity->unitid = $unitid;
            $amenity->propertyid = $request->input('propertyid');
            $amenity->amenity_name = $request->input('amenity_name');
            $amenity->ismulti = true;
        } else {
            $amenity->propertyid = $request->input('propertyid');
            $amenity->amenity_name = $request->input('amenity_name');
            $amenity->ismulti = false;
        }

        $amenity->save();

        return response()->json($amenity);
    }

    public function getAmenities(Request $request)
    {
        $this->enableCors($request);
        $amenities = Amenity::select('propertyid', 'amenity_name')->get();
        return response()->json(['status' => 'success', 'data' => $amenities]);
    }
    public function getAmenitiesByUnit(Request $request)
    {
        $this->enableCors($request);
        $unitid = $request->input('unitid');
        $amenities = Amenity::where('unitid', $unitid)->get();
        return response()->json(['status' => 'success', 'data' => $amenities]);
    }
}
