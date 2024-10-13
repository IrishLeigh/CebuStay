<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UnitDetails;
use App\Models\UnitRooms;
use App\Models\BedroomType;
use App\Models\PropertyPricing;
use App\Models\Amenity;
use App\Models\Service;

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

        // Retrieve all matching rooms (both Bedroom and Bedarea)
        $unitrooms = UnitRooms::where('unitid', $unitid)
            ->whereIn('roomname', ['Bedroom', 'Bedarea', 'Bedspace'])
            ->get();

        // Expand the unitrooms based on the 'quantity' field
        $expandedUnitRooms = [];
        foreach ($unitrooms as $unitroom) {
            for ($i = 0; $i < $unitroom->quantity; $i++) {
                $expandedUnitRooms[] = $unitroom;  // Add each unit room as many times as its quantity
            }
        }

        // Check if the number of expanded unit rooms matches the number of bedroom details
        if (count($expandedUnitRooms) !== count($bedroomDetails)) {
            return response()->json([
                "status" => 'error',
                "message" => "Mismatch between unit rooms and bedroom details",
                "unitrooms" => $unitrooms,
                "bedroomDetails" => $bedroomDetails
            ]);
        }

        // Process bedroomDetails one-to-one with expandedUnitRooms
        foreach ($expandedUnitRooms as $index => $unitroom) {
            $bedroom = $bedroomDetails[$index];  // Map the current bedroomDetails item to the current expanded unitroom

            $bedtype = new BedroomType();
            $bedtype->unitroomid = $unitroom->unitroomid;
            $bedtype->bedroomnum = $index + 1; // Increment bedroom number
            $bedtype->singlebed = $bedroom['singleBed'];
            $bedtype->bunkbed = $bedroom['doubleBed'];
            $bedtype->largebed = $bedroom['largeBed'];
            $bedtype->superlargebed = $bedroom['superLargeBed'];
            $bedtype->sleepingtype = $bedroom['sleepingtype'];
            $bedtype->save();
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
                        ->whereIn('roomname', ['Bedroom', 'Bedarea'])
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
                        $bedroom_find->bunkbed = $beds['bunkbed'] ?? 0;
                        $bedroom_find->largebed = $beds['largebed'] ?? 0;
                        $bedroom_find->superlargebed = $beds['superlargebed'] ?? 0;
                        $bedroom_find->save();
                    }
                    $hasnewbed = true;
                }
            }

            $find_bedroom = UnitRooms::where('unitid', $unitid)
                ->whereIn('roomname', ['Bedroom', 'Bedarea'])
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
                    $bedroom_find->sleepingtype = $bedroom['sleepingtype'];
                    $bedroom_find->save();
                }
            }
        }
        if ($request->has('newUnitBeds')) {
            $add_bedrooms = $request->input('newUnitBeds');
            $unitroom = UnitRooms::where('unitid', $unitid)
                ->where('roomname', 'Bedspace')
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
                    $new_bedroom->sleepingtype = $bedroom['sleepingtype'];
                    $new_bedroom->save();
                    $unitroom->quantity++;
                    $unitroom->save();
                }
            }
        }

        $unit->save();
        //get all unitdetails and unitrooms and bedtypes
        $unitdetails = UnitDetails::where('unitid', $unitid)->first();
        $unitrooms = UnitRooms::where('unitid', $unitid)->get();
        $unitroom_bedroom = UnitRooms::where('unitid', $unitid)->where('roomname', 'Bedspace')->first();
        $bedtypes = BedroomType::where('unitroomid', $unitroom_bedroom->unitroomid)->get();
        return response()->json([
            'message' => 'Unit details updated successfully',
            'status' => 'success',
            'unitDetails' => $unitdetails,
            'unitRooms' => $unitrooms,
            'bedTypes' => $bedtypes
        ]);
    }


    public function updateMultiUnit(Request $request, $unitid)
    {
        $this->enableCors($request);
        $find_unit = UnitDetails::where('unitid', $unitid)->first();
        $find_bedroom = null; // Initialize the variable

        if ($request->input('unitname') && $request->input('unitname') != $find_unit->unitname) {
            $find_unit->unitname = $request->input('unitname');
        }
        if ($request->input('guest_capacity') && $request->input('guest_capacity') != $find_unit->guest_capacity) {
            $find_unit->guest_capacity = $request->input('guest_capacity');
        }
        if ($request->input('unitquantity') && $request->input('unitquantity') != $find_unit->unitquantity) {
            $find_unit->unitquantity = $request->input('unitquantity');
        }
        if ($request->input('min_price')) {
            $pricingid = $find_unit->proppricingid;
            $find_pricing = PropertyPricing::where('proppricingid', $pricingid)->first();
            if ($find_pricing) {
                $find_pricing->min_price = $request->input('min_price');
                $find_pricing->save();
            }
        }
        if ($request->input('existing_rooms')) {
            $existing_rooms = $request->input('existing_rooms');
            foreach ($existing_rooms as $room) {
                if (!empty($room['unitroomid'])) {
                    $find_room = UnitRooms::where('unitroomid', $room['unitroomid'])->first();
                    if ($find_room) {
                        $find_room->quantity = $room['quantity'];
                        $find_room->save();
                    }
                }
            }
            $updated_unitrooms = UnitRooms::where('unitid', $unitid)->get();
        }
        if ($request->input('new_rooms')) {
            $new_rooms = $request->input('new_rooms');
            foreach ($new_rooms as $new_room) {
                $new = new UnitRooms();
                $new->unitid = $unitid;
                $new->roomname = $new_room['roomname'];
                $new->quantity = $new_room['quantity'];
                $new->save();
            }
            $updated_unitrooms = UnitRooms::where('unitid', $unitid)->get();
        }
        if ($request->input('update_beds')) {
            $update_beds = $request->input('update_beds');
            $find_unitroom = UnitRooms::where('unitid', $unitid)
                ->where('roomname', 'Bedroom')
                ->first();
            $find_bedroom = BedroomType::where('unitroomid', $find_unitroom->unitroomid)->first();
            // Mapping of keys to columns
            $bedroom_columns = [
                'bunkBed' => 'bunkbed',
                'largeBed' => 'largebed',
                'singleBed' => 'singlebed',
                'superLarge' => 'superlargebed',
            ];

            // Loop through the $update_beds and update the corresponding columns
            foreach ($update_beds as $bed_key => $bed_data) {
                if (isset($bedroom_columns[$bed_key])) {
                    // Update the relevant column based on the key
                    $column = $bedroom_columns[$bed_key];

                    // If selected is true, use the provided quantity, else set it to 0
                    $find_bedroom->$column = $bed_data['selected'] ? $bed_data['quantity'] : 0;
                }
            }
            $find_bedroom->save();
        }
        if ($request->input('updated_amenities')) {
            //propertyid from UnitDetails model using unitid
            $propertyid = $find_unit->propertyid;
            $updated_amenities = $request->input('updated_amenities');
            $existing_amenities = Amenity::where('unitid', $unitid)->get();
            $existing_amenities = $existing_amenities->pluck('amenity_name')->toArray();
            //delete amenity in existing_amenities that is not in updated_amenities
            $deleted_amenities = array_diff($existing_amenities, $updated_amenities);
            foreach ($deleted_amenities as $deleted_amenity) {
                $find_amenity = Amenity::where('unitid', $unitid)
                    ->where('amenity_name', $deleted_amenity)
                    ->first();
                $find_amenity->delete();
            }
            //add new amenity in updated_amenities that is not in existing_amenities
            $new_amenities = array_diff($updated_amenities, $existing_amenities);
            foreach ($new_amenities as $new_amenity) {
                $new = new Amenity();
                $new->unitid = $unitid;
                $new->propertyid = $propertyid;
                $new->amenity_name = $new_amenity;
                $new->ismulti = true;
                $new->save();
            }

        }
        //get the updated amenities of the unit
        $update_A = Amenity::where('unitid', $unitid)->get();
        $updated_A = $update_A->pluck('amenity_name')->toArray();

        if ($request->input('updated_services')) {
            //propertyid from UnitDetails model using unitid
            $propertyid = $find_unit->propertyid;
            $updated_services = $request->input('updated_services');
            $existing_services = Service::where('unitid', $unitid)->get();
            $existing_services = $existing_services->pluck('service_name')->toArray();
            //delete service in existing_services that is not in updated_services
            $deleted_services = array_diff($existing_services, $updated_services);
            foreach ($deleted_services as $deleted_service) {
                $find_service = Service::where('unitid', $unitid)
                    ->where('service_name', $deleted_service)
                    ->first();
                $find_service->delete();
            }
            //add new service in updated_services that is not in existing_services
            $new_services = array_diff($updated_services, $existing_services);
            foreach ($new_services as $new_service) {
                $new = new Service();
                $new->unitid = $unitid;
                $new->propertyid = $propertyid;
                $new->service_name = $new_service;
                $new->ismulti = true;
                $new->save();
            }

        }
        //get the updated services of the unit
        $update_S = Service::where('unitid', $unitid)->get();
        $updated_S = $update_S->pluck('service_name')->toArray();

        $find_unit->save();
        $updated_unit = UnitDetails::where('unitid', $unitid)->first();
        return response()->json([
            'status' => 'success',
            'updatedUnit' => $updated_unit,
            'updatedPricing' => $find_pricing ?? null, // Optional: in case $find_pricing doesn't exist
            'updatedRooms' => $updated_unitrooms ?? null, // Optional: in case no rooms are updated
            'updatedBeds' => $find_bedroom ?? null, // Optional: in case $find_bedroom is not found or not updated
            'updatedAmenities' => $updated_A ?? null,
            'updatedServices' => $updated_S ?? null
        ]);
    }

}
