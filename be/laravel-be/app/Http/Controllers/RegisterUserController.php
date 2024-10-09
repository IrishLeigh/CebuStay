<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;

use Illuminate\Support\Facades\Hash;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use Carbon\Carbon;

class RegisterUserController extends CORS
{

    private function generateVerificationCode()
    {
        $characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $code = '';
        for ($i = 0; $i < 6; $i++) {
            $code .= $characters[rand(0, strlen($characters) - 1)];
        }
        return $code;
    }

    public function sendEmail($firstname, $lastname, $email, $verify_token)
    {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        //Enable SMTP authentication
        $mail->Host = 'smtp.gmail.com';                     //Set the SMTP server to send through                                 
        $mail->Username = 'cebustay2024@gmail.com';                     //SMTP username
        $mail->Password = 'ncef xiex ercb ptuu';

        $mail->SMTPSecure = 'tls';            //Enable implicit TLS encryption
        $mail->Port = 587;

        $mail->setFrom('cebustay@gmail.com', "CebuStay");
        $mail->addAddress($email);     //Add a recipient

        $mail->isHTML(true);                                  //Set email format to HTML
        $mail->Subject = 'Email Verification from CebuStay';

        $email_template = "
        <!DOCTYPE html>
        <html lang='en'>
        <head>
            <meta charset='UTF-8'>
            <meta name='viewport' content='width=device-width, initial-scale=1.0'>
            <title>Account Registration Code</title>
            <style>
                body {
                    font-family: 'Poppins', sans-serif;
                    background-color: #f9f9f9;
                    color: #333;
                    margin: 0;
                    padding: 0;
                }
                .email-container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #ffffff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
                }
                h3 {
                    color: #007BFF;
                    margin-bottom: 15px;
                }
                h4 {
                    color: #333;
                    margin-bottom: 10px;
                }
                .verification-code {
                    font-size: 18px;
                    color: #ffffff;
                    background-color: #28a745;
                    padding: 10px 20px;
                    border-radius: 5px;
                    display: inline-block;
                    margin-top: 10px;
                }
                .email-footer {
                    margin-top: 20px;
                    font-size: 12px;
                    color: #888;
                    text-align: center;
                }
            </style>
        </head>
        <body>
            <div class='email-container'>
                <h3>Hi $firstname $lastname,</h3>
                <h4>Welcome! Your account registration is almost complete.</h4>
                <p>Please use the code below to complete your registration:</p>
                <div class='verification-code'>$verify_token</div>
                <div class='email-footer'>
                    <p>&copy; " . date('Y') . " CebuStay. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
        ";


        $mail->Body = $email_template;
        try {
            $mail->send();
            return 1; // Email sent successfully

        } catch (Exception $e) {
            return 0; // Error occurred while sending email
        }
    }
    public function resendEmailCode(Request $request)
    {
        $email = $request->input('email');
        $user = UserModel::where('email', $email)->first();
        $verify_token = $this->generateVerificationCode();
        $user->verificationtoken = $verify_token;
        $tokenExpiration = Carbon::now()->addMinutes(5);
        $user->verification_token_expires_at = $tokenExpiration;
        $this->sendEmail($user->firstname, $user->lastname, $user->email, $verify_token);
        $user->save();
        return response()->json(['message' => 'Verification Code Resent.', 'status' => 'success']);
    }
    public function register(Request $request)
    {
        $this->enableCors($request);
        // Check if email already exists
        $existingUser = UserModel::where('email', $request->input('email'))->first();

        if ($existingUser) {
            // If the existing email is already verified, return an error
            if ($existingUser->isverified == 1) {
                return response()->json(['message' => 'Email already in use.', 'status' => 'error']);
            }
            // If the existing email is not verified, update the existing user and resend verification email
            else {
                $existingUser->firstname = $request->input('firstname');
                $existingUser->lastname = $request->input('lastname');
                $existingUser->password = $request->input('password');
                $verify_token = $this->generateVerificationCode();
                $existingUser->verificationtoken = $verify_token;

                // Set token expiration time (e.g., 24 hours from now)
                $tokenExpiration = Carbon::now()->addMinutes(5);
                $existingUser->verification_token_expires_at = $tokenExpiration;

                $this->sendEmail($existingUser->firstname, $existingUser->lastname, $existingUser->email, $verify_token);
                $existingUser->save();

                return response()->json(['message' => 'Verification email resent.', 'status' => 'success']);
            }
        }

        // If email doesn't exist, proceed with creating fresh user
        $user = new UserModel();
        $user->firstname = $request->input('firstname');
        $user->lastname = $request->input('lastname');
        $user->email = $request->input('email');
        $user->password = Hash::make($request->input('password'));
        $verify_token = $this->generateVerificationCode();
        $user->verificationtoken = $verify_token;

        // Set token expiration time (e.g., 24 hours from now)
        $tokenExpiration = Carbon::now()->addMinutes(5);
        $user->verification_token_expires_at = $tokenExpiration;

        $this->sendEmail($user->firstname, $user->lastname, $user->email, $verify_token);
        $user->save();

        return response()->json(['message' => 'Account Created, Please verify your email with the code sent.', 'status' => 'success']);
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
            return response()->json(['message' => 'Verification token expired.', 'status' => 'error']);
        }

        if ($user->isverified == 1) {
            return response()->json(['message' => 'Email already used.', 'status' => 'error']);
        }

        // Mark the email as verified
        $user->isverified = 1;
        $user->save();

        return response()->json(['message' => 'Verification code is correct.', 'status' => 'success']);
    }

}
