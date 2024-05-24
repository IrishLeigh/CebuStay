<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class LoginUserController extends CORS
{

    public function login(Request $request)
    {
        $this->enableCors($request);

        $email = $request->input('email');
        $password = $request->input('password');

        $user = UserModel::where('email', $email)->first(); //check if email exists

        if (!$user) {   //if email doesn't exist
            return response()->json(['message' => 'Password incorrect.', 'status' => 'error']);     //return error
        }
        if ($user->password != $password) {   //if password doesn't match
            return response()->json(['message' => 'Password incorrect.', 'status' => 'error']);    //return error
        }
        if ($user->isverified == 1) {
            if ($user->email == $email && $user->password == $password) {
                $userid = $user->userid;
                $key = "6b07a9f92c4960e5348c13f8a5a7b0e96f07a0258358e2690d3b3f3c7c8b2e7f";
                $token = JWT::encode(
                    array(
                        'iat' => time(),
                        'nbf' => time(),
                        'exp' => time() + 86400,
                        'data' => array(
                            'userid' => $userid,
                            'firstname' => $user->firstname,
                            'lastname' => $user->lastname,
                            'email' => $user->email,
                            'password' => $user->password,
                        )
                    ),
                    $key,
                    'HS256'
                );
                return response()->json(['message' => 'Login successful.', 'status' => 'success', 'token' => $token]);
            }
        } else {
            return response()->json(['message' => 'Email not verified.', 'status' => 'error']);
        }
    }

    public function decodeToken(Request $request)
    {
        $this->enableCors($request);
        $token = $request->input('token');
        $key = new Key("6b07a9f92c4960e5348c13f8a5a7b0e96f07a0258358e2690d3b3f3c7c8b2e7f", 'HS256');
        $decoded = JWT::decode($token, $key);
        return response()->json($decoded);
    }
}
