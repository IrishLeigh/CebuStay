<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Facilities;

class FacilitiesController extends CORS
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
        $facilities = new Facilities();
        $facilities->propertyid = $request->input('propertyid');
        $facilities->facilities_name = $request->input('facilities_name');
        $facilities->save();

        return response()->json($facilities);
    }
}
