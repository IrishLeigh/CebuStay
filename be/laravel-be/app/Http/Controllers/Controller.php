<?php

namespace App\Http\Controllers;

abstract class Controller
{
    public function enableCors($request)
    {
        $response = response()->json([], 200);
        $response->header('Access-Control-Allow-Origin', '*');
        $response->header('Access-Control-Allow-Credentials', 'true');

        // Access-Control headers are received during OPTIONS requests
        if ($request->isMethod('options')) {
            $response->header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

            if ($request->header('Access-Control-Request-Headers')) {
                $response->header('Access-Control-Allow-Headers', $request->header('Access-Control-Request-Headers'));
            }
            return $response;
        }
    }
}
