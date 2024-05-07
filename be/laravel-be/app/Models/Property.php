<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $table = 'property';
    protected $primaryKey = 'propertyid';
    protected $guarded = ['propertyid', 'userid', 'property_name', 'property_type', 'property_desc', 'property_directions', 'unit_type'];
}
