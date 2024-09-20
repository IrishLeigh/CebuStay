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
}
