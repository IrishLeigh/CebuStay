<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingPolicy extends Model
{
    protected $table = 'booking_policy';
    protected $primaryKey = 'bookingpolicyid';
    protected $fillable = [
        'bookingpolicyid',
        'propertyid',
        'isCancellationPolicy',
        'cancellationDays',
        'CancellationCharge',
        'isModificationPolicy',
        'modificationDays',
        'modificationCharge',
    ];
}
