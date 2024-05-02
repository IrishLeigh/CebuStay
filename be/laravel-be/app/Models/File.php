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
    ];

    use HasFactory;
}
