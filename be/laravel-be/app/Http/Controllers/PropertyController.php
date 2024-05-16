<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use App\Models\BedroomType;
use App\Models\BookingPolicy;
use App\Models\Property;
use Illuminate\Http\Request;
use App\Models\Home;
use App\Models\UnitDetails;
use App\Models\UnitRooms;
use App\Models\Amenity;
use App\Models\Facilities;
use App\Models\Service;


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

    // public function getAllProperties(Request $request)
    // {
    //     $this->enableCors($request);
    //     $properties = Property::select('propertyid', 'property_name', 'property_desc', 'property_type', 'unit_type')->get();
    //     $unitdetails = UnitDetails::select('unitid', 'guest_capacity', 'propertyid')->get();
    //     $unitrooms = UnitRooms::select('unitid','unitroomid', 'roomname', 'quantity')->get();
    //     $beds = BedroomType::select('unitroomid', 'singlebed', 'bunkbed', 'largebed', 'superlargebed')->get();
    //     return response()->json($properties);
    // }

    public function getPropertyById(Request $request)
    {
        $this->enableCors($request);
        $property_info = Property::select('propertyid', 'property_name', 'property_desc', 'property_type', 'property_directions', 'unit_type')->where('propertyid', $request->input('propertyid'))->first();
        $property_address = DB::table('location')->select('address', 'zipcode', 'latitude', 'longitude')->where('propertyid', $request->input('propertyid'))->first();
        $property_amenities = Amenity::select('amenityid', 'amenity_name')->where('propertyid', $request->input('propertyid'))->get();
        $property_facilities = Facilities::select('facilitiesid', 'facilities_name')->where('propertyid', $request->input('propertyid'))->get();
        $property_services = Service::select('serviceid', 'service_name')->where('propertyid', $request->input('propertyid'))->get();
        $property_bookingpolicy = BookingPolicy::select('bookingpolicyid', 'is_cancel_plan', 'cancel_days', 'non_refundable', 'modification_plan', 'offer_discount')->where('propertyid', $request->input('propertyid'))->first();
        $property_houserules = DB::table('house_rules')->select('houserulesid', 'smoking_allowed', 'pets_allowed', 'parties_events_allowed', 'noise_restrictions', 'quiet_hours_start', 'quiet_hours_end', 'custom_rules', 'check_in_from', 'check_in_until', 'check_out_from', 'check_out_until')->where('propertyid', $request->input('propertyid'))->get();
        $property_home = DB::table('home')->select('homeid', 'proppricingid', 'isoccupied')->where('propertyid', $request->input('propertyid'))->first();
        $property_unitdetails = DB::table('unitdetails')->where('propertyid', $request->input('propertyid'))->first();
        $unitpricing = DB::table('property_pricing')->select('min_price')->where('proppricingid', $property_home->proppricingid)->first();
        $unitid = $property_unitdetails->unitid;
        $unitrooms = DB::table('unitrooms')->select('unitroomid', 'roomname', 'quantity')->where('unitid', $unitid)->get();
        $unitroomsCollection = collect($unitrooms);
        $unitbedroom = $unitroomsCollection->where('roomname', 'Bedroom')->first();

        $unitbedroom_beds = DB::table('bedroomtype')->where('unitroomid', $unitbedroom->unitroomid)->get();
        $unitbeds = [];

        foreach ($unitbedroom_beds as $bedroom) {
            $beds = [];

            // Access object properties using the -> operator, not []
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

            // If there are beds in this bedroom, add it to the transformed data
            if (!empty($beds)) {
                $unitbeds[] = [
                    'bedroomnum' => $bedroom->bedroomnum,
                    'beds' => $beds
                ];
            }
        }

        $unitrooms = [
            'unitid' => $unitid,
            'guest_capacity' => $property_unitdetails->guest_capacity,
            'unitrooms' => $unitrooms,
            'unitbeds' => $unitbeds
        ];

        return response()->json([
            "property_details" => $property_info,
            "property_address" => $property_address,
            "property_home" => $property_home,
            "property_unitpricing" => $unitpricing,
            "property_unitrooms" => $unitrooms,
            "property_amenities" => $property_amenities,
            "property_facilities" => $property_facilities,
            "property_services" => $property_services,
            "property_houserules" => $property_houserules,
            "property_bookingpolicy" => $property_bookingpolicy,
        ]);
    }

    public function getAllProperties(Request $request)
    {
        $this->enableCors($request);

        // Retrieve properties
        $properties = Property::select('propertyid', 'property_name', 'property_desc', 'property_type', 'unit_type')->get();

        // Retrieve unit details
        $unitDetails = UnitDetails::select('unitid', 'guest_capacity', 'propertyid')->get();

        // Retrieve unit rooms
        $unitRooms = UnitRooms::select('unitid', 'unitroomid', 'roomname', 'quantity')->get();

        // Retrieve bedroom types
        $bedroomTypes = BedroomType::select('unitroomid', 'singlebed', 'bunkbed', 'largebed', 'superlargebed')->get();

        // Create associative arrays for unit details, unit rooms, and bedroom types
        $unitDetailsByPropertyId = [];
        foreach ($unitDetails as $unitDetail) {
            $unitDetailsByPropertyId[$unitDetail->propertyid] = $unitDetail;
        }

        $unitRoomsByUnitId = [];
        foreach ($unitRooms as $unitRoom) {
            $unitRoomsByUnitId[$unitRoom->unitid][] = $unitRoom;
        }

        // Add guest_capacity, bedroomcount, bathroomcount, and bedcount to properties list
        foreach ($properties as $property) {
            $propertyId = $property->propertyid;

            // Guest Capacity
            $guestCapacity = isset($unitDetailsByPropertyId[$propertyId]) ? $unitDetailsByPropertyId[$propertyId]->guest_capacity : null;
            $property->guest_capacity = $guestCapacity;

            // Bedroom Count
            $bedroomCount = 0;
            // Bathroom Count
            $bathroomCount = 0;
            // Bed Count


            if (isset($unitRoomsByUnitId[$unitDetailsByPropertyId[$propertyId]->unitid])) {
                foreach ($unitRoomsByUnitId[$unitDetailsByPropertyId[$propertyId]->unitid] as $unitRoom) {
                    if ($unitRoom->roomname === 'Bedroom') {
                        $bedroomCount += $unitRoom->quantity;
                    } elseif ($unitRoom->roomname === 'Bathroom') {
                        $bathroomCount += $unitRoom->quantity;
                    }
                }
            }

            $property->bedroomcount = $bedroomCount;
            $property->bathroomcount = $bathroomCount;
        }
        $bedCount = 0;
        foreach ($properties as $property) {
            $propertyId = $property->propertyid;
            $unitid = $unitDetailsByPropertyId[$propertyId]->unitid;
            foreach ($unitRooms as $unitRoom) {
                if ($unitRoom->unitid == $unitid && $unitRoom->roomname == 'Bedroom') {
                    $uiroomid = $unitRoom->unitroomid;
                    foreach ($bedroomTypes as $bedroomType) {
                        if ($bedroomType->unitroomid == $uiroomid) {
                            $bedCount += $bedroomType->singlebed + $bedroomType->bunkbed + $bedroomType->largebed + $bedroomType->superlargebed;
                        }
                    }

                }
            }
            $property->bedcount = $bedCount;
            $bedCount = 0;
        }
        return response()->json($properties);
    }



    public function getAllBedroomDetails(Request $request)
    {
        $this->enableCors($request);

    }
}
