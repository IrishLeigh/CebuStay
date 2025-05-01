<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MonthlyPayment extends Model
{
    protected $table = 'monthly_payment';
    protected $primaryKey = 'mpid';

    protected $fillable = [
        'mpid',
        'userid',
        'bookingid',
        'amount_due',
        'amount_paid',
        'status',
        'due_date',
        'created_at',
        'updated_at',
        'bhid',
    ];
}
