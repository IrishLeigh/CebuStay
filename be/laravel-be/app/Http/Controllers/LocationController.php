<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Location;
use App\Models\Property;

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

    public function getLocation(Request $request)
    {
        $this->enableCors($request);

        // Retrieve location based on propertyid
        $location = Location::where('propertyid', $request->input('propertyid'))->first();

        if (!$location) {
            return response()->json(['error' => 'Location not found'], 404);
        }

        // Return latitude and longitude
        return response()->json([
            'status' => 'success',
            'latitude' => $location->latitude,
            'longitude' => $location->longitude
        ]);
    }

    public function getDirection(Request $request)
    {
        $this->enableCors($request);

        // Retrieve location based on propertyid
        $direction = Property::where('propertyid', $request->input('propertyid'))->first();

        if (!$direction) {
            return response()->json(['error' => 'Direction not found'], 404);
        }

        // Return latitude and longitude
        return response()->json([
            'status' => 'success',
            'direction' => $direction->property_directions
        ]);
    }

    public function search(Request $request)
    {
        $query = $request->input('query');

        // Fetch top 5 results from Location model by address
        $locationResults = Location::where('address', 'LIKE', "%{$query}%")
            ->take(5)
            ->get(['locationid', 'address']); // Adjust fields as needed

        // Fetch top 5 results from Property model by name
        $propertyResults = Property::where('property_name', 'LIKE', "%{$query}%")
            ->take(5)
            ->get(['propertyid', 'property_name']); // Adjust fields as needed

        // Combine the results
        $results = [
            'locations' => $locationResults,
            'properties' => $propertyResults
        ];

        return response()->json($results);
    }

}
