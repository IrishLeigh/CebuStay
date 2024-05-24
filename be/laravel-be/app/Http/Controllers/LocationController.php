<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;

class LocationController extends CORS
{
    // /**
    //  * Create a new amenity for a property.
    //  *
    //  * @param  \Illuminate\Http\Request  $request
    //  * @return \Illuminate\Http\JsonResponse
    //  */
    public function create(Request $request)
    {
        $this->enableCors($request);
        $location = new Location();
        // $location->propertyid = $propertyId;
        $location->propertyid = $request->input('propertyid');
        $location->address = $request->input('address');
        $location->zipcode = $request->input('zipcode');
        $location->latitude = $request->input('latitude');
        $location->longitude = $request->input('longitude');
        $location->save();

        return response()->json($location);
    }
    public function getAllLocation(Request $request)
    {
        $this->enableCors($request);
        $locations = Location::select('propertyid', 'address');
        return response()->json(['status' => 'success', 'data' => $locations->get()]);
    }
}
