<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function InsertPropertyInfo(Request $request)
    {
        $this->enableCors($request);
        $property = new Property();
        $property->userid = $request->input('userid');
        $property->property_name = $request->input('property_name');
        $property->property_type = $request->input('property_type');
        $property->property_desc = $request->input('property_desc');
        $property->property_directions = $request->input('property_directions');
        $property->unit_type = $request->input('unit_type');
        $property->number_unit = $request->input('number_unit');

        $property->save();
        $propertyid = $property->propertyid;

        return response()->json(["status" => 'success', "message" => "Data inserted successfully", "propertyid" => $propertyid]);
    }
}
