<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\EditUserProfile;

class UserForgotPassController extends Controller
{
    /**
     * Update user profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

     // UPDATE method User forgot password
    public function changePass(Request $request, $email)
    {
        $user = UserModel::where('email', $email)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        $user->password = $request->input('password', $user->password);
    
        $user->save();
        
        return response()->json([
            'message' => 'Password updated successfully.',
            'user' => $user,
        ]);
    }

}
