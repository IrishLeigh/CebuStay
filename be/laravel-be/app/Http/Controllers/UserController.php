<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;

class UserController extends Controller
{
    /**
     * Create a new user.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $students = new userModel();

        $students->firstname = $request->input('firstname');
        $students->lastname = $request->input('lastname');
        $students->email = $request->input('email');
        $students->password = $request->input('password');

        $students->save();
        return response()->json($students);
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
