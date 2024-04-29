<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UnitDetails;
use App\Models\UnitRooms;

class UnitDetailsController extends Controller
{
    public function InsertUnitDetails(Request $request)
    {
        $this->enableCors($request);
        $unit = new UnitDetails();
        $unit->propertyid = $request->input('propertyid');
        $unit->guest_capacity = $request->input('guest_capacity');
        $unitrooms = $request->input('roomDetails');

        $unit->save();
        $unitid = $unit->unitid;

        $this->insertUnitRooms($unitid, $unitrooms);

        return response()->json(["status" => 'success', "message" => "Unit Details inserted successfully", "unitid" => $unitid]);
    }

    public function insertUnitRooms($unitid, $unitrooms)
    {
        foreach ($unitrooms as $unitroom) {
            $room = new UnitRooms();
            $room->unitid = $unitid;
            $room->roomname = $unitroom['roomname'];
            $room->quantity = $unitroom['quantity'];
            $room->save();
        }
    }
}
