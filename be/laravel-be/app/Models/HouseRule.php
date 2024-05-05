<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HouseRule extends Model
{
    use HasFactory;

    protected $table = 'house_rules'; // Table name
    protected $primaryKey = 'houserulesid'; // Primary key field

    protected $fillable = [
        'houserulesid',
        'propertyid',
        'smoking_allowed',
        'pets_allowed',
        'parties_events_allowed',
        'noise_restrictions',
        'quiet_hours_start',
        'quiet_hours_end',
        'custom_rules',
        'check_in_from',
        'check_in_until',
        'check_out_from',
        'check_out_until',
    ];

}
