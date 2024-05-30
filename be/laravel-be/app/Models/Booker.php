<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Booker extends Model
{
    protected $table = 'tbl_booker';

    protected $primaryKey = 'bookerid';

    protected $fillable = [
        'bookerid',
        'firstname',
        'lastname',
        'email',
        'country',
        'countrycode',
        'phonenum',
        'is_my_book',
    ];

    public function booking()
    {
        return $this->belongsTo(Booking::class, 'bookerid', 'bookerid');
    }

    public function bookinghistory()
    {
        return $this->hasMany(BookingHistory::class, 'bookerid', 'bookerid');
    }

}
