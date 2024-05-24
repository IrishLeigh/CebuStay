<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\Property;
use App\Models\Location;
use App\Models\PropertyPaymentMethods;
use App\Models\BookingPolicy;

class UserController extends CORS
{
    /**
     * Create a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function becomeManager(Request $request)
    {

        $this->enableCors($request);
        $user = UserModel::find($request->input('userid'));

        $user->accounttype = 'manager';

        $user->save();
        return response()->json($user);
    }

    public function getUserById($userId)
    {
        $user = UserModel::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        return response()->json($user);
    }

    public function update(Request $request, $userId)
    {
        $user = UserModel::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $user->firstname = $request->input('firstname', $user->firstname);
        $user->lastname = $request->input('lastname', $user->lastname);
        $user->email = $request->input('email', $user->email);
        $user->password = $request->input('password', $user->password);

        $user->save();

        return response()->json($user);
    }

    public function getAllPropertyByUser(Request $request)
    {
        $this->enableCors($request);

        $userid = $request->input('userid');
        $user = UserModel::find($userid);

        if ($user->accounttype != 'manager') {
            return response()->json(['message' => 'Unauthorized.', 'status' => 'error']);
        }

        $properties = Property::select('propertyid', 'property_name', 'property_type')->where('userid', $userid)->get();

        $userProperties = [];

        foreach ($properties as $property) {
            $location = Location::select('address')->where('propertyid', $property->propertyid)->first();
            $paymethod = PropertyPaymentMethods::select('paymentmethod')->where('propertyid', $property->propertyid)->first();
            $cancel_policy = BookingPolicy::select('is_cancel_plan')->where('propertyid', $property->propertyid)->first();
            $userProperties[] = [
                'propertyid' => $property->propertyid,
                'property_name' => $property->property_name,
                'property_type' => $property->property_type,
                'address' => $location ? $location->address : 'No address',
                'paymentmethod' => $paymethod ? $paymethod->paymentmethod : 'No payment method',
                'is_cancel_plan' => $cancel_policy ? $cancel_policy->is_cancel_plan : false
            ];
        }

        return response()->json(['message' => 'Success', 'status' => 'success', 'userproperties' => $userProperties]);
    }


}
