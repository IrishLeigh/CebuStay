<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BedroomType extends Model
{
    protected $table = 'bedroomtype';
    protected $primaryKey = 'bedroomid';
    protected $guarded = ['bedroomid', 'unitroomid', 'bedroomnum', 'singlebed', 'bunkbed', 'largebed', 'superlargebed'];

    public function unitroom()
    {
        return $this->belongsTo(UnitRooms::class, 'unitroomid', 'unitroomid');
    }

}
