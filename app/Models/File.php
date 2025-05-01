<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class File extends Model
{
    protected $table = 'propertyfiles';
    protected $primaryKey = 'id';
    protected $guarded = [
        'file_name',
        'id',
        'file_id',
        'propertyid',
        'caption',
        'unitid',
        'file_url',
        'iscover',
    ];

    public function property()
    {
        return $this->belongsTo(Property::class, 'propertyid', 'propertyid');
    }

    public function unit()
    {
        return $this->belongsTo(UnitDetails::class, 'unitid', 'unitid');
    }

    use HasFactory;
}
