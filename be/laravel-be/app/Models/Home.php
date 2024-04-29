<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Home extends Model
{
    protected $table = 'home';
    protected $primaryKey = 'homeid';
    protected $guarded = ['homeid', 'propertyid', 'unit_type', 'total_unit'];
}
