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
}
