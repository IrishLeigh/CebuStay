<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UnitRooms extends Model
{
    protected $table = 'unitrooms';
    protected $primaryKey = 'unitroomid';
    protected $fillable = ['unitroomid', 'unitid', 'roomname', 'quantity'];
}
