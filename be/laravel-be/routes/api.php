<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EditUserProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\UserForgotPassController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\FacilitiesController;
use App\Http\Controllers\HouseRuleController;
use App\Http\Controllers\LocationController;


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

// Routes for amenity
Route::post('/amenities', 'App\Http\Controllers\AmenityController@create');

// Routes for service
Route::post('/services', 'App\Http\Controllers\ServiceController@create');

// Routes for facilities
Route::post('/facilities', 'App\Http\Controllers\FacilitiesController@create');

// Routes for house rule
Route::post('/houseRules', 'App\Http\Controllers\HouseruleController@create');

// Routes for location
// Route::post('/location', [LocationController::class, 'create']);
Route::post('/location', 'App\Http\Controllers\LocationController@create');

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

//Routes for unitdetails
Route::post('/unitdetails', 'App\Http\Controllers\UnitDetailsController@insertUnitDetails');
Route::post('/bedroomtype', 'App\Http\Controllers\UnitDetailsController@insertBedTypes');

//UPLOAD IMG
//UPLOAD ONE IMAGE
Route::post('/uploadimage', 'App\Http\Controllers\FileController@store');
//UPLOAD MULTIPLE IMAGES
Route::post('/uploadfiles', 'App\Http\Controllers\FileController@uploadFiles');

Route::get('/getfiles/{projectid}', 'App\Http\Controllers\FileController@getImgByProperty');