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
        // for ($i = 0; $i < $unitquantity; $i++) {
        $unit = new UnitDetails();
        $unit->propertyid = $request->input('propertyid');
        $unit->guest_capacity = $request->input('guest_capacity');
        $unit->unitquantity = $unitquantity; // Each individual entry is considered as one unit
        $unit->unitname = $roomname;

        $unit->save();
        $unitid = $unit->unitid;

        $this->insertUnitRooms($unitid, $unitrooms);

        // Store the inserted unit id for reference
        //     $unitids[] = $unitid;
        // }

        return response()->json([
            "status" => 'success',
            "message" => "Unit Details inserted successfully",
            "unitid" => $unitid // Returning an array of inserted unit ids
        ]);
    }


    public function insertUnitRooms($unitid, $unitrooms)
    {
        foreach ($unitrooms as $unitroom) {
            $room = new UnitRooms();
            $room->unitid = $unitid;

            // Check if 'roomType' or 'roomname' exists and assign it to roomname
            $room->roomname = $unitroom['roomType'] ?? $unitroom['roomname'] ?? null;

            // Assign quantity
            $room->quantity = $unitroom['quantity'];

            // Save the room if roomname is not null
            if ($room->roomname !== null) {
                $room->save();
            }
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
    public function DeleteUnitRoomSingle(Request $request, $unitid)
    {
        $this->enableCors($request);
        $unitroomid = $request->input('unitroomid');
        $unitroom = UnitRooms::where('unitroomid', $unitroomid)->first();
        if (!$unitroom) {
            return response()->json(['message' => 'Unit room not found', 'status' => 'error']);
        }
        $unitroom->delete();
        $updated_unitrooms = UnitRooms::where('unitid', $unitid)->get();
        return response()->json(['message' => 'Unit room deleted successfully', 'status' => 'success', 'unitRooms' => $updated_unitrooms]);
    }
    public function DeleteBedSingle(Request $request, $unitid)
    {
        $this->enableCors($request);
        $bedroomid = $request->input('bedroomid');  //INPUT BEDTYPE
        $bed_todelete = $request->input('bedtype'); //INPUT BEDTYPE
        $find_bedroom = BedroomType::where('bedroomid', $bedroomid)->first();
        if (!$find_bedroom) {
            return response()->json(['message' => 'Bedroom not found', 'status' => 'error']);
        }
        switch ($bed_todelete) {
            case "largebed":
                $find_bedroom->largebed = 0;
                break;
            case "singlebed":
                $find_bedroom->singlebed = 0;
                break;
            case "bunkbed":
                $find_bedroom->bunkbed = 0;
                break;
            case "superlargebed":
                $find_bedroom->superlargebed = 0;
                break;
        }
        if ($find_bedroom->largebed == 0 && $find_bedroom->singlebed == 0 && $find_bedroom->bunkbed == 0 && $find_bedroom->superlargebed == 0) {
            return response()->json(['message' => 'Bedroom cannot have no beds', 'status' => 'unable']);
        } else {
            $find_bedroom->save();
            $unitroomid = $find_bedroom->unitroomid;
            $find_beds = BedroomType::where('unitroomid', $unitroomid)->get();
            $unitbeds = [];
            foreach ($find_beds as $bedroom) {
                $beds = [];

                if ($bedroom->singlebed > 0) {
                    $beds['singlebed'] = $bedroom->singlebed;
                }
                if ($bedroom->bunkbed > 0) {
                    $beds['bunkbed'] = $bedroom->bunkbed;
                }
                if ($bedroom->largebed > 0) {
                    $beds['largebed'] = $bedroom->largebed;
                }
                if ($bedroom->superlargebed > 0) {
                    $beds['superlargebed'] = $bedroom->superlargebed;
                }

                if (!empty($beds)) {
                    $unitbeds[] = [
                        'bedroomid' => $bedroom->bedroomid,
                        'bedroomnum' => $bedroom->bedroomnum,
                        'beds' => $beds
                    ];
                }
            }
            return response()->json(['message' => 'Bed deleted successfully', 'status' => 'success', 'unitbeds' => $unitbeds]);
        }
    }
    public function DeleteBedRoomSingle(Request $request, $unitid)
    {
        $this->enableCors($request);
        $bedroomid = $request->input('bedroomid');
        $bedroom = BedroomType::where('bedroomid', $bedroomid)->first();
        $unitroomid = $bedroom->unitroomid;
        $decrement_bedroom = UnitRooms::where('unitroomid', $unitroomid)->decrement('quantity');

        if (!$bedroom) {
            return response()->json(['message' => 'Bedroom not found', 'status' => 'error']);
        }
        $bedroom->delete();
        $updated_unitrooms = UnitRooms::where('unitid', $unitid)->get();
        $find_bedroom = UnitRooms::where('unitid', $unitid)
            ->where('roomname', 'Bedroom')
            ->first();
        $unitbeds = [];
        if ($find_bedroom) {
            $find_beds = BedroomType::where('unitroomid', $find_bedroom->unitroomid)->get();
            foreach ($find_beds as $bedroom) {
                $beds = [];

                if ($bedroom->singlebed > 0) {
                    $beds['singlebed'] = $bedroom->singlebed;
                }
                if ($bedroom->bunkbed > 0) {
                    $beds['bunkbed'] = $bedroom->bunkbed;
                }
                if ($bedroom->largebed > 0) {
                    $beds['largebed'] = $bedroom->largebed;
                }
                if ($bedroom->superlargebed > 0) {
                    $beds['superlargebed'] = $bedroom->superlargebed;
                }

                if (!empty($beds)) {
                    $unitbeds[] = [
                        'bedroomid' => $bedroom->bedroomid,
                        'bedroomnum' => $bedroom->bedroomnum,
                        'beds' => $beds
                    ];
                }
            }
        }
        return response()->json(['message' => 'Bedroom deleted successfully', 'status' => 'success', 'unitBeds' => $unitbeds, 'unitRooms' => $updated_unitrooms]);
    }
    public function UpdateUnitInfoSingle(Request $request, $unitid)
    {
        $haschange = false;
        $hasnewbed = false;
        $this->enableCors($request);
        $unit = UnitDetails::where('unitid', $unitid)->first();
        if (!$unit) {
            return response()->json(['message' => 'Unit details not found', 'status' => 'error']);
        }

        if ($request->has('guest_capacity')) {
            $unit->guest_capacity = $request->input('guest_capacity');
        }
        if ($request->has('existingRooms')) {
            $update_unitrooms = $request->input('existingRooms');
            foreach ($update_unitrooms as $unitroom) {
                // Access array elements using the correct keys
                $unitroomId = $unitroom['unitroomid'];
                $quantity = $unitroom['quantity']; // Correct key for quantity

                // Fetch the record based on unitroomid
                $existingUnitRoom = UnitRooms::where('unitroomid', $unitroomId)->first();

                // Check if the record exists
                if ($existingUnitRoom) {
                    // Update the quantity
                    $existingUnitRoom->quantity = $quantity;
                    // Save the changes
                    $existingUnitRoom->save();

                } else {
                }
            }
            $haschange = true;
            $updated_unitrooms = UnitRooms::where('unitid', $unitid)->get();
        }

        if ($request->has('newUnitRooms') && !empty($request->input('newUnitRooms'))) {
            $newrooms = $request->input('newUnitRooms');
            $this->insertUnitRooms($unitid, $newrooms);
            $haschange = true;
            $updated_unitrooms = UnitRooms::where('unitid', $unitid)->get();
        }
        if ($request->has('unitbeds')) {
            $unitbeds = $request->input('unitbeds');
            foreach ($unitbeds as $bedroom) {
                if (!isset($bedroom['bedroomid'])) {
                    $find_unitroom = UnitRooms::where('unitid', $unitid)
                        ->where('roomname', 'Bedroom')
                        ->first();
                    if ($find_unitroom) {
                        $new_bed = new BedroomType();
                        $new_bed->unitroomid = $find_unitroom->unitroomid;
                        $new_bed->bedroomnum = $bedroom['bedroomnum'];
                        $new_bed->singlebed = $bedroom['beds']['singlebed'] ?? 0;
                        $new_bed->bunkbed = $bedroom['beds']['doublebed'] ?? 0;
                        $new_bed->largebed = $bedroom['beds']['largebed'] ?? 0;
                        $new_bed->superlargebed = $bedroom['beds']['superlargebed'] ?? 0;
                        $new_bed->save();
                        $find_unitroom->quantity = $bedroom['bedroomnum'];
                        $find_unitroom->save();
                        $haschange = true;
                        $updated_unitrooms = UnitRooms::where('unitid', $unitid)->get();
                    }

                    $hasnewbed = true;
                } else {
                    $bedroomid = $bedroom['bedroomid'];
                    $bedroom_find = BedroomType::where('bedroomid', $bedroomid)->first();
                    if ($bedroom_find) {
                        $beds = $bedroom['beds'];
                        $bedroom_find->singlebed = $beds['singlebed'] ?? 0;
                        $bedroom_find->bunkbed = $beds['doublebed'] ?? 0;
                        $bedroom_find->largebed = $beds['largebed'] ?? 0;
                        $bedroom_find->superlargebed = $beds['superlargebed'] ?? 0;
                        $bedroom_find->save();
                    }
                    $hasnewbed = true;
                }
            }

            $find_bedroom = UnitRooms::where('unitid', $unitid)
                ->where('roomname', 'Bedroom')
                ->first();
            $unitbeds = [];
            if ($find_bedroom) {
                $find_beds = BedroomType::where('unitroomid', $find_bedroom->unitroomid)->get();
                foreach ($find_beds as $bedroom) {
                    $beds = [];

                    if ($bedroom->singlebed > 0) {
                        $beds['singlebed'] = $bedroom->singlebed;
                    }
                    if ($bedroom->bunkbed > 0) {
                        $beds['bunkbed'] = $bedroom->bunkbed;
                    }
                    if ($bedroom->largebed > 0) {
                        $beds['largebed'] = $bedroom->largebed;
                    }
                    if ($bedroom->superlargebed > 0) {
                        $beds['superlargebed'] = $bedroom->superlargebed;
                    }

                    if (!empty($beds)) {
                        $unitbeds[] = [
                            'bedroomid' => $bedroom->bedroomid,
                            'bedroomnum' => $bedroom->bedroomnum,
                            'beds' => $beds
                        ];
                    }
                }
            }
        }
        $unit->save();
        if ($haschange && $hasnewbed) {
            return response()->json(['message' => 'Unit details updated successfully', 'status' => 'success', 'unitRooms' => $updated_unitrooms, 'unitBeds' => $unitbeds]);
        }
        if ($hasnewbed) {
            return response()->json(['message' => 'Unit details updated successfully', 'status' => 'success', 'unitBeds' => $unitbeds]);
        } else {
            return response()->json(['message' => 'No changes made', 'status' => 'success']);
        }
    }
    public function UpdateUnitInfo(Request $request, $unitid)
    {
        $this->enableCors($request);

        // Find the unit by ID
        $unit = UnitDetails::where('unitid', $unitid)->first();

        if (!$unit) {
            return response()->json(['message' => 'Unit details not found', 'status' => 'error']);
        }

        // Update fields if provided
        if ($request->has('guest_capacity')) {
            $unit->guest_capacity = $request->input('guest_capacity');
        }
        if ($request->has('unitname')) {
            $unit->unitname = $request->input('unitname');
        }
        if ($request->has('unitRooms')) {
            $update_unitrooms = $request->input('unitRooms');
            foreach ($update_unitrooms as $unitroom) {
                // Access array elements using the correct keys
                $unitroomId = $unitroom['unitroomid'];
                $quantity = $unitroom['quantity']; // Correct key for quantity

                // Fetch the record based on unitroomid
                $existingUnitRoom = UnitRooms::where('unitroomid', $unitroomId)->first();

                // Check if the record exists
                if ($existingUnitRoom) {
                    // Update the quantity
                    $existingUnitRoom->quantity = $quantity;
                    // Save the changes
                    $existingUnitRoom->save();
                } else {
                }
            }
        }
        if ($request->has('newUnitRooms')) {
            $newrooms = $request->input('newUnitRooms');
            $this->insertUnitRooms($unitid, $newrooms);
        }
        if ($request->has('unitBeds')) {
            $unitbedrooms = $request->input('unitBeds');
            foreach ($unitbedrooms as $bedroom) {
                $bedroomid = $bedroom['bedroomid'];
                $bedroom_find = BedroomType::where('bedroomid', $bedroomid)->first();
                if ($bedroom_find) {
                    $beds = $bedroom['beds'];
                    $bedroom_find->singlebed = $beds['singleBed'] ?? 0;
                    $bedroom_find->bunkbed = $beds['doubleBed'] ?? 0;
                    $bedroom_find->largebed = $beds['largeBed'] ?? 0;
                    $bedroom_find->superlargebed = $beds['superLargeBed'] ?? 0;
                    $bedroom_find->save();
                }
            }
        }
        if ($request->has('newUnitBeds')) {
            $add_bedrooms = $request->input('newUnitBeds');
            $unitroom = UnitRooms::where('unitid', $unitid)
                ->where('roomname', 'Bedroom')
                ->first();
            $unitroomid = $unitroom->unitroomid;
            if ($unitroom) {
                foreach ($add_bedrooms as $bedroom) {
                    $beds = $bedroom['beds'];
                    $new_bedroom = new BedroomType();
                    $new_bedroom->unitroomid = $unitroomid;
                    $new_bedroom->bedroomnum = $beds['bedroomnum'] ?? 0;
                    $new_bedroom->singlebed = $beds['singleBed'] ?? 0;
                    $new_bedroom->bunkbed = $beds['doubleBed'] ?? 0;
                    $new_bedroom->largebed = $beds['largeBed'] ?? 0;
                    $new_bedroom->superlargebed = $beds['superLargeBed'] ?? 0;
                    $new_bedroom->save();
                }
            }
        }

        $unit->save();

        return response()->json(['message' => 'Unit details updated successfully', 'status' => 'success']);
    }

}
