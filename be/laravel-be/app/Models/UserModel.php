<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserModel extends Model
{

    protected $table = 'users';
    protected $primaryKey = 'userid';
    protected $guarded = ['userid', 'firstname', 'lastname', 'email', 'password', 'cellnumber', 'verificationtoken', 'accounttype'];
}
