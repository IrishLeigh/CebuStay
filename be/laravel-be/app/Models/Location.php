<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    protected $table = 'location';
    protected $primaryKey = 'locationid';

    protected $fillable = [
        'propertyid',
        'country',
        'city',
        'address',
        'zipcode',
        'pinloc',
    ];
}
