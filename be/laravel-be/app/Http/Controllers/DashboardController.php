<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Property;
use App\Models\UnitDetails;
use App\Models\ReviewsAndRating;
use App\Models\PropertyOwnership;
use App\Models\UserFile;
use GuzzleHttp\Exception\GuzzleException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Carbon\Carbon;

class DashboardController extends CORS 
{
    public function getDashboardData(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');
        $property = Property::where('propertyid', $propertyId)->first();
        $propertyOwnership = PropertyOwnership::where('propertyid', $propertyId)->first();

        if (!$property) {
            return response()->json(['status' => 'error', 'message' => 'Property not found']);
        }

        // Determine if it is a single unit or multi-unit
        $isSingleUnit = $property->property_type !== 'Hotel'; // Assuming 'Hotel' indicates multi-unit

        // Initialize response data
        $data = [];

        // Total Payments
        // $data['total_payments'] = $this->getTotalPayments($propertyId);
        
        // Monthly Revenue
        // $data['monthly_revenue'] = $this->getMonthlyRevenue($propertyId);
        
        // Weekly Revenue
        // $data['weekly_revenue'] = $this->getWeeklyRevenue($propertyId);
        
        // Total Bookings
        $data['total_bookings'] = $this->getTotalBookings($propertyId);
        
        // Weekly Bookings
        // $data['weekly_bookings'] = $this->getWeeklyBookings($propertyId);
        
        // Customer Ratings
        // $data['total_rating'] = $this->getTotalCustomerRating($propertyId);
        // $data['weekly_rating'] = $this->getWeeklyCustomerRating($propertyId);

        $ownershipType = $propertyOwnership->ownershiptype; // Assuming you have a method to get ownership type

        // Initialize variable to store logo/avatar URL
        $logoOrAvatarUrl = null;

        if ($ownershipType === 'Company') {
            // Call getCompanyLogo function
            $logoResult = $this->getCompanyLogo(new Request(['propertyid' => $propertyId]));
            if ($logoResult->getData()->status === 'success') {
                $logoOrAvatarUrl = $logoResult->getData()->src;
            }
        } else {
            // Assume Individual ownership type
            $userId = $this->getUserIdForProperty($propertyId); // Assuming you have a way to get the user ID for the property
            $avatarResult = $this->getUserAvatar(new Request(['userid' => $userId]));
            if ($avatarResult->getData()->status === 'success') {
                $logoOrAvatarUrl = $avatarResult->getData()->src;
            }
        }


        $data = [
            [
                'title' => 'Total Revenue',
                'value' => number_format($this->getMonthlyRevenue($propertyId)['totalRevenue'], 0, '.', ','),
                'interval' => 'Last 30 days',
                'trend' => $this->calculateTrend(
                    $this->getMonthlyRevenue($propertyId)['totalRevenue'],
                    $this->getPreviousMonthlyRevenue($propertyId)
                ),
                'data' => $this->getMonthlyRevenue($propertyId)['revenueData'],
            ],
            // Weekly Bookings
            [
                'title' => 'Total Bookings',
                'value' => number_format($this->getWeeklyBookings($propertyId)['totalBookings'], 0, '.', ','),
                'interval' => 'This week',
                'trend' => $this->calculateTrend(
                    $this->getWeeklyBookings($propertyId)['totalBookings'],
                    $this->getPreviousWeeklyBookings($propertyId)
                ),
                'data' => $this->getWeeklyBookings($propertyId)['bookingData'],
            ],
            // Weekly Customer Ratings
            [
                'title' => 'Total Customer Ratings',
                'value' => number_format($this->getWeeklyCustomerRating($propertyId)['averageRating'], 0, '.', ','),
                'interval' => 'This week',
                $this->calculateTrend(
                    $this->getWeeklyCustomerRating($propertyId)['averageRating'],
                    $this->getPreviousWeeklyCustomerRating($propertyId)
                ),
                'data' => $this->getWeeklyCustomerRating($propertyId)['ratingData'],
            ],
            // // Today's Bookings
            // [
            //     'title' => 'Today\'s Bookings',
            //     'value' => number_format($this->getTodaysNewBookings($propertyId), 0, '.', ','),
            //     'interval' => 'Today',
            //     'trend' => 'neutral', // You may calculate trend dynamically if needed
            //     'data' => [], // You may not need daily data for today's bookings, so this can be left empty
            // ],
        ];

        // Add the logo/avatar URL to the response data
        $data['ownership_logo'] = $logoOrAvatarUrl;
        
        // Today's Bookings
        $data['new_bookings'] = $this->getTodaysNewBookings($propertyId);
        
        // Today's Total Guests
        $data['todays_guests'] = $this->getTodaysTotalGuests($propertyId);
        
        // Six Month Profit
        $data['six_month_profit'] = $this->getSixMonthProfit($propertyId);
        
        // Monthly Booking Trends
        $data['booking_trends'] = $this->getMonthlyBookingTrends($propertyId);
        
        // Booking List
        $data['booking_list'] = $this->getBookingList($propertyId);
        
        // Weekly Occupancy Rate
        $data['occupancy_rate'] = $this->getWeeklyOccupancyRate($propertyId, $isSingleUnit);
        $data['room_availability'] = $this->getDailyRoomAvailability($propertyId);

        return response()->json(['status' => 'success', 'singleUnit' => $isSingleUnit, 'data' => $data]);
    }

        public function getPropertyImage(Request $request)
    {
        try {
            $this->enableCors($request);
            $propertyId = $request->propertyid;

            // Assuming you have a Property model to get the ownership type
            $property = Property::findOrFail($propertyId);
            $ownershipType = $property->ownershiptype;

            if ($ownershipType === 'Company') {
                return $this->getCompanyLogo($request);
            } elseif ($ownershipType === 'Individual') {
                return $this->getUserAvatar($request);
            } else {
                return response()->json(['status' => 'error', 'message' => 'Invalid ownership type']);
            }
        } catch (ModelNotFoundException $e) {
            return response()->json(['status' => 'error', 'message' => 'Property not found']);
        } catch (GuzzleException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // Company Logo Function
    private function getCompanyLogo(Request $request)
    {
        try {
            $propertyId = $request->propertyid;
            $src_userimg = UserFile::where('propertyid', $propertyId)
                ->where('isavatar', false)
                ->first();

            if (!$src_userimg) {
                return response()->json(['status' => 'error', 'message' => 'No image found']);
            } else {
                return response()->json(['status' => 'success', 'src' => $src_userimg->file_url]);
            }
        } catch (GuzzleException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    // User Avatar Function
    private function getUserAvatar(Request $request)
    {
        try {
            $userid = $request->userid;

            $src_userimg = UserFile::where('userid', $userid)
                ->where('isavatar', true)
                ->whereNull('propertyid')
                ->first();

            if (!$src_userimg) {
                return response()->json(['status' => 'error', 'message' => 'No image found']);
            } else {
                return response()->json(['status' => 'success', 'src' => $src_userimg->file_url]);
            }
        } catch (GuzzleException $e) {
            return response()->json(['status' => 'error', 'message' => $e->getMessage()]);
        }
    }

    private function getUserIdForProperty($propertyId)
    {
        // Assuming you have a model named PropertyOwnership or similar
        $property = Property::where('propertyid', $propertyId)->first();

        if ($property) {
            return $property->userid;
        }

        return null; // Return null or handle this case as needed
    }

    private function calculateTrend($currentValue, $previousValue)
    {
        if ($currentValue > $previousValue) {
            return 'up';
        } elseif ($currentValue < $previousValue) {
            return 'down';
        } else {
            return 'neutral';
        }
    }
    
    private function getPreviousMonthlyRevenue($propertyId)
    {
        // Calculate the previous 30-day period
        $startDate = Carbon::now()->subDays(60);
        $endDate = Carbon::now()->subDays(30);
    
        return Booking::where('tbl_booking.propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
            ->where('tbl_payment.status', 'Paid')
            ->whereBetween('tbl_payment.created_at', [$startDate, $endDate])
            ->sum('tbl_payment.amount');
    }
    
    private function getPreviousWeeklyBookings($propertyId)
    {
        // Calculate the previous week
        $startOfPreviousWeek = Carbon::now()->subWeek()->startOfWeek();
        $endOfPreviousWeek = Carbon::now()->subWeek()->endOfWeek();
    
        return Booking::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfPreviousWeek, $endOfPreviousWeek])
            ->count();
    }
    
    private function getPreviousWeeklyCustomerRating($propertyId)
    {
        // Calculate the previous week
        $startOfPreviousWeek = Carbon::now()->subWeek()->startOfWeek();
        $endOfPreviousWeek = Carbon::now()->subWeek()->endOfWeek();
    
        return ReviewsAndRating::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfPreviousWeek, $endOfPreviousWeek])
            ->avg('rating');
    }

    private function getTotalPayments($propertyId) {
        return Booking::where('propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
            ->where('tbl_payment.status', 'Paid')
            ->sum('tbl_payment.amount');
    }

    private function getMonthlyRevenue($propertyId)
    {
        // Get the current date and 30 days ago
        $startDate = Carbon::now()->subDays(30);
        $endDate = Carbon::now();
    
        // Fetch daily revenue for the past 30 days, grouped by day
        $dailyRevenue = Booking::where('tbl_booking.propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
            ->where('tbl_payment.status', 'Paid')
            ->whereBetween('tbl_payment.created_at', [$startDate, $endDate])
            ->selectRaw('DATE(tbl_payment.created_at) as date, SUM(tbl_payment.amount) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    
        // Initialize an array for storing daily revenue data
        $revenueData = [];
        $totalRevenue = 0; // Variable to store the total revenue sum
    
        // Populate the array with daily revenue, defaulting to 0 if no revenue exists for a day
        for ($i = 0; $i < 30; $i++) {
            $date = Carbon::now()->subDays(30 - $i)->format('Y-m-d');
            $revenueForDay = $dailyRevenue->firstWhere('date', $date);
            $dailyTotal = $revenueForDay ? $revenueForDay->total : 0;
            $revenueData[] = $dailyTotal;
    
            // Add the day's revenue to the total sum
            $totalRevenue += $dailyTotal;
        }
    
        // Return both the daily revenue data and the total sum
        return [
            'title' => 'Total Revenue',
            'revenueData' => $revenueData,
            'totalRevenue' => $totalRevenue
        ];
    }

    private function getWeeklyRevenue($propertyId) {
        $startDate = Carbon::now()->startOfWeek();
        $endDate = Carbon::now()->endOfWeek();
        return Booking::where('propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
            ->where('tbl_payment.status', 'Paid')
            ->whereBetween('tbl_payment.created_at', [$startDate, $endDate])
            ->sum('tbl_payment.amount');
    }

    private function getTotalBookings($propertyId) {
        return Booking::where('propertyid', $propertyId)->count();
    }

    private function getWeeklyBookings($propertyId)
    {
        // Get the start and end of the current week
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
    
        // Fetch daily bookings for the current week, grouped by day
        $dailyBookings = Booking::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->selectRaw('DATE(created_at) as date, COUNT(*) as total')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    
        // Initialize an array for storing daily bookings data
        $bookingData = [];
        $totalBookings = 0; // Variable to store the total number of bookings
    
        // Populate the array with daily bookings, defaulting to 0 if no bookings exist for a day
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->startOfWeek()->addDays($i)->format('Y-m-d');
            $bookingsForDay = $dailyBookings->firstWhere('date', $date);
            $dailyTotal = $bookingsForDay ? $bookingsForDay->total : 0;
            $bookingData[] = $dailyTotal;
    
            // Add the day's bookings to the total count
            $totalBookings += $dailyTotal;
        }
    
        // Return both the daily bookings data and the total bookings count with the title 'Total Bookings'
        return [
            'title' => 'Total Bookings',
            'totalBookings' => $totalBookings,
            'bookingData' => $bookingData
        ];
    }

    private function getTotalCustomerRating($propertyId) {
        return ReviewsAndRating::where('propertyid', $propertyId)->sum('rating');
    }

    private function getWeeklyCustomerRating($propertyId)
    {
        // Get the start and end of the current week
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
    
        // Fetch daily customer ratings for the current week, grouped by day
        $dailyRatings = ReviewsAndRating::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->selectRaw('DATE(created_at) as date, AVG(rating) as average_rating')
            ->groupBy('date')
            ->orderBy('date')
            ->get();
    
        // Initialize an array for storing daily rating data
        $ratingData = [];
        $totalRatingSum = 0; // Variable to sum all the ratings
        $ratingCount = 0;    // Variable to count the total number of ratings
    
        // Populate the array with daily rating data, defaulting to 0 if no ratings exist for a day
        for ($i = 0; $i < 7; $i++) {
            $date = Carbon::now()->startOfWeek()->addDays($i)->format('Y-m-d');
            $ratingForDay = $dailyRatings->firstWhere('date', $date);
            $dailyAverage = $ratingForDay ? $ratingForDay->average_rating : 0;
            $ratingData[] = $dailyAverage;
    
            // Add the day's ratings to the total sum and count for the average
            if ($dailyAverage > 0) {
                $totalRatingSum += $dailyAverage;
                $ratingCount++;
            }
        }
    
        // Calculate the overall average rating for the week
        $averageRating = $ratingCount > 0 ? $totalRatingSum / $ratingCount : 0;
    
        // Return both the daily ratings data and the total average rating with the title 'Total Customer Ratings'
        return [
            'title' => 'Total Customer Ratings',
            'averageRating' => $averageRating,
            'ratingData' => $ratingData
        ];
    }
    

    private function getTodaysNewBookings($propertyId) {
        $todayStart = Carbon::today()->startOfDay();
        $todayEnd = Carbon::today()->endOfDay();
        return Booking::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$todayStart, $todayEnd])
            ->count();
    }

    private function getTodaysTotalGuests($propertyId) {
        $todayStart = Carbon::today()->startOfDay();
        $todayEnd = Carbon::today()->endOfDay();
        return Booking::where('propertyid', $propertyId)
            ->whereBetween('checkin_date', [$todayStart, $todayEnd])
            ->sum('guest_count');
    }

    private function getSixMonthProfit($propertyId) {
        $commissionPercentage = 0.15; // Example: 15% commission
        $profitsPerMonth = [];

        for ($i = 0; $i < 6; $i++) {
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();

            $monthlyPayments = Booking::where('propertyid', $propertyId)
                ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
                ->where('tbl_payment.status', 'Paid')
                ->whereBetween('tbl_payment.created_at', [$monthStart, $monthEnd])
                ->select('tbl_payment.amount')
                ->get();

            $monthlyProfit = $monthlyPayments->sum(function ($payment) use ($commissionPercentage) {
                return $payment->amount * (1 - $commissionPercentage);
            });

            $profitsPerMonth[] = [
                'month' => $monthStart->format('F Y'),
                'profit' => $monthlyProfit,
            ];
        }

        return array_reverse($profitsPerMonth);
    }

    private function getMonthlyBookingTrends($propertyId) {
        $currentYear = Carbon::now()->year;
        $bookingsPerMonth = [];

        for ($month = 1; $month <= 12; $month++) {
            $monthStart = Carbon::create($currentYear, $month, 1)->startOfMonth();
            $monthEnd = Carbon::create($currentYear, $month, 1)->endOfMonth();

            $monthlyBookings = Booking::where('propertyid', $propertyId)
                ->whereBetween('created_at', [$monthStart, $monthEnd])
                ->count();

            $bookingsPerMonth[] = [
                'month' => $monthStart->format('F'),
                'bookings' => $monthlyBookings
            ];
        }

        return $bookingsPerMonth;
    }

    private function getBookingList($propertyId) {
        $today = Carbon::today();
        return Booking::where('tbl_booking.propertyid', $propertyId)
            ->whereDate('tbl_booking.checkin_date', $today)
            ->join('property', 'tbl_booking.propertyid', '=', 'property.propertyid')
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
            ->join('tbl_booker', 'tbl_booking.bookerid', '=', 'tbl_booker.bookerid')
            ->join('unitdetails', 'tbl_booking.propertyid', '=', 'unitdetails.propertyid')
            ->select(
                'property.property_type',
                'tbl_booking.bookingid',
                'tbl_booker.firstname',
                'tbl_booker.lastname',
                'unitdetails.unitname',
                'tbl_booking.guest_count',
                'tbl_payment.status'
            )
            ->get()
            ->map(function ($booking) {
                return [
                    'bookingid' => $booking->bookingid,
                    'booker_name' => $booking->firstname . ' ' . $booking->lastname,
                    'unit_name' => $booking->unitname,
                    'guest_count' => $booking->guest_count,
                    'status' => ucfirst($booking->status)
                ];
            });
    }

    private function getWeeklyOccupancyRate($propertyId, $isSingleUnit) {
        $now = Carbon::now();
        $startDate = $now->startOfWeek(); // Start of the week (Monday)
        $endDate = $now->endOfWeek(); // End of the week (Sunday)

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        // ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
    
        // Get the unit details for the property
        $unit = Property::where('propertyid', $propertyId)->first();
    
        if (!$unit) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unit not found for the specified property'
            ]);
        }
    
        // Check if the property is a multi-unit (i.e., Hotel) or single-unit
       
    
        // Get the total number of available days in the week
        $totalDaysInWeek = 7;
    
        if ($isSingleUnit) {
            // Single unit occupancy rate calculation
    
            // Get the total number of bookings for the specific unit for the current week
            $bookedDays = Booking::where('propertyid', $propertyId)
                ->whereBetween('checkin_date', [$startOfWeek, $endOfWeek])
                ->count(); // Count the number of bookings for the week
    
            // For a single unit, occupancy rate is calculated as (booked days / total days in the week)
            $occupancyRate = ($bookedDays / $totalDaysInWeek) * 100;
    
        } else {
            // Multi-unit occupancy rate calculation (for Hotels)
    
            // Get the total number of units for the property (assuming unitdetails table holds this)
            $totalUnits = UnitDetails::where('propertyid', $propertyId)->count();
    
            // Get the total number of bookings for the specific property (across all units) for the current week
            $bookedUnitDays = Booking::where('propertyid', $propertyId)
                ->whereBetween('checkin_date', [$startOfWeek, $endOfWeek])
                ->count(); // Count the total number of unit-days booked for the week
    
            // Calculate total available unit-days (total units * days in the week)
            $totalAvailableUnitDays = $totalUnits * $totalDaysInWeek;
    
            // For a multi-unit (e.g., Hotel), occupancy rate is (booked unit-days / total available unit-days) * 100
            $occupancyRate = ($bookedUnitDays / $totalAvailableUnitDays) * 100;
        }

        return number_format($occupancyRate, 2);
    }

    public function getUserProperties(Request $request)
    {
        $this->enableCors($request);
    
        // Get the user ID from the request
        $userId = $request->input('userid');
    
        // Fetch properties owned by the user
        $properties = Property::where('userid', $userId)
    ->where('isFail', 0)
    ->get();
    
        if ($properties->isEmpty()) {
            return response()->json(['status' => 'error', 'message' => 'No properties found for this user']);
        }
    
        // Map the properties to return necessary details
        $propertyList = $properties->map(function ($property) {
            $propertyOwnership = PropertyOwnership::where('propertyid', $property->propertyid)->first();
            // $ownershipType = $propertyOwnership->ownershiptype;
            $propertyImage = $propertyOwnership ? 
            $this->getPropertyImageByOwnership($propertyOwnership, $property) : 
            null;
    
            return [
                'propertyid' => $property->propertyid,
                'property_name' => $property->property_name,
                'property_type' => $property->property_type,
                'location' => $property->location,
                'created_at' => $property->created_at->format('Y-m-d'),
                'status' => $property->status,
                'ownership_logo' => $propertyImage, // Include the image URL here
            ];
        });
    
        return response()->json(['status' => 'success', 'data' => $propertyList]);
    }


    private function getPropertyImageByOwnership($propertyOwnership, $property)
    {
        try {
            if ($propertyOwnership->ownershiptype === 'Company') {
                return $this->getCompanyLogoByPropertyId($property->propertyid);
            } elseif ($propertyOwnership->ownershiptype === 'Individual') {
                return $this->getUserAvatarByPropertyId($property->propertyid);
            }
        } catch (ModelNotFoundException $e) {
            return null;
        } catch (GuzzleException $e) {
            return null;
        }

        return null;
    }

// Company Logo function refactored to return the URL
    private function getCompanyLogoByPropertyId($propertyId)
    {
        $src_userimg = UserFile::where('propertyid', $propertyId)
            ->where('isavatar', false)
            ->first();

        return $src_userimg ? $src_userimg->file_url : null;
    }

// User Avatar function refactored to return the URL
    private function getUserAvatarByPropertyId($propertyId)
    {
        // Assuming there's a similar logic to fetch the user avatar based on the property ID
        $src_userimg = UserFile::where('propertyid', $propertyId)
            ->where('isavatar', true)
            ->first();

        // return $src_userimg ? $src_userimg->file_url : null;
        return $src_userimg ? $src_userimg->file_url : null;
    }

    public function getDailyRoomAvailability($propertyId)
    {

        // Get today's date
        $today = Carbon::now()->toDateString(); // Current date
    
        // Get the unit details for the property
        $unit = Property::where('propertyid', $propertyId)->first();
    
        if (!$unit) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unit not found for the specified property'
            ]);
        }
    
        // Check if the property is a multi-unit (i.e., Hotel) or single-unit
        $isSingleUnit = $unit->property_type !== 'Hotel'; // If it's not a "Hotel", we assume it's a single-unit property
    
        // Calculate available rooms
        if ($isSingleUnit) {
            // Single unit availability calculation
            $booked = Booking::where('propertyid', $propertyId)
                ->where('checkin_date', $today) // Check-in date is today
                ->count(); // Count the number of bookings for today
    
            // Total available rooms (1 for single unit)
            $availableRooms = 1 - $booked;
    
        } else {
            // Multi-unit availability calculation (for Hotels)
    
            // Get the total number of units for the property
            $totalUnits = UnitDetails::where('propertyid', $propertyId)->count();
    
            // Get the total number of bookings for the specific property (across all units) for today
            $bookedUnits = Booking::where('propertyid', $propertyId)
                ->where('checkin_date', $today) // Check-in date is today
                ->count(); // Count the total number of booked units for today
    
            // Calculate available rooms
            $availableRooms = $totalUnits - $bookedUnits;
        }
    
        // Return the room availability in the response
        return response()->json([
            'status' => 'success',
            'property_type' => $isSingleUnit ? 'Single Unit' : 'Multi-Unit (Hotel)',
            'available_rooms' => max(0, $availableRooms), // Ensure no negative numbers
            'booked_rooms' => $isSingleUnit ? $booked : $bookedUnits, // Booked rooms for display
            'total_rooms' => $isSingleUnit ? 1 : $totalUnits // Total rooms for the property
        ]);
    }

}
