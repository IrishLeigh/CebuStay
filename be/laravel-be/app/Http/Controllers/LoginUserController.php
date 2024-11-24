<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Firebase\JWT\ExpiredException;
use Google_Client;

class LoginUserController extends CORS
{

    public function logout(Request $request)
    {
        $this->enableCors($request);
        $userid = $request->input('userid');
        $user = UserModel::where('userid', $userid)->first();
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
        $user->token = null;
        $user->save();
        return response()->json(['message' => 'Logout successful.'], 200);
    }
    public function login(Request $request)
    {
        $this->enableCors($request);

        $email = $request->input('email');
        $password = $request->input('password');

        $user = UserModel::where('email', $email)->first(); // Check if email exists

        if (!$user) { // If email doesn't exist
            return response()->json(['message' => 'Email not found.', 'status' => 'error']);
        }
        if ($user->isverified != 1) {
            return response()->json(['message' => 'Email not verified.', 'status' => 'error']);
        }
        if (!Hash::check($password, $user->password)) { // If password doesn't match
            return response()->json(['message' => 'Password incorrect.', 'status' => 'error']);
        }

        // Generate JWT token for authorization
        $userid = $user->userid;
        $key = "6b07a9f92c4960e5348c13f8a5a7b0e96f07a0258358e2690d3b3f3c7c8b2e7f";
        $jwtToken = JWT::encode(
            [
                'iat' => time(),
                'nbf' => time(),
                'exp' => time() + 86400,
                'data' => [
                    'userid' => $userid,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'role' => $user->accounttype
                ]
            ],
            $key,
            'HS256'
        );

        $user->token = $jwtToken;
        $user->save();

        return response()->json(['message' => 'Login successful.', 'status' => 'success', 'token' => $jwtToken]);
    }


    public function googleLogin(Request $request)
    {
        $this->enableCors($request);

        $email = $request->input('email');
        $firstname = $request->input('firstname');
        $lastname = $request->input('lastname');

        // Check if the user exists by email
        $user = UserModel::where('email', $email)->first();

        if (!$user) {
            // Create a new user
            $randomPassword = bin2hex(random_bytes(8));
            $user = new UserModel();
            $user->email = $email;
            $user->firstname = $firstname;
            $user->lastname = $lastname;
            $user->password = Hash::make($randomPassword);
            $user->isverified = 1;
            $user->save();
        }
        // Generate JWT token
        $userid = $user->userid;
        $key = "6b07a9f92c4960e5348c13f8a5a7b0e96f07a0258358e2690d3b3f3c7c8b2e7f";
        $token = JWT::encode(
            [
                'iat' => time(),
                'nbf' => time(),
                'exp' => time() + 86400,
                'data' => [
                    'userid' => $userid,
                    'firstname' => $user->firstname,
                    'lastname' => $user->lastname,
                    'email' => $user->email,
                    'role' => $user->accounttype
                ]
            ],
            $key,
            'HS256'
        );
        $user->token = $token; // Store the random token in the user's record
        $user->save();
        return response()->json(['message' => 'Login successful.', 'status' => 'success', 'token' => $token]);
    }

    public function decodeToken(Request $request)
    {
        $this->enableCors($request);
        try {
            $token = $request->input('token');
            $key = new Key("6b07a9f92c4960e5348c13f8a5a7b0e96f07a0258358e2690d3b3f3c7c8b2e7f", 'HS256');
            $decoded = JWT::decode($token, $key);
            return response()->json($decoded);
        } catch (ExpiredException $e) {
            return response()->json(['message' => 'Expired token.'], 401);
        }

    }
}
