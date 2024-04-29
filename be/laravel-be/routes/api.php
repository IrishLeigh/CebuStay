<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EditUserProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserForgotPassController;

// Route::post('/users', 'App\Http\Controllers\UserController@create');
Route::post('/users', [UserController::class, 'create']);
Route::get('/getusers/{userId}', [UserController::class, 'getUserById']);


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
//Routes for register user
Route::post('/registeruser', 'App\Http\Controllers\RegisterUserController@register');
Route::post('/verifytoken', 'App\Http\Controllers\RegisterUserController@verifyToken');
Route::post('/resendemail', 'App\Http\Controllers\RegisterUserController@resendEmailCode');


// Route for updating password based on email
Route::put('/forgotPass/{email}', [UserForgotPassController::class, 'changePass']);

// Routes for additional info
Route::post('/additionalInfo/{userId}', [EditUserProfileController::class, 'createAdditionalInfo']);
Route::get('/additionalInfo/{additionalInfoId}', [EditUserProfileController::class, 'getAdditionalInfoById']);
Route::put('/additionalInfo/{additionalInfoId}', [EditUserProfileController::class, 'updateAdditionalInfo']);
Route::put('/updateProfile/{userid}', [EditUserProfileController::class, 'updateProfile']);

//Routes for login
Route::post('/login', 'App\Http\Controllers\LoginUserController@login');
Route::post('/decodetoken', 'App\Http\Controllers\LoginUserController@decodeToken');

//Routes for property
Route::post('/propertyinfo', 'App\Http\Controllers\PropertyController@InsertPropertyInfo');