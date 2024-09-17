<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\PropertyOwner;

class PropertyOwnerController extends CORS
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
        $propertyOwner = new PropertyOwner();
        // $propertyOwner->propertyid = $request->input('propertyid');
        $propertyOwner->propertyownershipid = $request->input('propertyownershipid');
        // $propertyOwner->propertycalendarid = $request->input('propertycalendarid');
        $propertyOwner->firstname = $request->input('firstname');
        $propertyOwner->lastname = $request->input('lastname');
        $propertyOwner->displayname = $request->input('displayname');
        $propertyOwner->dateofbirth = $request->input('dateofbirth');
        $propertyOwner->contactnumber = $request->input('contactnumber');
        $propertyOwner->email = $request->input('email');
        // $propertyOwner->country_region = $request->input('country_region');
        $propertyOwner->province = $request->input('street');
        $propertyOwner->province = $request->input('barangay');
        $propertyOwner->city = $request->input('city');
        $propertyOwner->primary_address = $request->input('primary_address') ? $request->input('primary_address') : null;
        $propertyOwner->zipcode = $request->input('zipcode');
        $propertyOwner->describe = $request->input('describe');
        $propertyOwner->calendar = $request->input('calendar');
        $propertyOwner->save();


        return response()->json([
            'status' => 'success',
            'message' => 'Registration successful.',
            'houseRule' => $propertyOwner,
        ]);
    }
}
