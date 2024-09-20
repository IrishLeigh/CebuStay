<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserFile extends Model
{
    protected $table = 'tbl_userimg';

    protected $primaryKey = 'userimg_id';

    protected $guarded = ['userimg_id', 'userid', 'file_name', 'file_id', 'file_url', 'isavatar'];

    public function user()
    {
        return $this->belongsTo(User::class, 'userid', 'userid');
    }

    use HasFactory;
}
