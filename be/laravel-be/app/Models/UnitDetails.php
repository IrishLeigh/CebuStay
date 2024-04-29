<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitDetails extends Model
{
    protected $table = 'unitdetails';
    protected $primaryKey = 'unitid';
    protected $guarded = ['unitid', 'propertyid', 'guest_capacity'];
}
