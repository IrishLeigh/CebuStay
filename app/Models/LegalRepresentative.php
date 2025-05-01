<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LegalRepresentative extends Model
{
    use HasFactory;

    protected $table = 'legal_representative';
    protected $primaryKey = 'legalrepresentativeid';

    protected $fillable = [
        'legalrepresentativeid',
        'propertycompanyid',
        'firstname',
        'lastname',
        'email',
        'phone_number',
        'position',
        'date_of_birth',
    ];
    
    // Define relationships if needed
}
