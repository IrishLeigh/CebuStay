<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UnitDetails;
use App\Models\UnitRooms;
use App\Models\BedroomType;

class UnitDetailsController extends CORS
{
    public function insertUnitDetails(Request $request)
    {
        $this->enableCors($request);

        $unitquantity = $request->input('roomQuantity', 1); // Default to 1 if not provided
        // $unitquantity = $unitquantity >= 1 ? $unitquantity : 1;

        $unitrooms = $request->input('roomDetails');
        $roomname = $request->input('roomName', "Single Unit"); // Default to "Single Unit" if not provided

        $unitids = [];

        // Loop to insert the unit details based on the unit quantity
        for ($i = 0; $i < $unitquantity; $i++) {
            $unit = new UnitDetails();
            $unit->propertyid = $request->input('propertyid');
            $unit->guest_capacity = $request->input('guest_capacity');
            // $unit->unitquantity = 1; // Each individual entry is considered as one unit
            $unit->unitname = $roomname;

            $unit->save();
            $unitid = $unit->unitid;

            $this->insertUnitRooms($unitid, $unitrooms);

            // Store the inserted unit id for reference
            $unitids[] = $unitid;
        }

        return response()->json([
            "status" => 'success',
            "message" => "Unit Details inserted successfully",
            "unitid" => $unitids // Returning an array of inserted unit ids
        ]);
    }


    public function insertUnitRooms($unitid, $unitrooms)
    {
        foreach ($unitrooms as $unitroom) {
            $room = new UnitRooms();
            $room->unitid = $unitid;
            $room->roomname = $unitroom['roomType'];
            $room->quantity = $unitroom['quantity'];
            $room->save();
        }
    }

    public function insertBedTypes(Request $request)
    {
        $this->enableCors($request);
        $unitid = $request->input('unitid');
        $bedroomDetails = $request->input('bedroomDetailsData');
        $unitroomidref = UnitRooms::where('unitid', $unitid)
            ->where('roomname', 'Bedroom')
            ->first();
        $counter = 0;
        if (!$unitroomidref) {
            return response()->json(["status" => 'error', "message" => "Unit room not found"]);
        }
        foreach ($bedroomDetails as $bedroom) {
            $bedtype = new BedroomType();
            $bedtype->unitroomid = $unitroomidref->unitroomid;
            $bedtype->bedroomnum = $counter + 1;
            $bedtype->singlebed = $bedroom['singleBed'];
            $bedtype->bunkbed = $bedroom['doubleBed'];
            $bedtype->largebed = $bedroom['largeBed'];
            $bedtype->superlargebed = $bedroom['superLargeBed'];
            $bedtype->save();

            $counter++;
        }

        return response()->json(["status" => 'success', "message" => "Bedroom Details inserted successfully"]);
    }

    public function getUnitById(Request $request)
    {
        try {
            $this->enableCors($request);
            $unitid = $request->input('unitid');
            $unit = UnitDetails::with(['unitrooms', 'unitrooms.bedtype'])->where('unitid', $unitid)->first();
            return response()->json(['unit' => $unit]);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()]);
        }
    }
}
