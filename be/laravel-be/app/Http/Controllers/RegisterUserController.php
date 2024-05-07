<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserModel;

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

use Carbon\Carbon;

class RegisterUserController extends Controller
{

    public function sendEmail($firstname, $lastname, $email, $verify_token)
    {
        $mail = new PHPMailer(true);
        $mail->isSMTP();
        $mail->SMTPAuth = true;
        //Enable SMTP authentication
        $mail->Host = 'smtp.gmail.com';                     //Set the SMTP server to send through                                 
        $mail->Username = 'misternonoy11@gmail.com';                     //SMTP username
        $mail->Password = 'tkuz tiec nnxt zuqj';

        $mail->SMTPSecure = 'tls';            //Enable implicit TLS encryption
        $mail->Port = 587;

        $mail->setFrom('misternonoy11@email.com', $firstname);
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
            // echo "na send";
            return 1; // Email sent successfully

        } catch (Exception $e) {
            // echo "wala na send";
            return 0; // Error occurred while sending email
        }
    }
    public function resendEmailCode(Request $request)
    {
        $email = $request->input('email');
        $user = UserModel::where('email', $email)->first();
        $verify_token = md5(rand());
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
                $verify_token = md5(rand());
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
        $user->password = $request->input('password');
        $verify_token = md5(rand());
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

        return response()->json(['message' => 'Email verified successfully.', 'status' => 'success']);
    }

}
