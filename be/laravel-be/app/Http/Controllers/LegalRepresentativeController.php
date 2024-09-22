<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\LegalRepresentative;

class LegalRepresentativeController extends CORS
{
    /**
     * Create a new legal representative.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        // Validate the request data
        $request->validate([
            'propertycompanyid' => 'required|integer|exists:property_company,propertycompanyid',
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'phone_number' => 'required|string|max:20',
            'position' => 'required|string|max:255',
            'date_of_birth' => 'required|date',
        ]);

        $legalRepresentative = new LegalRepresentative();
        $legalRepresentative->propertycompanyid = $request->input('propertycompanyid');
        $legalRepresentative->firstname = $request->input('firstname');
        $legalRepresentative->lastname = $request->input('lastname');
        $legalRepresentative->email = $request->input('email');
        $legalRepresentative->phone_number = $request->input('phone_number');
        $legalRepresentative->position = $request->input('position');
        $legalRepresentative->date_of_birth = $request->input('date_of_birth');
        $legalRepresentative->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Legal representative created successfully.',
            'legalRepresentative' => $legalRepresentative,
        ]);
    }

    public function update(Request $request, $id)
    {
        // Validate the request data
        $request->validate([
            'propertycompanyid' => 'sometimes|required|integer|exists:property_company,propertycompanyid',
            'firstname' => 'sometimes|required|string|max:255',
            'lastname' => 'sometimes|required|string|max:255',
            'email' => 'sometimes|required|string|email|max:255',
            'phone_number' => 'sometimes|required|string|max:20',
            'position' => 'sometimes|required|string|max:255',
            'date_of_birth' => 'sometimes|required|date',
        ]);

        // Find the legal representative by ID
        $legalRepresentative = LegalRepresentative::find($id);

        if (!$legalRepresentative) {
            return response()->json([
                'status' => 'error',
                'message' => 'Legal representative not found.',
            ], 404);
        }

        // Update the legal representative's data
        $legalRepresentative->propertycompanyid = $request->input('propertycompanyid', $legalRepresentative->propertycompanyid);
        $legalRepresentative->firstname = $request->input('firstname', $legalRepresentative->firstname);
        $legalRepresentative->lastname = $request->input('lastname', $legalRepresentative->lastname);
        $legalRepresentative->email = $request->input('email', $legalRepresentative->email);
        $legalRepresentative->phone_number = $request->input('phone_number', $legalRepresentative->phone_number);
        $legalRepresentative->position = $request->input('position', $legalRepresentative->position);
        $legalRepresentative->date_of_birth = $request->input('date_of_birth', $legalRepresentative->date_of_birth);
        $legalRepresentative->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Legal representative updated successfully.',
            'legalRepresentative' => $legalRepresentative,
        ]);
    }
}
