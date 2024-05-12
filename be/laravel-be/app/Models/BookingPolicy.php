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
        'is_cancel_plan',
        'cancel_days',
        'non_refundable',
        'modification_plan',
        'offer_discount'
    ];
}
