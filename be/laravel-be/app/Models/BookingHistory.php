<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BookingHistory extends Model
{
    protected $table = "tbl_bookinghistory";

    protected $primaryKey = "bhid";

    protected $fillable = [
        'bhid',
        'userid',
        'propertyid',
        'unitid',
        'bookerid',
        'guestid',
        'pid',
        'stay_length',
        'guest_count',
        'checkin_date',
        'checkout_date',
        'total_price',
        'special_request',
        'arrival_time',
        'status',
        'type',
        'check_type',
        'booking_date'
    ];
}
