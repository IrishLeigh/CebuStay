<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    protected $table = 'amenity';
    protected $primaryKey = 'amenityid';

    protected $fillable = [
        'propertyid',
        'amenity_name',
    ];
}
