<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Facilities extends Model
{
    protected $table = 'facilities';
    protected $primaryKey = 'facilitiesid';

    protected $fillable = [
        'facilitiesid',
        'propertyid',
        'facilities_name',
    ];
}
