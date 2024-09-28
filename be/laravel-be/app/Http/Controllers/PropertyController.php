<?php

namespace App\Http\Controllers;

use App\Models\PropertyPricing;
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
use App\Models\Location;
use App\Models\PropertyPaymentMethods;
use App\Models\File;
use App\Models\HouseRule;

class PropertyController extends CORS
{
    public function disableProperty(Request $request)
    {
        $this->enableCors($request);
        $propertyid = $request->input('propertyid');
        $find_disableproperty = Property::find($propertyid);
        if (!$find_disableproperty) {
            return response()->json(['status' => 'error', 'message' => 'Property not found']);
        }
        $find_disableproperty->isactive = 0;
        $find_disableproperty->save();
        return response()->json(['status' => 'success', 'message' => 'Property has been disabled']);
    }
    public function activateProperty(Request $request)
    {
        $this->enableCors($request);
        $propertyid = $request->input('propertyid');
        $find_disableproperty = Property::find($propertyid);
        if (!$find_disableproperty) {
            return response()->json(['status' => 'error', 'message' => 'Property not found']);
        }
        $find_disableproperty->isactive = 1;
        $find_disableproperty->save();
        return response()->json(['status' => 'success', 'message' => 'Property has been activated']);
    }
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
        $singleunittype = ["Home", "Apartment", "Condominium", "Cabin", "Luxury Home", "Bungalow"];

        if (in_array($property->unit_type, $singleunittype)) {
            $home = new Home();
            $home->propertyid = $propertyid;
            $home->unit_type = $property->unit_type;
            $home->save();
        } else {
            $home = new Home();
            $home->propertyid = $propertyid;
            $home->unit_type = $property->unit_type;
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

        $property_info = Property::select('propertyid', 'property_name', 'property_desc', 'property_type', 'property_directions', 'unit_type', 'isActive')
            ->where('propertyid', $request->input('propertyid'))
            ->first();
        if ($property_info->isActive == 0) {
            return response()->json(['status' => 'error', 'message' => 'Property is disabled']);
        }
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

        $property_bookingpolicy = BookingPolicy::select('bookingpolicyid', 'isCancellationPolicy', 'cancellationDays', 'CancellationCharge', 'isModificationPolicy', 'modificationDays', 'modificationCharge')
            ->where('propertyid', $request->input('propertyid'))
            ->first();

        $property_houserules = DB::table('house_rules')
            ->select('houserulesid', 'smoking_allowed', 'pets_allowed', 'parties_events_allowed', 'noise_restrictions', 'quiet_hours_start', 'quiet_hours_end', 'custom_rules', 'check_in_from', 'check_in_until', 'check_out_from', 'check_out_until')
            ->where('propertyid', $request->input('propertyid'))
            ->get();

        $units = DB::table('unitdetails')->where('propertyid', $request->input('propertyid'))->get();
        $unit_details = [];
        $property_ownerdetails = [];
        $property_companydetails = [];

        foreach ($units as $unit) {
            $unitpricing = DB::table('property_pricing')->select('min_price')->where('proppricingid', $unit->proppricingid)->first();
            $unitid = $unit->unitid;
            $unitrooms = DB::table('unitrooms')->select('unitroomid', 'roomname', 'quantity')->where('unitid', $unitid)->get();
            $unitroomsCollection = collect($unitrooms);
            $unitbedroom = $unitroomsCollection->where('roomname', 'Bedroom')->first();
            $propownid = DB::table('property_ownership')->where('propertyid', $request->input('propertyid'))->first();
            if ($propownid->ownershiptype == 'Individual') {
                $property_ownerdetails = DB::table('property_owner')->where('propertyownershipid', $propownid->propertyownershipid)->first();
            } else {
                $property_companydetails = DB::table('property_company')->where('propertyownershipid', $propownid->propertyownershipid)->first();
                $property_legalrepdetails = DB::table('legal_representative')
                    ->where('propertycompanyid', $property_companydetails->propertycompanyid)
                    ->get()
                    ->toArray();
            }


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
                        'bedroomid' => $bedroom->bedroomid,
                        'bedroomnum' => $bedroom->bedroomnum,
                        'beds' => $beds
                    ];
                }
            }

            $property_files = File::select('file_url as src', 'caption', 'id')
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
        ];

        if ($propownid->ownershiptype == 'Individual') {
            $property_owner['property_owner'] = $property_ownerdetails;
        } else {
            $property_owner['property_company'] = $property_companydetails;
            $property_owner['legal_representative'] = $property_legalrepdetails;
        }

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

    public function UpdatePropertyInfo(Request $request, $propertyid)
    {
        $this->enableCors($request);

        // Find the property by ID
        $property = Property::find($propertyid);
        if (!$property) {
            return response()->json(["status" => 'error', "message" => "Property not found"], 404);
        }

        // Update fields if they are not null
        if ($request->has('property_name')) {
            $property->property_name = $request->input('property_name');
        }
        if ($request->has('property_type')) {
            $property->property_type = $request->input('property_type');
        }
        if ($request->has('property_desc')) {
            $property->property_desc = $request->input('property_desc');
        }
        if ($request->has('property_directions')) {
            $property->property_directions = $request->input('property_directions');
        }
        if ($request->has('unit_type')) {
            $property->unit_type = $request->input('unit_type');
        }

        $property->save();

        // Update or create a Home entry if necessary
        if ($request->has('unit_type')) {
            $home = Home::firstOrNew(['propertyid' => $propertyid]);
            if ($property->property_type == "Multi Unit") {
                $home->unit_type = "Multi Unit";
            } else if ($property->property_type == "Home" || $property->property_type == "Apartment") {
                $home->unit_type = $request->input('unit_type') ?? "Single Unit";
            }
            $home->save();
        }

        // Find the location by property ID
        $location = Location::where('propertyid', $propertyid)->first();
        if (!$location) {
            return response()->json(["status" => 'error', "message" => "Location not found"], 404);
        }

        // Update fields only if they are provided (not null)
        if ($request->has('address')) {
            $location->address = $request->input('address');
        }
        if ($request->has('zipcode')) {
            $location->zipcode = $request->input('zipcode');
        }
        if ($request->has('latitude')) {
            $location->latitude = $request->input('latitude');
        }
        if ($request->has('longitude')) {
            $location->longitude = $request->input('longitude');
        }

        $location->save();

        return response()->json(["status" => 'success', "message" => "Property Info updated successfully", "propertyid" => $propertyid]);
    }

    public function getAllProperties(Request $request)
    {
        $this->enableCors($request);

        // Retrieve all house rules and booking policies
        $property_hr = DB::table('house_rules')->get();
        $property_bp = DB::table('booking_policy')->get();

        // Retrieve properties
        $properties = Property::select('propertyid', 'property_name', 'property_desc', 'property_type', 'unit_type')
            ->where('isActive', 1)
            ->get();

        // Retrieve unit details
        $unitDetails = UnitDetails::select('unitid', 'guest_capacity', 'propertyid')->get();

        // Retrieve unit rooms
        $unitRooms = UnitRooms::select('unitid', 'unitroomid', 'roomname', 'quantity')->get();

        // Retrieve bedroom types
        $bedroomTypes = BedroomType::select('unitroomid', 'singlebed', 'bunkbed', 'largebed', 'superlargebed')->get();

        // Retrieve property locations (addresses)
        $locations = Location::select('propertyid', 'address', 'zipcode', 'latitude', 'longitude')->get();

        // Create associative arrays for unit details and unit rooms
        $unitDetailsByPropertyId = [];
        foreach ($unitDetails as $unitDetail) {
            $unitDetailsByPropertyId[$unitDetail->propertyid][] = $unitDetail;
        }

        $unitRoomsByUnitId = [];
        foreach ($unitRooms as $unitRoom) {
            $unitRoomsByUnitId[$unitRoom->unitid][] = $unitRoom;
        }

        // Create associative arrays for house rules and booking policies
        $houseRulesByPropertyId = [];
        foreach ($property_hr as $rule) {
            $houseRulesByPropertyId[$rule->propertyid][] = $rule;
        }

        $bookingPoliciesByPropertyId = [];
        foreach ($property_bp as $policy) {
            $bookingPoliciesByPropertyId[$policy->propertyid][] = $policy;
        }

        // Create associative array for locations
        $locationsByPropertyId = [];
        foreach ($locations as $location) {
            $locationsByPropertyId[$location->propertyid] = $location;
        }

        // Add guest_capacity, bedroomcount, bathroomcount, bedcount, house rules, booking policies, and address to properties list
        foreach ($properties as $property) {
            $propertyId = $property->propertyid;

            // Guest Capacity
            $unitDetail = $unitDetailsByPropertyId[$propertyId][0] ?? null; // Assuming one unit detail per property
            $property->guest_capacity = $unitDetail->guest_capacity ?? null;

            // Bedroom Count
            $bedroomCount = 0;
            // Bathroom Count
            $bathroomCount = 0;

            if (isset($unitDetailsByPropertyId[$propertyId])) {
                foreach ($unitDetailsByPropertyId[$propertyId] as $unitDetail) {
                    if (isset($unitRoomsByUnitId[$unitDetail->unitid])) {
                        foreach ($unitRoomsByUnitId[$unitDetail->unitid] as $unitRoom) {
                            if ($unitRoom->roomname === 'Bedroom') {
                                $bedroomCount += $unitRoom->quantity;
                            } elseif ($unitRoom->roomname === 'Bathroom') {
                                $bathroomCount += $unitRoom->quantity;
                            }
                        }
                    }
                }
            }

            $property->bedroomcount = $bedroomCount;
            $property->bathroomcount = $bathroomCount;

            // House Rules
            $property->house_rules = $houseRulesByPropertyId[$propertyId] ?? [];

            // Booking Policies
            $property->booking_policies = $bookingPoliciesByPropertyId[$propertyId] ?? [];

            // Address Information
            if (isset($locationsByPropertyId[$propertyId])) {
                $property->address = $locationsByPropertyId[$propertyId]->address;
                // $property->zipcode = $locationsByPropertyId[$propertyId]->zipcode;
                // $property->latitude = $locationsByPropertyId[$propertyId]->latitude;
                // $property->longitude = $locationsByPropertyId[$propertyId]->longitude;
            } else {
                $property->address = null;
                // $property->zipcode = null;
                // $property->latitude = null;
                // $property->longitude = null;
            }

            // Bed Count Calculation
            $bedCount = 0;
            if (isset($unitDetailsByPropertyId[$propertyId])) {
                foreach ($unitDetailsByPropertyId[$propertyId] as $unitDetail) {
                    if (isset($unitRoomsByUnitId[$unitDetail->unitid])) {
                        foreach ($unitRoomsByUnitId[$unitDetail->unitid] as $unitRoom) {
                            if ($unitRoom->roomname == 'Bedroom') {
                                foreach ($bedroomTypes as $bedroomType) {
                                    if ($bedroomType->unitroomid == $unitRoom->unitroomid) {
                                        $bedCount += $bedroomType->singlebed + $bedroomType->bunkbed + $bedroomType->largebed + $bedroomType->superlargebed;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            $property->bedcount = $bedCount;
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
            ->where('property.isActive', 1)
            ->whereNotExists(function ($query) use ($checkinDate, $checkoutDate) {
                $query->select(DB::raw(1))
                    ->from('tbl_booking')
                    ->whereRaw('tbl_booking.unitid = unitdetails.unitid')
                    ->where(function ($query) use ($checkinDate, $checkoutDate) {
                        $query->where(function ($query) use ($checkinDate, $checkoutDate) {
                            // Overlap check: if booking dates overlap with the requested dates
                            $query->where('tbl_booking.checkin_date', '<', $checkoutDate)
                                ->where('tbl_booking.checkout_date', '>', $checkinDate);
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
            ->where('property.isActive', true) // Check if the property is active
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

        // Check if no available units were found
        if ($properties->isEmpty()) {
            return response()->json([
                'message' => 'No available units found for the specified criteria.',
                'status' => 'error'
            ]);
        }

        // Return available units if found
        $availableunits = $properties->pluck('unitid');
        return response()->json($availableunits);
    }

    public function updatePropertyBenefits(Request $request, $propertyid)
    {
        $this->enableCors($request);

        if ($request->input('updated_amenities')) {
            $updated_amenities = $request->input('updated_amenities');

            // Get the existing amenities, transform the names, and extract them into an array of strings
            $existing_amenities = Amenity::where('propertyid', $propertyid)
                ->whereNull('unitid')
                ->get()
                ->map(function ($amenity) {
                    // Transform the name to lowercase and remove spaces
                    return strtolower(str_replace(' ', '', $amenity->amenity_name));
                })
                ->toArray(); // Convert the collection to an array of strings
            // Loop through the updated amenities and add new ones
            foreach ($updated_amenities as $updated_amenity) {
                // Transform the updated amenity to lowercase and remove spaces for comparison
                $updated_amenity_transformed = strtolower(str_replace(' ', '', $updated_amenity));

                // Check if the transformed updated amenity is not in the existing amenities
                if (!in_array($updated_amenity_transformed, $existing_amenities)) {
                    $new_amenity = new Amenity();
                    $new_amenity->propertyid = $propertyid;

                    // Capitalize the first letter of each word
                    $new_amenity->amenity_name = ucwords(strtolower($updated_amenity));

                    $new_amenity->ismulti = true;
                    $new_amenity->save();
                }
            }


            // Loop through the existing amenities and remove any that are not in the updated list
            foreach ($existing_amenities as $existing_amenity) {
                if (!in_array($existing_amenity, $updated_amenities)) {
                    Amenity::where('propertyid', $propertyid)
                        ->where('amenity_name', $existing_amenity)
                        ->delete();
                }
            }

            $updated_amenities = Amenity::where('propertyid', $propertyid)
                ->whereNull('unitid')
                ->get()
                ->map(function ($amenity) {
                    // Transform the name to lowercase and remove spaces
                    return strtolower(str_replace(' ', '', $amenity->amenity_name));
                })
                ->toArray(); // Convert the collection to an array of strings
        }
        if ($request->input('updated_facilities')) {
            $updated_facilities = $request->input('updated_facilities');

            // Get the existing facilities, transform the names, and extract them into an array of strings
            $existing_facilities = Facilities::where('propertyid', $propertyid)
                ->get()
                ->map(function ($facility) {
                    // Transform the name to lowercase and remove spaces
                    return strtolower(str_replace(' ', '', $facility->facilities_name));
                })
                ->toArray(); // Convert the collection to an array of strings

            // Loop through the updated facilities and add new ones
            foreach ($updated_facilities as $updated_facility) {
                // Transform the updated facility to lowercase and remove spaces for comparison
                $updated_facility_transformed = strtolower(str_replace(' ', '', $updated_facility));

                // Check if the transformed updated facility is not in the existing facilities
                if (!in_array($updated_facility_transformed, $existing_facilities)) {
                    $new_facility = new Facilities();
                    $new_facility->propertyid = $propertyid;

                    // Capitalize the first letter of each word
                    $new_facility->facilities_name = ucwords(strtolower($updated_facility));

                    $new_facility->save();
                }
            }

            // Loop through the existing facilities and remove any that are not in the updated list
            foreach ($existing_facilities as $existing_facility) {
                if (!in_array($existing_facility, $updated_facilities)) {
                    Facilities::where('propertyid', $propertyid)
                        ->where('facilities_name', $existing_facility)
                        ->delete();
                }
            }

            // Update the list of existing facilities after modifications
            $updated_facilities = Facilities::where('propertyid', $propertyid)
                ->get()
                ->map(function ($facility) {
                    // Transform the name to lowercase and remove spaces
                    return strtolower(str_replace(' ', '', $facility->facilities_name));
                })
                ->toArray(); // Convert the collection to an array of strings
        }

        if ($request->input('updated_services')) {
            $updated_services = $request->input('updated_services');

            // Get the existing services, transform the names, and extract them into an array of strings
            $existing_services = Service::where('propertyid', $propertyid)
                ->whereNull('unitid')
                ->get()
                ->map(function ($service) {
                    // Transform the name to lowercase and remove spaces
                    return strtolower(str_replace(' ', '', $service->service_name));
                })
                ->toArray(); // Convert the collection to an array of strings

            // Loop through the updated services and add new ones
            foreach ($updated_services as $updated_service) {
                // Transform the updated service to lowercase and remove spaces for comparison
                $updated_service_transformed = strtolower(str_replace(' ', '', $updated_service));

                // Check if the transformed updated service is not in the existing services
                if (!in_array($updated_service_transformed, $existing_services)) {
                    $new_service = new Service();
                    $new_service->propertyid = $propertyid;

                    // Capitalize the first letter of each word
                    $new_service->service_name = ucwords(strtolower($updated_service));

                    $new_service->ismulti = true; // Assuming you want to set ismulti as true
                    $new_service->save();
                }
            }

            // Loop through the existing services and remove any that are not in the updated list
            foreach ($existing_services as $existing_service) {
                if (!in_array($existing_service, $updated_services)) {
                    Service::where('propertyid', $propertyid)
                        ->where('service_name', $existing_service)
                        ->delete();
                }
            }

            // Update the list of existing services after modifications
            $updated_services = Service::where('propertyid', $propertyid)
                ->whereNull('unitid')
                ->get()
                ->map(function ($service) {
                    // Transform the name to lowercase and remove spaces
                    return strtolower(str_replace(' ', '', $service->service_name));
                })
                ->toArray(); // Convert the collection to an array of strings
        }


        return response()->json(['status' => 'success', 'updatedAmenities' => $updated_amenities, 'updatedFacilities' => $updated_facilities, 'updatedServices' => $updated_services]);
    }

    public function updatePropertyRules(Request $request, $propertyid)
    {
        $this->enableCors($request);
        if ($request->input('updated_rules')) {
            $updated_rules = $request->input('updated_rules');
            $existing_rules = HouseRule::where('propertyid', $propertyid)->first();
            $existing_rules->check_in_from = $updated_rules['checkInFrom'];
            $existing_rules->check_in_until = $updated_rules['checkInUntil'];
            $existing_rules->check_out_from = $updated_rules['checkOutFrom'];
            $existing_rules->check_out_until = $updated_rules['checkOutUntil'];
            $existing_rules->custom_rules = ($updated_rules['customRules'] == "") ? "None" : $updated_rules['customRules'];
            $existing_rules->parties_events_allowed = $updated_rules['partiesAllowed'];
            $existing_rules->pets_allowed = $updated_rules['petsAllowed'];
            if ($updated_rules['noise_restrictions'] == false) {
                $existing_rules->noise_restrictions = false;
                $existing_rules->quiet_hours_end = null;
                $existing_rules->quiet_hours_start = null;
            } else if ($updated_rules['quietHoursStart'] && $updated_rules['quietHoursEnd']) {
                $existing_rules->quiet_hours_end = $updated_rules['quietHoursEnd'];
                $existing_rules->quiet_hours_start = $updated_rules['quietHoursStart'];
                $existing_rules->noise_restrictions = true;
            }
            // $existing_rules->noise_restrictions = $updated_rules['noise_restrictions'] ;
            // if ($updated_rules['noise_restrictions']) {
            //     $existing_rules->quiet_hours_end = "";
            //     $existing_rules->quiet_hours_start = "";
            // } else {
            //     $existing_rules->quiet_hours_end = $updated_rules['quietHoursEnd'];
            //     $existing_rules->quiet_hours_start = $updated_rules['quietHoursStart'];
            // }

            $existing_rules->smoking_allowed = $updated_rules['smokingAllowed'];
            $existing_rules->save();
            $raw_get_updated_rules = HouseRule::where('propertyid', $propertyid)->first();
            $get_updated_rules = HouseRule::where('propertyid', $propertyid)->first();
            $new_rules = [
                'checkInFrom' => $get_updated_rules->check_in_from,
                'checkInUntil' => $get_updated_rules->check_in_until,
                'checkOutFrom' => $get_updated_rules->check_out_from,
                'checkOutUntil' => $get_updated_rules->check_out_until,
                'customRules' => $get_updated_rules->custom_rules,
                'partiesAllowed' => $get_updated_rules->parties_events_allowed ? true : false,
                'petsAllowed' => $get_updated_rules->pets_allowed ? true : false,
                'noise_restrictions' => $get_updated_rules->noise_restrictions ? true : false,
                'quietHoursEnd' => $get_updated_rules->quiet_hours_end,
                'quietHoursStart' => $get_updated_rules->quiet_hours_start,
                'smokingAllowed' => $get_updated_rules->smoking_allowed ? true : false
            ];
        }
        if ($request->input('updated_policies')) {
            $updated_policies = $request->input('updated_policies');
            $existing_policies = BookingPolicy::where('propertyid', $propertyid)->first();
            $existing_policies->is_cancel_plan = $updated_policies['standardCancellation'];
            $existing_policies->cancel_days = $updated_policies['standardCancellation'] ? $updated_policies['cancellationDays'] : null;
            $existing_policies->non_refundable = $updated_policies['nonRefundableRate'];
            $existing_policies->modification_plan = $updated_policies['modificationPlan'];
            $existing_policies->offer_discount = $updated_policies['offerDiscounts'];
            $existing_policies->save();
            $raw_get_updated_policies = BookingPolicy::where('propertyid', $propertyid)->first();
            $get_updated_policies = BookingPolicy::where('propertyid', $propertyid)->first();
            $new_policies = [
                'standardCancellation' => $get_updated_policies->is_cancel_plan ? true : false,
                'cancellationDays' => $get_updated_policies->cancel_days,
                'nonRefundableRate' => $get_updated_policies->non_refundable ? true : false,
                'modificationPlan' => $get_updated_policies->modification_plan ? true : false,
                'offerDiscounts' => $get_updated_policies->offer_discount ? true : false
            ];
        }
        return response()->json([
            'status' => 'success',
            'updatedRules' => $new_rules,
            'rawUpdatedRules' => $raw_get_updated_rules,
            'updatedPolicies' => $new_policies,
            'rawUpdatedPolicies' => $raw_get_updated_policies
        ]);
    }

    public function updatePropertyPricePayment(Request $request, $propertyid)
    {
        $this->enableCors($request);
        if ($request->input('unitPricing')) {
            $updated_pricing = $request->input('unitPricing');
            $pricingid = UnitDetails::where('propertyid', $propertyid)
                ->first();
            $get_pricing = PropertyPricing::where('proppricingid', $pricingid->proppricingid)->first();
            $get_pricing->min_price = $updated_pricing['min_price'];
            $get_pricing->save();
            $new_pricing = PropertyPricing::where('proppricingid', $pricingid->proppricingid)->first();

        }
        if ($request->input('paymentData')) {
            $updated_payment = $request->input('paymentData');
            $get_payment = PropertyPaymentMethods::where('propertyid', $propertyid)->first();
            $get_payment->paymentmethod = $updated_payment['paymentmethod'];
            $get_payment->isonline = $updated_payment['isonline'];
            $get_payment->save();
            $new_payment = PropertyPaymentMethods::where('propertyid', $propertyid)->first();
        }
        return response()->json([
            'status' => 'success',
            'updatedPricing' => $new_pricing,
            'updatedPayment' => $new_payment
        ]);
    }

    public function getAllUnitById(Request $request)
    {
        $this->enableCors($request);

        // Fetch the units by property ID
        $units = DB::table('unitdetails')->where('propertyid', $request->input('propertyid'))->get();
        $unit_details = [];

        foreach ($units as $unit) {
            $unitid = $unit->unitid;

            // Fetch unit pricing
            $unitpricing = DB::table('property_pricing')
                ->select('min_price')
                ->where('proppricingid', $unit->proppricingid)
                ->first();

            // Fetch unit rooms
            $unitrooms = DB::table('unitrooms')
                ->select('unitroomid', 'roomname', 'quantity')
                ->where('unitid', $unitid)
                ->get();

            // Fetch bedroom type for each room
            $bedrooms = DB::table('bedroomtype')
                ->select('bedroomid', 'unitroomid', 'bedroomnum', 'singlebed', 'bunkbed', 'largebed', 'superlargebed')
                ->whereIn('unitroomid', $unitrooms->pluck('unitroomid'))
                ->get();

            // Group bedroom details by unitroomid
            $bedrooms_by_room = $bedrooms->groupBy('unitroomid')->map(function ($bedroomList) {
                return $bedroomList->map(function ($bedroom) {
                    return [
                        'bedroomid' => $bedroom->bedroomid,
                        'bedroomnum' => $bedroom->bedroomnum,
                        'beds' => [
                            'singlebed' => $bedroom->singlebed,
                            'bunkbed' => $bedroom->bunkbed,
                            'largebed' => $bedroom->largebed,
                            'superlargebed' => $bedroom->superlargebed,
                        ]
                    ];
                });
            });

            // Fetch unit amenities
            $unit_amenities = DB::table('amenity')
                ->select('amenityid', 'amenity_name')
                ->where('unitid', $unitid)
                ->get();

            // Fetch unit services
            $unit_services = DB::table('services')
                ->select('serviceid', 'service_name')
                ->where('unitid', $unitid)
                ->get();

            // Fetch unit images
            $property_files = File::select('file_url as src', 'caption')
                ->where('propertyid', $request->input('propertyid'))
                ->where('unitid', $unitid)
                ->get();

            // Structure unit details
            $unit_details[] = [
                'unitid' => $unitid,
                'unitname' => $unit->unitname,
                'guest_capacity' => $unit->guest_capacity,
                'unitrooms' => $unitrooms,
                'unitbeds' => $bedrooms_by_room,
                'unitpricing' => $unitpricing,
                'amenities' => $unit_amenities,
                'services' => $unit_services,
                'images' => $property_files
            ];
        }

        return response()->json([
            "property_unitdetails" => $unit_details
        ]);
    }

    public function getAllPropertiesCoord(Request $request)
    {
        $this->enableCors($request);

        // Retrieve all house rules and booking policies
        $property_hr = DB::table('house_rules')->get();
        $property_bp = DB::table('booking_policy')->get();

        // Retrieve properties
        $properties = Property::select('propertyid', 'property_name', 'property_desc', 'property_type', 'unit_type')
            ->where('isActive', 1)
            ->get();

        // Retrieve unit details
        $unitDetails = UnitDetails::select('unitid', 'guest_capacity', 'propertyid')->get();

        // Retrieve unit rooms
        $unitRooms = UnitRooms::select('unitid', 'unitroomid', 'roomname', 'quantity')->get();

        // Retrieve bedroom types
        $bedroomTypes = BedroomType::select('unitroomid', 'singlebed', 'bunkbed', 'largebed', 'superlargebed')->get();

        // Retrieve property locations (addresses)
        $locations = Location::select('propertyid', 'address', 'zipcode', 'latitude', 'longitude')->get();

        // Create associative arrays for unit details and unit rooms
        $unitDetailsByPropertyId = [];
        foreach ($unitDetails as $unitDetail) {
            $unitDetailsByPropertyId[$unitDetail->propertyid][] = $unitDetail;
        }

        $unitRoomsByUnitId = [];
        foreach ($unitRooms as $unitRoom) {
            $unitRoomsByUnitId[$unitRoom->unitid][] = $unitRoom;
        }

        // Create associative arrays for house rules and booking policies
        $houseRulesByPropertyId = [];
        foreach ($property_hr as $rule) {
            $houseRulesByPropertyId[$rule->propertyid][] = $rule;
        }

        $bookingPoliciesByPropertyId = [];
        foreach ($property_bp as $policy) {
            $bookingPoliciesByPropertyId[$policy->propertyid][] = $policy;
        }

        // Create associative array for locations
        $locationsByPropertyId = [];
        foreach ($locations as $location) {
            $locationsByPropertyId[$location->propertyid] = $location;
        }

        // Prepare final properties array
        $finalProperties = [];
        foreach ($properties as $property) {
            $propertyId = $property->propertyid;

            // Create a new property structure
            $newProperty = [
                'name' => $property->property_name,
                'coordinates' => [
                    $locationsByPropertyId[$propertyId]->latitude ?? null,
                    $locationsByPropertyId[$propertyId]->longitude ?? null,
                ],
                'category' => 'Property',  // or use the property type
                'iconUrl' => './property-icon.png',  // Update with actual icon URL if needed
                'imageUrl' => './property-image.jpg',  // Update with actual image URL if needed
                'description' => $property->property_desc,
                'description2' => '',  // Add additional description if needed
                'cityName' => 'Cebu',  // Update with actual city name if available
                'propertyType' => $property->property_type,
                'unitType' => $property->unit_type,
                'guestCapacity' => $unitDetailsByPropertyId[$propertyId][0]->guest_capacity ?? null,
                'bedroomCount' => 0,
                'bathroomCount' => 0,
                'houseRules' => $houseRulesByPropertyId[$propertyId] ?? [],
                'bookingPolicies' => $bookingPoliciesByPropertyId[$propertyId] ?? [],
                'address' => $locationsByPropertyId[$propertyId]->address ?? null,
                'zipCode' => $locationsByPropertyId[$propertyId]->zipcode ?? null,
                'bedCount' => 0,
                'createdAt' => now(),  // or set the actual created timestamp
                'updatedAt' => now()   // or set the actual updated timestamp
            ];

            // Calculate bedroom and bathroom counts
            if (isset($unitDetailsByPropertyId[$propertyId])) {
                foreach ($unitDetailsByPropertyId[$propertyId] as $unitDetail) {
                    if (isset($unitRoomsByUnitId[$unitDetail->unitid])) {
                        foreach ($unitRoomsByUnitId[$unitDetail->unitid] as $unitRoom) {
                            if ($unitRoom->roomname === 'Bedroom') {
                                $newProperty['bedroomCount'] += $unitRoom->quantity;
                            } elseif ($unitRoom->roomname === 'Bathroom') {
                                $newProperty['bathroomCount'] += $unitRoom->quantity;
                            }
                        }
                    }
                }
            }

            // Calculate bed count
            if (isset($unitDetailsByPropertyId[$propertyId])) {
                foreach ($unitDetailsByPropertyId[$propertyId] as $unitDetail) {
                    if (isset($unitRoomsByUnitId[$unitDetail->unitid])) {
                        foreach ($unitRoomsByUnitId[$unitDetail->unitid] as $unitRoom) {
                            if ($unitRoom->roomname == 'Bedroom') {
                                foreach ($bedroomTypes as $bedroomType) {
                                    if ($bedroomType->unitroomid == $unitRoom->unitroomid) {
                                        $newProperty['bedCount'] += $bedroomType->singlebed + $bedroomType->bunkbed + $bedroomType->largebed + $bedroomType->superlargebed;
                                    }
                                }
                            }
                        }
                    }
                }
            }

            $finalProperties[] = $newProperty;
        }

        return response()->json($finalProperties);
    }
}
