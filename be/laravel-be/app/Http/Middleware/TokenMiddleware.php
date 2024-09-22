<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Models\UserModel as User;
class TokenMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('Authorization');

        if (!$token) {
            return response()->json(['error' => 'Token not provided'], 401);
        }

        $user = User::where('token', $token)->first(); // Adjust to match your column

        if (!$user) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        return $next($request);
    }


}
