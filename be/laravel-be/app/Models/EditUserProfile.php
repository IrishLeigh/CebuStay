<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EditUserProfile extends Model
{
    protected $table = 'additional_info';

    protected $fillable = [
        'cellphone_number',
        'e_wallet_account',
        'payment_method_type',
        'mastercard_number',
        'mastercard_expiration_month',
        'mastercard_expiration_year',
    ];
}
