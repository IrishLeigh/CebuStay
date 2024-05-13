<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyOwner extends Model
{
    protected $table = 'property_owner';
    protected $primaryKey = 'propertyownerid';

    protected $fillable = [
        'propertyownerid',
        'propertyownershipid',
        'firstname',
        'lastname',
        'displayname',
        'dateofbirth',
        'contactnumber',
        'email',
        'country_region',
        'province',
        'city',
        'primary_address',
        'zipcode',
        'describe',
        'calendar',
    ];
}
