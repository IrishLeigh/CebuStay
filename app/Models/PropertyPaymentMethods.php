<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyPaymentMethods extends Model
{
    protected $table = "payment_methods";
    protected $primaryKey = "paymentmethodid";

    protected $fillable = [
        'propertyid',
        'isonline',
        'paymentmethod',
    ];
}
