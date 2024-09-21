<?php

namespace App\Models;

// use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    protected $table = 'property';
    protected $primaryKey = 'propertyid';
    protected $guarded = [
        'propertyid',
        'userid',
        'property_name',
        'property_type',
        'property_desc',
        'property_directions',
        'unit_type',
        'isActive'
    ];

    public function user()
    {
        return $this->belongsTo(UserModel::class, 'userid', 'userid');
    }
    public function home()
    {
        return $this->hasOne(Home::class, 'propertyid', 'propertyid');
    }

    public function location()
    {
        return $this->hasOne(Location::class, 'propertyid', 'propertyid');
    }

    public function unitdetails()
    {
        return $this->hasMany(UnitDetails::class, 'propertyid', 'propertyid');
    }

    public function propertyfiles()
    {
        return $this->hasMany(File::class, 'propertyid', 'propertyid');
    }

    public function booking()
    {
        return $this->hasMany(Booking::class, 'propertyid', 'propertyid');
    }

    public function userfile()
    {
        return $this->hasOne(UserFile::class, 'propertyid', 'propertyid');
    }
}
