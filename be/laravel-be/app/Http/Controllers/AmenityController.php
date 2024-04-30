<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Amenity;

class AmenityController extends Controller
{
    /**
     * Create a new amenity for a property.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request, $propertyId)
    {
        $amenity = new Amenity();
        $amenity->propertyid = $propertyId;
        $amenity->amenity_name = $request->input('amenity_name');
        $amenity->save();

        return response()->json($amenity);
    }
}
