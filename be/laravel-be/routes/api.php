<?php

use App\Http\Middleware\TokenMiddleware;

use App\Http\Controllers\FileController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\EditUserProfileController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PropertyController;
use App\Http\Controllers\UserForgotPassController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\FacilitiesController;
use App\Http\Controllers\HouseRuleController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\CheckoutSessionController;
use App\Http\Controllers\UnitDetailsController;
use App\Http\Controllers\WebhookController;
use App\Http\Controllers\LegalRepresentativeController;
use App\Http\Controllers\LoginUserController;
use App\Http\Controllers\PropertyCompanyController;
use App\Http\Controllers\PropertyOwnerController;

// Route::post('/checkout-sessions', [CheckoutSessionController::class, 'create']);
Route::post('/create-payment-link', [PaymentController::class, 'createPaymentLink']);
Route::get('/retrieve-payment-link/{linkId}', [PaymentController::class, 'retrievePaymentLinkApi']);
Route::put('/update-payment-link', [PaymentController::class, 'updatePaymentLink']);
Route::get('/getpayments', [PaymentController::class, 'getPayments']);
Route::post('/payment-callback', [PaymentController::class, 'paymentCallback']);
Route::post('/create-payment-link', [PaymentController::class, 'createPaymentLink']);
Route::post('/refund-payment', [PaymentController::class, 'refundPayment']);
Route::get('refund', [PaymentController::class, 'getRefund']);
Route::put('/update-payment-status', [PaymentController::class, 'updatePaymentStatus']);

// Route::post('/users', 'App\Http\Controllers\UserController@create');
Route::post('/users', [UserController::class, 'create']);
Route::get('/getusers/{userId}', [UserController::class, 'getUserById']);


// Route::get('/user', function (Request $request) {
//     return $request->user();
// })->middleware('auth:sanctum');
//Routes for register user
Route::post('/registeruser', 'App\Http\Controllers\RegisterUserController@register');
Route::post('/verifytoken', 'App\Http\Controllers\RegisterUserController@verifyToken');
Route::post('/resendemail', 'App\Http\Controllers\RegisterUserController@resendEmailCode');

// Routes for propertyowner
Route::post('/propertyowner', 'App\Http\Controllers\PropertyOwnerController@create');

// Routes for propertycompany
Route::post('/propertycompany', 'App\Http\Controllers\PropertyCompanyController@create');

// Routes for legalrepresentative
Route::post('/legalrepresentative', 'App\Http\Controllers\LegalRepresentativeController@create');

// Routes for propertyownership
Route::post('/propertyownership', 'App\Http\Controllers\PropertyOwnershipController@create');

// Routes for amenity
Route::post('/amenities', 'App\Http\Controllers\AmenityController@create');
Route::get('/getamenities', 'App\Http\Controllers\AmenityController@getAmenities');
Route::get('/getamenitiesbyunit', 'App\Http\Controllers\AmenityController@getAmenitiesByUnit');
// Routes for service
Route::post('/services', 'App\Http\Controllers\ServiceController@create');

// Routes for facilities
Route::post('/facilities', 'App\Http\Controllers\FacilitiesController@create');

// Routes for house rule
Route::post('/houseRules', 'App\Http\Controllers\HouseruleController@create');

// Routes for location
Route::get('/getPropertyLocation', 'App\Http\Controllers\LocationController@getAllPropertyLocations');

// Route::post('/location', [LocationController::class, 'create']);
Route::post('/location', 'App\Http\Controllers\LocationController@create');
Route::get('/getlocations', 'App\Http\Controllers\LocationController@getAllLocation');
Route::get('/getlocation', 'App\Http\Controllers\LocationController@getLocation');
Route::get('/getdirection', 'App\Http\Controllers\LocationController@getDirection');
// routes/web.php or routes/api.php
Route::get('/search', [LocationController::class, 'search']);


// Route for updating password based on email
// Route::get('/forgotPass', [UserForgotPassController::class, 'changePass']);
Route::post('/forgotPass', 'App\Http\Controllers\UserForgotPassController@resendEmailCode');
Route::put('/changepass', 'App\Http\Controllers\UserForgotPassController@changePass');
Route::post('/passverifytoken', 'App\Http\Controllers\UserForgotPassController@verifyToken');


// Routes for additional info
Route::post('/additionalInfo/{userId}', [EditUserProfileController::class, 'createAdditionalInfo']);
Route::get('/additionalInfo/{additionalInfoId}', [EditUserProfileController::class, 'getAdditionalInfoById']);
Route::put('/additionalInfo/{additionalInfoId}', [EditUserProfileController::class, 'updateAdditionalInfo']);
Route::put('/updateProfile/{userid}', [EditUserProfileController::class, 'updateProfile']);

//Routes for login
Route::post('/login', [LoginUserController::class, 'login']);
Route::post('/logout', 'App\Http\Controllers\LoginUserController@logout');
Route::post('/auth/google', 'App\Http\Controllers\LoginUserController@googleLogin');
Route::post('/decodetoken', 'App\Http\Controllers\LoginUserController@decodeToken');

//Routes for property
Route::post('/propertyinfo', 'App\Http\Controllers\PropertyController@InsertPropertyInfo');
Route::get('/allproperties', 'App\Http\Controllers\PropertyController@getAllProperties');
Route::get('/getallpropertiescoord', 'App\Http\Controllers\PropertyController@getAllPropertiesCoord');
Route::get('/getproperty', 'App\Http\Controllers\PropertyController@getPropertyById');
Route::get('/getproptest', 'App\Http\Controllers\PropertyController@show');
Route::get('/getallunit', 'App\Http\Controllers\PropertyController@getAllUnitById');

//Routes for unitdetails
Route::post('/unitdetails', 'App\Http\Controllers\UnitDetailsController@insertUnitDetails');
Route::post('/bedroomtype', 'App\Http\Controllers\UnitDetailsController@insertBedTypes');
Route::get('/getunit/{unitid}', 'App\Http\Controllers\UnitDetailsController@getUnitById');

//Route for Inserting Booking Policy
Route::post('/bookingpolicy', 'App\Http\Controllers\BookingPolicyController@InsertBookingPolicyInfo');
//Route for Inserting Property Pricing
Route::post('/propertypricing', 'App\Http\Controllers\PropertyPricingController@insertPropertyPricing');
Route::get('/allpropertypricing', 'App\Http\Controllers\PropertyPricingController@getAllPropertyPricing');
//Route for Inserting Property Payment Methods
Route::post('/propertypaymentmethod', 'App\Http\Controllers\PropertyPaymentMethodsController@insertPropertyPaymentMethods');

//UPLOAD IMG
Route::post('/uploadimmg', 'App\Http\Controllers\FileController@store');
//UPLOAD USER PROFILE IMG
Route::post('/uploaduserimg', 'App\Http\Controllers\FileController@uploadAvatar');
Route::get('/getuserimg', 'App\Http\Controllers\FileController@getUserAvatar');
Route::post('/updateavatar', 'App\Http\Controllers\FileController@updateAvatar');
Route::post('/addcaption', 'App\Http\Controllers\FileController@addCaption');
//UPLOAD COMPANY LOGO IMG
Route::post('/uploadcomplogo', 'App\Http\Controllers\FileController@uploadLogo');
Route::get('/getcomplogo', 'App\Http\Controllers\FileController@getCompanyLogo');
Route::post('/updatecomplogo', 'App\Http\Controllers\FileController@updateCompanyLogo');


//UPLOAD MULTIPLE IMAGES
Route::post('/uploadfiles', 'App\Http\Controllers\FileController@uploadFiles');
Route::post('/upload-unit-files', 'App\Http\Controllers\FileController@uploadUnitFiles');
//GET IMAGES
Route::get('/getfiles/{projectid}', 'App\Http\Controllers\FileController@getImgByProperty');
Route::get('/getfiles-gallery/{projectid}', 'App\Http\Controllers\FileController@getImgByProperty_gallery');
Route::get('/getallfirstimg', 'App\Http\Controllers\FileController@getAllFirstImg');
//User 
Route::post('/becomeManager', 'App\Http\Controllers\UserController@becomeManager');

//FOR BOOKING
Route::post('/insertbooking', 'App\Http\Controllers\BookingController@insertBooking');
Route::put('/bookings', 'App\Http\Controllers\BookingController@updateBookingPid');
Route::put('/bookingStatus', 'App\Http\Controllers\BookingController@updateBookingStatus');
Route::put('/bookingSedMail', 'App\Http\Controllers\BookingController@sendEmail');

Route::get('/property/bookings', 'App\Http\Controllers\BookingController@getAllBookingByProperty');
Route::get('/property/bookingId', 'App\Http\Controllers\BookingController@getAllBookingByBookingId');

Route::get('/user/bookings', 'App\Http\Controllers\BookingController@getAllBookingByUserId');
Route::get('/user/bookinghistory', 'App\Http\Controllers\BookingController@getUserBookingHistory');

Route::get('/allbookinghistory', 'App\Http\Controllers\BookingController@getAllBookingHistoryByProperty');
Route::post('/setcheckout', 'App\Http\Controllers\BookingController@setCheckOut');
Route::post('/setcheckin', 'App\Http\Controllers\BookingController@setCheckin');
//AVAILABILITY FUNCTIONS
Route::get('/getavailableproperties', 'App\Http\Controllers\PropertyController@searchAvailableProperties');
Route::get('/getavailableunits', 'App\Http\Controllers\PropertyController@getAvailableUnits');

//Route for USER Manager
Route::get('/user/properties', 'App\Http\Controllers\UserController@getAllPropertyByUser');

//Route for Reviews and Ratings
Route::post('/reviewsandratings', 'App\Http\Controllers\ReviewsAndRatingsController@insertReviewsAndRating');
Route::get('/getreviewsandratings', 'App\Http\Controllers\ReviewsAndRatingsController@getReviewsAndRatingByReviewId');
Route::get('/getallreviewsandratings', 'App\Http\Controllers\ReviewsAndRatingsController@getAllReviewsAndRatings');

//EDIT PROPERTY INFO Single Unit
Route::put('/updatepropertyinfo/{propertyid}', [PropertyController::class, 'UpdatePropertyInfo']);
Route::put('/updateunitinfo/{unitid}', [UnitDetailsController::class, 'UpdateUnitInfo']);
Route::put('/updateunitinfo-singleunit/{unitid}', [UnitDetailsController::class, 'UpdateUnitInfoSingle']);
Route::post('/deleteunitroom-singleunit/{unitid}', [UnitDetailsController::class, 'DeleteUnitRoomSingle']);
Route::post('/deletebedroom-singleunit/{unitid}', [UnitDetailsController::class, 'DeleteBedRoomSingle']);
Route::post('/deletebed-singleunit/{unitid}', [UnitDetailsController::class, 'DeleteBedSingle']);
route::post('/updatepropertyfiles-singleunit/{propertyid}', [FileController::class, 'updateCoverPhotosSingle']);
route::post('/updatepropertyfiles-gallerysingleunit/{propertyid}', [FileController::class, 'updateGalleryPhotosSingle']);
route::post('/updatepropertybenefits-single/{propertyid}', [PropertyController::class, 'updatePropertyBenefits']);
route::post('/updatepropertyrules-single/{propertyid}', [PropertyController::class, 'updatePropertyRules']);

route::post('/property-companies/{propertycompanyid}', [PropertyCompanyController::class, 'update']);
route::post('/property-owners/{id}', [PropertyOwnerController::class, 'update']);
route::post('/legal-representative/{id}', [LegalRepresentativeController::class, 'update']);

//Route for Dashboard
Route::get('/getdashrevenue', 'App\Http\Controllers\DashboardController@getTotalPropertyRevenue');
Route::get('/getdashrevenueweekly', 'App\Http\Controllers\DashboardController@getWeeklyPropertyRevenue');

Route::get('/getdashbookings', 'App\Http\Controllers\DashboardController@getTotalPropertyBookings');
Route::get('/getdashbookingsweekly', 'App\Http\Controllers\DashboardController@getWeeklyPropertyBookings');

Route::get('/getdashratings', 'App\Http\Controllers\DashboardController@getTotalCustomerRating');
Route::get('/getdashratingsweekly', 'App\Http\Controllers\DashboardController@getWeeklyCustomerRating');

Route::get('/getdashdailybookings', 'App\Http\Controllers\DashboardController@getTodaysNewBookings');

Route::get('/getdashdailyguest', 'App\Http\Controllers\DashboardController@getTodaysTotalGuests');

Route::get('/getdashdailmonthprofit', 'App\Http\Controllers\DashboardController@getSixMonthProfit');

Route::get('/getdashyearbookingtrends', 'App\Http\Controllers\DashboardController@getMonthlyBookingTrends');

Route::get('/getdashbookinglist', 'App\Http\Controllers\DashboardController@getBookingList');

Route::get('/getdashoccupancylist', 'App\Http\Controllers\DashboardControllerBackUp@getWeeklyOccupancyRate');

Route::get('/getdashroomavail', 'App\Http\Controllers\DashboardController@getDailyRoomAvailability');

Route::get('/getDashboardData', 'App\Http\Controllers\DashboardController@getDashboardData');

Route::get('/getUserProperties', 'App\Http\Controllers\DashboardController@getUserProperties');

//Edit Property Info MultiUnit
Route::post('/updateunit-multiunit/{unitid}', [UnitDetailsController::class, 'updateMultiUnit']);
Route::post('/updatemultiunit-img/{unitid}', [FileController::class, 'updateMultiunitImg']);


//DISABLE and ACTIVATE PROPERTY

route::middleware(['token'])->group(function () {
    //DISABLE and ACTIVATE PROPERTY
    Route::put('/disableproperty', [PropertyController::class, 'disableProperty']);
    Route::put('/activateproperty', [PropertyController::class, 'activateProperty']);
});
