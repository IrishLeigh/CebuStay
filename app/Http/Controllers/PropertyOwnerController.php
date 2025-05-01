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
        $propertyOwner->street = $request->input('street');
        $propertyOwner->barangay = $request->input('barangay');
        $propertyOwner->city = $request->input('city');
        $propertyOwner->primary_address = $request->input('primary_address') ;
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

    public function update(Request $request, $id)
    {
        $this->enableCors($request);

        // Find the existing PropertyOwner by ID
        $propertyOwner = PropertyOwner::find($id);

        if (!$propertyOwner) {
            return response()->json([
                'status' => 'error',
                'message' => 'Property owner not found.',
            ], 404);
        }

        // Validate the request data
        $request->validate([
            'propertyownershipid' => 'sometimes|required|integer|exists:property_ownership,propertyownershipid',
            'firstname' => 'sometimes|required|string|max:255',
            'lastname' => 'sometimes|required|string|max:255',
            'displayname' => 'sometimes|required|string|max:255',
            'dateofbirth' => 'sometimes|required|date',
            'contactnumber' => 'sometimes|required|string|max:20',
            'email' => 'sometimes|required|email|max:255',
            'street' => 'sometimes|required|string|max:255',
            'barangay' => 'sometimes|required|string|max:255',
            'city' => 'sometimes|required|string|max:255',
            'primary_address' => 'sometimes|required|string|max:255',
            'zipcode' => 'sometimes|required|string|max:10',
            'describe' => 'nullable|string',
            'calendar' => 'nullable|string'
        ]);

        // Update the property owner fields with request data
        $propertyOwner->propertyownershipid = $request->input('propertyownershipid', $propertyOwner->propertyownershipid);
        $propertyOwner->firstname = $request->input('firstname', $propertyOwner->firstname);
        $propertyOwner->lastname = $request->input('lastname', $propertyOwner->lastname);
        $propertyOwner->displayname = $request->input('displayname', $propertyOwner->displayname);
        $propertyOwner->dateofbirth = $request->input('dateofbirth', $propertyOwner->dateofbirth);
        $propertyOwner->contactnumber = $request->input('contactnumber', $propertyOwner->contactnumber);
        $propertyOwner->email = $request->input('email', $propertyOwner->email);
        $propertyOwner->street = $request->input('street', $propertyOwner->street);
        $propertyOwner->barangay = $request->input('barangay', $propertyOwner->barangay);
        $propertyOwner->city = $request->input('city', $propertyOwner->city);
        $propertyOwner->primary_address = $request->input('primary_address', $propertyOwner->primary_address);
        $propertyOwner->zipcode = $request->input('zipcode', $propertyOwner->zipcode);
        $propertyOwner->describe = $request->input('describe', $propertyOwner->describe);
        $propertyOwner->calendar = $request->input('calendar', $propertyOwner->calendar);

        // Save the updated property owner
        $propertyOwner->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Property owner updated successfully.',
            'propertyOwner' => $propertyOwner,
        ]);
    }

}
