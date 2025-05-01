<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payout extends Model
{
    protected $table = 'tbl_payout';

    protected $primaryKey = 'payout_id';

    protected $guarded = [
        'payout_id',
        'userid',
        'propertyid',
        'pid',
        'payout_date',
        'status',
        'batch_id',
        'item_id',
    ];
}
