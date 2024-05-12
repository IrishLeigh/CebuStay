<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;
use App\Models\Home;

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

        $property->save();
        $propertyid = $property->propertyid;
        if ($property->property_type == "Home") {
            $home = new Home();
            $home->propertyid = $propertyid;
            $home->unit_type = $property->unit_type;
            $home->save();
            $homeid = $home->homeid;
        }
        return response()->json(["status" => 'success', "message" => "Property and Home inserted to Home successfully", "propertyid" => $propertyid, "homeid" => $homeid]);
    }

    public function getAllProperties(Request $request)
    {
        $this->enableCors($request);
        $properties = Property::select('propertyid', 'property_name', 'property_desc', 'unit_type')->get();
        return response()->json($properties);
    }
}
