<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    protected $table = 'tbl_guest';

    protected $primaryKey = 'guestid';

    protected $fillable = [
        'guestid',
        'guestname',
        'guestemail',
    ];

    public function booking()
    {
        return $this->hasOne(Booking::class, 'guestid', 'guestid');
    }

    public function bookinghistory()
    {
        return $this->hasOne(BookingHistory::class, 'guestid', 'guestid');
    }
}
