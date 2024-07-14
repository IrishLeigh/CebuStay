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

    public function property()
    {
        return $this->belongsTo(Property::class, 'propertyid', 'propertyid');
    }

    public function booker()
    {
        return $this->belongsTo(Booker::class, 'bookerid', 'bookerid');
    }

    public function guest()
    {
        return $this->belongsTo(Guest::class, 'guestid', 'guestid');
    }

}
