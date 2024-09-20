<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{

    protected $table = 'tbl_payment';

    protected $primaryKey = 'pid';

       protected $fillable = [
        'pid',
        'bookingid',
        'amount',
        'description',
        'status',
    ];

 
}
