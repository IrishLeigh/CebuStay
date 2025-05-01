<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Service;

class ServiceController extends CORS
{
    /**
     * Create a new amenity for a property.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function create(Request $request)
    {
        $this->enableCors($request);
        $service = new Service();
        $unitid = $request->input('unitid');
        if ($unitid != null) {
            $service->unitid = $unitid;
            $service->propertyid = $request->input('propertyid');
            $service->service_name = $request->input('service_name');
            $service->ismulti = true;
        } else {
            $service->propertyid = $request->input('propertyid');
            $service->service_name = $request->input('service_name');
            $service->ismulti = false;
        }

        $service->save();

        return response()->json($service);
    }
}
