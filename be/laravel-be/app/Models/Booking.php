<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $table = "tbl_booking";

    protected $primaryKey = "bookingid";

    protected $fillable = [
        'bookingid',
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
        'booking_date'
    ];

    public function property()
    {
        return $this->belongsTo(Property::class, 'propertyid', 'propertyid');
    }

    public function unit()
    {
        return $this->belongsTo(UnitDetails::class, 'unitid', 'unitid');
    }

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'userid', 'userid');
    }

    public function booker()
    {
        return $this->hasOne(Booker::class, 'bookerid', 'userid');
    }

    public function guest()
    {
        return $this->hasOne(Guest::class, 'guestid', 'userid');
    }


}
