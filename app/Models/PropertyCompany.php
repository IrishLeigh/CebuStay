<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyCompany extends Model
{
    use HasFactory;

    protected $table = 'property_company';
    protected $primaryKey = 'propertycompanyid';

    protected $fillable = [
        'propertycompanyid',
        'propertyownershipid',
        'legal_business_name',
        'company_description',
        'company_photo',
        'street',
        'barangay',
        'city',
        'zipcode',
    ];
    
    // Define relationships if needed
}
