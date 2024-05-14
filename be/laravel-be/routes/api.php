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

// Routes for propertyowner
Route::post('/propertyowner', 'App\Http\Controllers\PropertyOwnerController@create');

// Routes for propertyownership
Route::post('/propertyownership', 'App\Http\Controllers\PropertyOwnershipController@create');

// Routes for amenity
Route::post('/amenities', 'App\Http\Controllers\AmenityController@create');
Route::get('/getamenities', 'App\Http\Controllers\AmenityController@getAmenities');
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
// Route::get('/forgotPass', [UserForgotPassController::class, 'changePass']);
Route::post('/forgotPass', 'App\Http\Controllers\UserForgotPassController@resendEmailCode');
Route::put('/changepass', 'App\Http\Controllers\UserForgotPassController@changePass');


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
Route::get('/allproperties', 'App\Http\Controllers\PropertyController@getAllProperties');

//Routes for unitdetails
Route::post('/unitdetails', 'App\Http\Controllers\UnitDetailsController@insertUnitDetails');
Route::post('/bedroomtype', 'App\Http\Controllers\UnitDetailsController@insertBedTypes');

//Route for Inserting Booking Policy
Route::post('/bookingpolicy', 'App\Http\Controllers\BookingPolicyController@InsertBookingPolicyInfo');
//Route for Inserting Property Pricing
Route::post('/propertypricing', 'App\Http\Controllers\PropertyPricingController@insertPropertyPricing');
//Route for Inserting Property Payment Methods
Route::post('/propertypaymentmethod', 'App\Http\Controllers\PropertyPaymentMethodsController@insertPropertyPaymentMethods');

//UPLOAD IMG
//UPLOAD ONE IMAGE
Route::post('/uploadimage', 'App\Http\Controllers\FileController@store');
//UPLOAD MULTIPLE IMAGES
Route::post('/uploadfiles', 'App\Http\Controllers\FileController@uploadFiles');
//GET IMAGES
Route::get('/getfiles/{projectid}', 'App\Http\Controllers\FileController@getImgByProperty');
Route::get('/getallfirstimg', 'App\Http\Controllers\FileController@getAllFirstImg');
//User 
Route::post('/becomeManager', 'App\Http\Controllers\UserController@becomeManager');