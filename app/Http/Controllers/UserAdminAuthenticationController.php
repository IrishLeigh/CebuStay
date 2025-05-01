<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\UserAdmin;
use Illuminate\Support\Facades\Hash;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use function Laravel\Prompts\select;
class UserAdminAuthenticationController extends CORS
{
    //
    public function logout(Request $request)
    {
        $this->enableCors($request);
        $useradminid = $request->input('useradminid');
        $userad = UserAdmin::find($useradminid);
        $userad->token = null;
        $userad->save();
        return response()->json(['message' => 'Logout successful.'], 200);
    }
    public function login(Request $request)
    {
        $this->enableCors($request);
        $email = $request->input('username');
        $password = $request->input('password');

        $useradmin = UserAdmin::where('username', $email)->first();

        if (!$useradmin) {
            return response()->json(['message' => 'User not found.', 'status' => 'error']);
        }

        if (!Hash::check($password, $useradmin->password)) {
            return response()->json(['message' => 'Invalid password.', 'status' => 'error']);
        }

        $key = "6b07a9f92c4960e5348c13f8a5a7b0e96f07a0258358e2690d3b3f3c7c8b2e7f";
        $jwtToken = JWT::encode(
            [
                'iat' => time(),
                'nbf' => time(),
                'exp' => time() + 86400,
                'data' => [
                    'userid' => $useradmin->useradminid,
                    'username' => $useradmin->username,
                ],
            ],
            $key,
            'HS256'
        );
        $useradmin->token = $jwtToken;
        $useradmin->save();

        return response()->json(['message' => 'Login successful.', 'token' => $jwtToken, 'status' => 'success'], 200);
    }

    public function sendEmail($username, $password, $email)
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
        $mail->Subject = 'Admin Credentials from CebuStay';

        $email_template = "
            <h2>Good Day Admin,</h3>
            <h3>This is your account details</h4>
            <p><b>Username:</b> $username</p>
            <p><b>Password:</b> $password</p>
            
        ";

        $mail->Body = $email_template;
        try {
            $mail->send();
            return 1; // Email sent successfully

        } catch (Exception $e) {
            return 0; // Error occurred while sending email
        }
    }

    public function createUserAdmin(Request $request)
    {
        $this->enableCors($request);
        $email = $request->input('email');
        $allAdmins = UserAdmin::all();
        $adminCount = $allAdmins->count();
        $adminCount = $adminCount == 0 ? 1 : $adminCount + 1;
        $useradmin = new UserAdmin();
        $useradmin->username = "admin" . $adminCount;
        $password = substr(md5(time()), 0, 8);
        $useradmin->password = Hash::make($password);
        $useradmin->save();
        $this->sendEmail($useradmin->username, $password, $email);
        return response()->json(['message' => 'User created successfully.'], 201);
    }
}
