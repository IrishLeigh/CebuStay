<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReviewsAndRating extends Model
{
    protected $table = 'reviewsandratings';

    protected $primaryKey = 'rid';

    protected $fillable = ['rid', 'userid', 'propertyid', 'rating', 'review', 'unitname'];

}
