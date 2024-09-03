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
use App\Models\PropertyOwner;
use App\Models\PropertyOwnership;
use App\Models\PropertyPaymentMethods;
use App\Models\File;

class PropertyController extends CORS
{
    public function show(Request $request)
    {
        $this->enableCors($request);
        $propertyId = $request->input('propertyid');

        $property = Property::with([
            'home',
            'location',
            'unitdetails',
            'unitdetails.unitrooms',
            'unitdetails.unitrooms.bedtype',
            'propertyfiles'

        ])->findOrFail($propertyId);

        return response()->json($property);
    }

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
        $homeid = null;
        if ($property->property_type == "Home" || $property->property_type == "Apartment") {
            $home = new Home();
            $home->propertyid = $propertyid;
            $home->unit_type = $property->unit_type;
            $home->save();
        } else {
            $home = new Home();
            $home->propertyid = $propertyid;
            $home->unit_type = "Multi Unit";
            $home->save();
        }
        return response()->json(["status" => 'success', "message" => "Property and Home inserted to Home successfully", "propertyid" => $propertyid]);
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

        $property_info = Property::select('propertyid', 'property_name', 'property_desc', 'property_type', 'property_directions', 'unit_type')
            ->where('propertyid', $request->input('propertyid'))
            ->first();

        $property_address = DB::table('location')
            ->select('address', 'zipcode', 'latitude', 'longitude')
            ->where('propertyid', $request->input('propertyid'))
            ->first();

        // Fetch amenities and group by unitid if available
        $property_amenities = DB::table('amenity')
            ->select('amenityid', 'amenity_name', 'unitid')
            ->where('propertyid', $request->input('propertyid'))
            ->get();

        $amenities_by_unit = $property_amenities->groupBy('unitid')->map(function ($items) {
            return $items->map(function ($item) {
                return [
                    'amenityid' => $item->amenityid,
                    'amenity_name' => $item->amenity_name,
                ];
            });
        });

        // Fetch services and group by unitid if available
        $property_services = DB::table('services')
            ->select('serviceid', 'service_name', 'unitid')
            ->where('propertyid', $request->input('propertyid'))
            ->get();

        $services_by_unit = $property_services->groupBy('unitid')->map(function ($items) {
            return $items->map(function ($item) {
                return [
                    'serviceid' => $item->serviceid,
                    'service_name' => $item->service_name,
                ];
            });
        });

        $property_facilities = Facilities::select('facilitiesid', 'facilities_name')
            ->where('propertyid', $request->input('propertyid'))
            ->get();

        $property_bookingpolicy = BookingPolicy::select('bookingpolicyid', 'is_cancel_plan', 'cancel_days', 'non_refundable', 'modification_plan', 'offer_discount')
            ->where('propertyid', $request->input('propertyid'))
            ->first();

        $property_houserules = DB::table('house_rules')
            ->select('houserulesid', 'smoking_allowed', 'pets_allowed', 'parties_events_allowed', 'noise_restrictions', 'quiet_hours_start', 'quiet_hours_end', 'custom_rules', 'check_in_from', 'check_in_until', 'check_out_from', 'check_out_until')
            ->where('propertyid', $request->input('propertyid'))
            ->get();

        $units = DB::table('unitdetails')->where('propertyid', $request->input('propertyid'))->get();
        $unit_details = [];

        foreach ($units as $unit) {
            $unitpricing = DB::table('property_pricing')->select('min_price')->where('proppricingid', $unit->proppricingid)->first();
            $unitid = $unit->unitid;
            $unitrooms = DB::table('unitrooms')->select('unitroomid', 'roomname', 'quantity')->where('unitid', $unitid)->get();
            $unitroomsCollection = collect($unitrooms);
            $unitbedroom = $unitroomsCollection->where('roomname', 'Bedroom')->first();
            $propownid = DB::table('property_ownership')->where('propertyid', $request->input('propertyid'))->first();
            $property_ownerdetails = DB::table('property_owner')->where('propertyownershipid', $propownid->propertyownershipid)->first();
            $unitbedroom_beds = DB::table('bedroomtype')->where('unitroomid', $unitbedroom->unitroomid)->get();
            $unitbeds = [];

            foreach ($unitbedroom_beds as $bedroom) {
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
                        'bedroomnum' => $bedroom->bedroomnum,
                        'beds' => $beds
                    ];
                }
            }

            $property_files = File::select('file_url as src', 'caption')
                ->where('propertyid', $request->input('propertyid'))
                ->where('unitid', $unitid)
                ->get();

            $unit_details[] = [
                'unitid' => $unitid,
                'unitname' => $unit->unitname,
                'unitquantity' => $unit->unitquantity,
                'guest_capacity' => $unit->guest_capacity,
                'unitrooms' => $unitrooms,
                'unitbeds' => $unitbeds,
                'unitpricing' => $unitpricing,
                'images' => $property_files,
                'amenities' => $amenities_by_unit->get($unitid, []),
                'services' => $services_by_unit->get($unitid, [])
            ];
        }

        $property_owner = [
            'property_ownership' => $propownid,
            'property_owner' => $property_ownerdetails
        ];

        $payment_method = PropertyPaymentMethods::select('isonline', 'paymentmethod')->where('propertyid', $request->input('propertyid'))->first();
        $payment_method_details = $payment_method ? [
            'isonline' => $payment_method->isonline,
            'paymentmethod' => $payment_method->paymentmethod
        ] : null;

        return response()->json([
            "property_details" => $property_info,
            "property_address" => $property_address,
            "property_unitdetails" => $unit_details,
            "property_amenities" => $property_amenities,
            "property_facilities" => $property_facilities,
            "property_services" => $property_services,
            "property_houserules" => $property_houserules,
            "property_bookingpolicy" => $property_bookingpolicy,
            "property_owner" => $property_owner,
            "payment_method" => $payment_method_details
        ]);
    }


    public function getAllProperties(Request $request)
    {
        $this->enableCors($request);

        // Retrieve all house rules and booking policies
        $property_hr = DB::table('house_rules')->get();
        $property_bp = DB::table('booking_policy')->get();

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

        // Create an associative array for house rules and booking policies
        $houseRulesByPropertyId = [];
        foreach ($property_hr as $rule) {
            $houseRulesByPropertyId[$rule->propertyid][] = $rule;
        }

        $bookingPoliciesByPropertyId = [];
        foreach ($property_bp as $policy) {
            $bookingPoliciesByPropertyId[$policy->propertyid][] = $policy;
        }

        // Add guest_capacity, bedroomcount, bathroomcount, bedcount, house rules, and booking policies to properties list
        foreach ($properties as $property) {
            $propertyId = $property->propertyid;

            // Guest Capacity
            $guestCapacity = isset($unitDetailsByPropertyId[$propertyId]) ? $unitDetailsByPropertyId[$propertyId]->guest_capacity : null;
            $property->guest_capacity = $guestCapacity;

            // Bedroom Count
            $bedroomCount = 0;
            // Bathroom Count
            $bathroomCount = 0;

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

            // House Rules
            $property->house_rules = isset($houseRulesByPropertyId[$propertyId]) ? $houseRulesByPropertyId[$propertyId] : [];

            // Booking Policies
            $property->booking_policies = isset($bookingPoliciesByPropertyId[$propertyId]) ? $bookingPoliciesByPropertyId[$propertyId] : [];
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


    public function getAllPropertiesByUser(Request $request)
    {
        $this->enableCors($request);
        $userid = $request->input('userid');

        $properties = Property::find($userid);

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


    public function searchAvailableProperties(Request $request)
    {
        $checkinDate = $request->input('checkin_date');
        $checkoutDate = $request->input('checkout_date');
        $guestCount = $request->input('guest_count');

        $properties = DB::table('property')
            ->join('unitdetails', 'property.propertyid', '=', 'unitdetails.propertyid')
            ->where('unitdetails.guest_capacity', '>=', $guestCount)
            ->whereNotExists(function ($query) use ($checkinDate, $checkoutDate) {
                $query->select(DB::raw(1))
                    ->from('tbl_booking')
                    ->whereRaw('tbl_booking.unitid = unitdetails.unitid')
                    ->where(function ($query) use ($checkinDate, $checkoutDate) {
                        $query->whereBetween('tbl_booking.checkin_date', [$checkinDate, $checkoutDate])
                            ->orWhereBetween('tbl_booking.checkout_date', [$checkinDate, $checkoutDate])
                            ->orWhere(function ($query) use ($checkinDate, $checkoutDate) {
                                $query->where('tbl_booking.checkin_date', '<=', $checkinDate)
                                    ->where('tbl_booking.checkout_date', '>=', $checkoutDate);
                            });
                    });
            })
            ->select('property.propertyid', 'unitdetails.unitid', 'unitdetails.guest_capacity')
            ->distinct()
            ->get();

        return response()->json($properties);
    }

    public function getAvailableUnits(Request $request)
    {
        $checkinDate = $request->input('checkin_date');
        $checkoutDate = $request->input('checkout_date');
        $guestCount = $request->input('guest_count');
        $propertyId = $request->input('propertyid'); // Get the property ID from the request

        $properties = DB::table('property')
            ->join('unitdetails', 'property.propertyid', '=', 'unitdetails.propertyid')
            ->where('unitdetails.propertyid', $propertyId) // Filter by property ID
            ->where('unitdetails.guest_capacity', '>=', $guestCount)
            ->whereNotExists(function ($query) use ($checkinDate, $checkoutDate) {
                $query->select(DB::raw(1))
                    ->from('tbl_booking')
                    ->whereRaw('tbl_booking.unitid = unitdetails.unitid')
                    ->where(function ($query) use ($checkinDate, $checkoutDate) {
                        $query->whereBetween('tbl_booking.checkin_date', [$checkinDate, $checkoutDate])
                            ->orWhereBetween('tbl_booking.checkout_date', [$checkinDate, $checkoutDate])
                            ->orWhere(function ($query) use ($checkinDate, $checkoutDate) {
                                $query->where('tbl_booking.checkin_date', '<=', $checkinDate)
                                    ->where('tbl_booking.checkout_date', '>=', $checkoutDate);
                            });
                    });
            })
            ->select('property.propertyid', 'unitdetails.unitid', 'unitdetails.guest_capacity')
            ->distinct()
            ->get();

        $availableunits = $properties->pluck('unitid');
        return response()->json($properties);
    }


}
