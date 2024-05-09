<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\Property;

class UserController extends Controller
{
    /**
     * Create a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    public function becomeManager(Request $request)
    {
        $userid = $request->input('userid');
        $this->enableCors($request);
        $propertyuserref = Property::where('userid', $userid)->first();
        if (!$propertyuserref) {
            return response()->json(['message' => 'User has not listed a property.', 'status' => 'error']);
        }
        $usermanager = UserModel::find($userid);
        $usermanager->accounttype = 'manager';
        $usermanager->save();
        return response()->json(['message' => 'User updated successfully.', 'status' => 'success']);
    }
}
