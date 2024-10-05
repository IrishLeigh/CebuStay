<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserAdmin extends Model
{
    protected $table = 'useradmin';

    protected $primaryKey = 'useradminid';

    protected $guarded = ['useradminid', 'username', 'password', 'token'];
}
