<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UnitDetails;

class UnitDetailsController extends Controller
{
    public function InsertUnitDetails(Request $request)
    {
        $this->enableCors($request);
        $unit = new UnitDetails();
        $unit->propertyid = $request->input('propertyid');
        $unit->guest_capacity = $request->input('guest_capacity');

        $unit->save();
        $unitid = $unit->unitid;

        return response()->json(["status" => 'success', "message" => "Unit Details inserted successfully", "unitid" => $unitid]);
    }
}
