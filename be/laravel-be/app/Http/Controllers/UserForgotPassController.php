<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;
use App\Models\EditUserProfile;
use App\Http\Controllers\RegisterUserController;
use Illuminate\Support\Facades\Hash;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use Carbon\Carbon;


class UserForgotPassController extends CORS
{
    /**
     * Update user profile.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */

    // UPDATE method User forgot password
    // public function changePass(Request $request)
    // {
    //     $this->enableCors($request);
    //     $email = $request->input('email');
    //     $user = UserModel::where('email', $email)->first();

    //     if (!$user) {
    //         return response()->json(['message' => 'User not found.'], 404);
    //     }
    //     $user->password = Hash::make($request->input('password'));
    //     $user->save();

    //     return response()->json([
    //         'message' => 'Password updated successfully.',
    //         'user' => $user,
    //     ]);

    // }

    public function changePass(Request $request)
    {
        $this->enableCors($request);
    
        // Retrieve input data
        $email = $request->input('email');
        $plainPassword = $request->input('password');
    
        // Debugging: Log received data
        \Log::info('Email: ' . $email);
        \Log::info('Received password: ' . $plainPassword);
    
        // Check if user exists
        $user = UserModel::where('email', $email)->first();
    
        if (!$user) {
            return response()->json(['message' => 'User not found.'], 404);
        }
    
        // Hash the password
        $hashedPassword = Hash::make($plainPassword);
    
        // Update the user password
        $user->password = $hashedPassword;
        $user->save();
    
        // Return response (avoid including plain password in production)
        return response()->json([
            'message' => 'Password updated successfully.',
            'user' => $user,
            'plain_password' => $plainPassword, // For debugging purposes
            'hashed_password' => $hashedPassword
        ]);
    }
    

    public function sendEmail($firstname, $lastname, $email, $verify_token)
    {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        //Enable SMTP authentication
        $mail->Host = 'smtp.gmail.com';                     //Set the SMTP server to send through                                 
        $mail->Username = 'misternonoy11@gmail.com';                     //SMTP username
        $mail->Password = 'zwnx vmxk vghl igzt';

        $mail->SMTPSecure = 'tls';            //Enable implicit TLS encryption
        $mail->Port = 587;

        $mail->setFrom('cebustay@gmail.com', "CebuStay");
        $mail->addAddress($email);     //Add a recipient

        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'Email Verification from CebuStay';

        $email_template = "
            <h3>Hi $firstname $lastname,</h3>
            <h4>This is your registration code</h4>
            <h5>verification code: $verify_token</h5>
        ";

        $mail->Body = $email_template;
        try {
            $mail->send();
            return 1; // Email sent successfully

        } catch (Exception $e) {
            return 0; // Error occurred while sending email
        }
    }

    private function generateVerificationCode()
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $code;
    }
    public function resendEmailCode(Request $request)
    {
        $this->enableCors($request);
        $email = $request->input('email');
        $user = UserModel::where('email', $email)->first();
        if ($user->isverified === 1) {
            $verify_token = $this->generateVerificationCode();
            $user->verificationtoken = $verify_token;
            $tokenExpiration = Carbon::now()->addMinutes(5);
            $user->verification_token_expires_at = $tokenExpiration;
            $this->sendEmail($user->firstname, $user->lastname, $user->email, $verify_token);
            $user->save();
            return response()->json(['message' => 'Verification Code Resent.', 'status' => 'success']);
        } else {
            return response()->json(['message' => 'Failed to send email.', 'status' => 'error']);
        }

    }

    public function verifyToken(Request $request)
    {
        $this->enableCors($request);

        $verificationToken = $request->input('token');
        $email = $request->input('email');

        // Find the user by verification token and email
        $user = UserModel::where('verificationtoken', $verificationToken)
            ->where('email', $email)
            ->first();

        if (!$user) {
            return response()->json(['message' => 'Incorrect code', 'status' => 'error']);
        }

        // Check if token is expired
        $tokenExpiration = $user->verification_token_expires_at;
        if ($tokenExpiration && Carbon::now()->gt($tokenExpiration)) {
            return response()->json(['message' => 'Verification token expired.', 'status' => 'expired']);
        }

        // Mark the email as verified
        $user->isverified = 1;
        $user->save();

        return response()->json(['message' => 'Email verified successfully.', 'status' => 'success']);
    }


}
