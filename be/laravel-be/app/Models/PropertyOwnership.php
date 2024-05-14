<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyOwnership extends Model
{
    protected $table = 'property_ownership';
    protected $primaryKey = 'propertyownershipid';

    protected $fillable = [
        'propertyownershipid',
        'propertyid',
        'ownershiptype',
    ];
}
