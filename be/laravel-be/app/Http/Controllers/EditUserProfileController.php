<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\EditUserProfile;

class EditUserProfileController extends CORS
{
    /**
     * Update user profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    // UPDATE method User firstname, lastname, email
    public function updateProfile(Request $request)
    {
        $this->enableCors($request);
        $userid = $request->input('userid');
        $user = UserModel::where('userid', $userid)->first();

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        // $user->firstname = $request->input('firstname');
        // $user->lastname = $request->input('lastname');
        // // $user->cellnumber = $request->input('cellnumber');
        // // $user->email = $request->input('email');
        if ($request->has('firstname')) {
            $user->firstname = $request->input('firstname');
        }
        if ($request->has('lastname')) {
            $user->lastname = $request->input('lastname');
        }
        if ($request->has('cellnumber')) {
            $user->cellnumber = $request->input('cellnumber');
        }
        if ($request->has('email')) {
            $user->email = $request->input('email');
        }

        $user->save();

        // return response()->json($user);
        return response()->json([
            'message' => 'Profile updated successfully.',
            'user' => $user,
        ]);
    }

    // POST method for additional info
    public function createAdditionalInfo(Request $request, $userId)
    {
        // Find the user by user ID
        $user = UserModel::find($userId);
    
        // Find the additional info record associated with the user ID
        $additionalInfo = EditUserProfile::where('userid', $userId)->first();
    
        // If additional info record doesn't exist, create a new one
        if (!$additionalInfo) {
            $additionalInfo = new EditUserProfile();
            $additionalInfo->userid = $userId;
        }
    
        // Assign data from the request to the additional info record
        $additionalInfo->cellphone_number = $request->input('cellphone_number', $additionalInfo->cellphone_number);
        $additionalInfo->e_wallet_account = $request->input('e_wallet_account', $additionalInfo->e_wallet_account);
        $additionalInfo->payment_method_type = $request->input('payment_method_type', $additionalInfo->payment_method_type);
        $additionalInfo->mastercard_number = $request->input('mastercard_number', $additionalInfo->mastercard_number);
        $additionalInfo->mastercard_expiration_month = $request->input('mastercard_expiration_month', $additionalInfo->mastercard_expiration_month);
        $additionalInfo->mastercard_expiration_year = $request->input('mastercard_expiration_year', $additionalInfo->mastercard_expiration_year);
    
        // Save the additional info record
        $additionalInfo->save();
    
        // Return the saved additional info record as JSON response
        return response()->json([
            'message' => 'Profile added successfully.',
            'additional_info' => $additionalInfo,
        ]);
    }

    //GET method for additional info
    public function getAdditionalInfoById($additionalInfoId)
    {
        $additionalInfo = EditUserProfile::find($additionalInfoId);

        if (!$additionalInfo) {
            return response()->json(['message' => 'Additional info not found.'], 404);
        }

        // return response()->json($additionalInfo);
        return response()->json([
            'message' => 'Profile successfully retrieved.',
            'additional_info' => $additionalInfo,
        ]);
    }

    // PUT method for additional info
    public function updateAdditionalInfo(Request $request, $additionalInfoId)
    {
        $additionalInfo = EditUserProfile::find($additionalInfoId);

        if (!$additionalInfo) {
            return response()->json(['message' => 'Additional info not found.'], 404);
        }

        $additionalInfo->cellphone_number = $request->input('cellphone_number', $additionalInfo->cellphone_number);
        $additionalInfo->e_wallet_account = $request->input('e_wallet_account', $additionalInfo->e_wallet_account);
        $additionalInfo->payment_method_type = $request->input('payment_method_type', $additionalInfo->payment_method_type);
        $additionalInfo->mastercard_number = $request->input('mastercard_number', $additionalInfo->mastercard_number);
        $additionalInfo->mastercard_expiration_month = $request->input('mastercard_expiration_month', $additionalInfo->mastercard_expiration_month);
        $additionalInfo->mastercard_expiration_year = $request->input('mastercard_expiration_year', $additionalInfo->mastercard_expiration_year);

        $additionalInfo->save();

        // return response()->json($additionalInfo);
        return response()->json([
            'message' => 'Profile updated successfully.',
            'additional_info' => $additionalInfo,
        ]);
    }

}
