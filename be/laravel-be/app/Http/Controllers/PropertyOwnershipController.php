<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PropertyOwnership;

class PropertyOwnershipController extends Controller
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
        $propertyOwnership = new PropertyOwnership();
        $propertyOwnership->propertyid = $request->input('propertyid');
        $propertyOwnership->propertyownershipid = $request->input('ownershiptype');
        $propertyOwnership->save();

        // return response()->json($propertyOwnership);

        return response()->json([
            'status' => 'Success.',
            'message' => 'Registration successful.',
            'houseRule' => $propertyOwnership,
        ]);
    }
}
