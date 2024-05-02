<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;

class LocationController extends Controller
{
    /**
     * Create a new amenity for a property.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request, $propertyId)
    {
        $this->enableCors($request);
        $location = new Location();
        $location->propertyid = $propertyId;
        $location->country = $request->input('country');
        $location->city = $request->input('city');
        $location->address = $request->input('address');
        $location->zipcode = $request->input('zipcode');
        $location->pinloc = $request->input('pinloc');
        $location->save();

        return response()->json($location);
    }
}
