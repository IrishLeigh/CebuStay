<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\Request;

class PropertyController extends Controller
{
    public function InsertPropertyInfo(Request $request)
    {
        $this->enableCors($request);
        $property = new Property();

    }
}
