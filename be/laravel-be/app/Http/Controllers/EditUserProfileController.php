<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\EditUserProfile;

class EditUserProfileController extends Controller
{
    /**
     * Update user profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

     // UPDATE method User firstname, lastname, email
    public function updateProfile(Request $request, $userId)
    {
        $user = UserModel::find($userId);

        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        $user->firstname = $request->input('firstname', $user->firstname);
        $user->lastname = $request->input('lastname', $user->lastname);
        $user->email = $request->input('email', $user->email);
    
        $user->save();
        
        return response()->json($user);
    }

    // POST method for additional info
    public function createAdditionalInfo(Request $request)
    {
        $additionalInfo = new EditUserProfile();

        $additionalInfo->cellphone_number = $request->input('cellphone_number');
        $additionalInfo->e_wallet_account = $request->input('e_wallet_account');
        $additionalInfo->payment_method_type = $request->input('payment_method_type');
        $additionalInfo->mastercard_number = $request->input('mastercard_number');
        $additionalInfo->mastercard_expiration_month = $request->input('mastercard_expiration_month');
        $additionalInfo->mastercard_expiration_year = $request->input('mastercard_expiration_year');

        $additionalInfo->save();
        return response()->json($additionalInfo);
    }

    //GET method for additional info
    public function getAdditionalInfoById($additionalInfoId)
    {
        $additionalInfo = EditUserProfile::find($additionalInfoId);

        if (!$additionalInfo) {
            return response()->json(['message' => 'Additional info not found.'], 404);
        }

        return response()->json($additionalInfo);
    }

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
        
        return response()->json($additionalInfo);
    }

}
