<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitDetails extends Model
{
    protected $table = 'unitdetails';
    protected $primaryKey = 'unitid';
    protected $guarded = ['unitid', 'propertyid', 'proppricingid', 'guest_capacity', 'unitname', 'quantity'];

    public function property()
    {
        return $this->belongsTo(Property::class, 'propertyid', 'propertyid');
    }
    public function unitrooms()
    {
        return $this->hasMany(UnitRooms::class, 'unitid', 'unitid');
    }
    public function proppricing()
    {
        return $this->hasOne(PropertyPricing::class, 'proppricingid', 'proppricingid');
    }
    public function bookings()
    {
        return $this->hasMany(Booking::class, 'unitid', 'unitid');
    }
    public function file()
    {
        return $this->hasMany(File::class, 'unitid', 'unitid');
    }
}
