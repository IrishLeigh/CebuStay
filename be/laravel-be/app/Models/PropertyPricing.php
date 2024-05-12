<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyPricing extends Model
{
    protected $table = 'property_pricing';

    protected $primaryKey = 'proppricingid';

    protected $fillable = ['proppricingid', 'max_price', 'min_price', 'profit'];
}
