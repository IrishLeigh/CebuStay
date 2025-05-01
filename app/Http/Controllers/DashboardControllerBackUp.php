<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Property;
use App\Models\UnitDetails;
use App\Models\ReviewsAndRating;
use Carbon\Carbon;

class DashboardControllerBackUp extends CORS 
{
    /**
     * Get total payments for a specific property.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */

    //Total Property Revenue
    public function getTotalPropertyRevenue(Request $request)
    {
        $this->enableCors($request);

        $propertyId = $request->input('propertyid');

        $totalPayments = Booking::where('propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid') // Join with payments
            ->where('tbl_payment.status', 'success') // Filter to only include paid payments
            ->sum('tbl_payment.amount'); // Sum the amount from payments table

        return response()->json([
            'status' => 'success',
            'total_payments' => $totalPayments
        ]);
    }

    //Total Property Revenue for the last 30 days
    public function getMonthlyPropertyRevenue(Request $request)
    {
        $this->enableCors($request);

        $propertyId = $request->input('propertyid');

        $startDate = Carbon::now()->subDays(30);

        $totalPayments = Booking::where('propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid') // Join with payments
            ->where('tbl_payment.status', 'success') // Filter to only include paid payments
            ->where('tbl_payment.created_at', '>=', $startDate) // Filter payments within the last 30 days
            ->sum('tbl_payment.amount'); // Sum the amount from payments table

        return response()->json([
            'status' => 'success',
            'total_payments' => $totalPayments
        ]);
    }


    public function getWeeklyPropertyRevenue(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');

        // Get the current date
        $now = Carbon::now();

        // Find the start of the week (Monday)
        $startDate = $now->startOfWeek()->format('Y-m-d 00:00:00'); // Monday at midnight
        $endDate = $now->endOfWeek()->format('Y-m-d 23:59:59');

        // Calculate the total payment amount for the specific property from Monday to Saturday
        $totalPayments = Booking::where('propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid') // Join with payments
            ->where('tbl_payment.status', 'success') // Filter to only include paid payments
            ->whereBetween('tbl_payment.created_at', [$startDate, $endDate]) // Filter payments within the week range
            ->sum('tbl_payment.amount'); // Sum the amount from payments table

        // Return the total payments in the response
        return response()->json([
            'status' => 'success',
            'startdate' => $startDate,
            'enddate' => $endDate,
            'total_payments' => $totalPayments
        ]);
    }


    //Total Property Bookings
    public function getTotalPropertyBookings(Request $request)
    {
        $this->enableCors($request);

        $propertyId = $request->input('propertyid');

        $totalBookings = Booking::where('propertyid', $propertyId)->count();

        return response()->json([
            'status' => 'success',
            'total_bookings' => $totalBookings
        ]);
    }

    //Weekly Property Bookings
    public function getWeeklyPropertyBookings(Request $request)
    {
        $this->enableCors($request);

        $propertyId = $request->input('propertyid');

        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        // Count the number of bookings for the specific property within the current week
        $weeklyBookings = Booking::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek]) // Filter bookings by the current week
            ->count();

        // Return the weekly bookings count in the response
        return response()->json([
            'status' => 'success',
            'weekly_bookings' => $weeklyBookings
        ]);
    }

    //Total Customer Rating
    public function getTotalCustomerRating(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');

        // Calculate the total customer rating for the specific property
        $totalRating = ReviewsAndRating::where('propertyid', $propertyId)
            ->sum('rating'); // Sum the ratings from ReviewsAndRating table

        // Optionally, if you want to get the average rating instead:
        // $averageRating = ReviewsAndRating::where('propertyid', $propertyId)
        //     ->avg('rating'); // Average rating

        // Return the total customer rating in the response
        return response()->json([
            'status' => 'success',
            'total_rating' => $totalRating
            // 'average_rating' => $averageRating // If using average rating instead
        ]);
    }

    //Weekly Customer Rating
    public function getWeeklyCustomerRating(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');

        // Get the start and end of the current week
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();

        // Calculate the total customer rating for the specific property within the last week
        $totalRating = ReviewsAndRating::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek]) // Filter ratings within the current week
            ->sum('rating'); // Sum the ratings from ReviewsAndRating table

        // Optionally, if you want to get the average rating instead:
        $averageRating = ReviewsAndRating::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek]) // Filter ratings within the current week
            ->avg('rating'); // Average rating

        // Return the total customer rating in the response
        return response()->json([
            'status' => 'success',
            // 'total_rating' => $totalRating
            'average_rating' => $averageRating
        ]);
    }

    public function getTodaysNewBookings(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');

        // Get today's date range (from midnight to the end of the day)
        $todayStart = Carbon::today()->startOfDay()->format('Y-m-d 00:00:00');
        $todayEnd = Carbon::today()->endOfDay()->format('Y-m-d 23:59:59');

        // Count the number of new bookings for today
        $newBookings = Booking::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$todayStart, $todayEnd]) // Filter today's bookings
            ->count();

        // Return the total new bookings in the response
        return response()->json([
            'status' => 'success',
            'new_bookings' => $newBookings
        ]);
    }

    public function getTodaysTotalGuests(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');

        // Get today's date range (from midnight to the end of the day)
        $todayStart = Carbon::today()->startOfDay();
        $todayEnd = Carbon::today()->endOfDay();

        // Calculate total guest count for today by summing the 'guest_count' column in the tbl_booking table
        $totalGuests = Booking::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$todayStart, $todayEnd]) // Filter today's bookings
            ->sum('guest_count'); // Sum the guest_count from tbl_booking

        // Return the total guests in the response
        return response()->json([
            'status' => 'success',
            'total_guests' => $totalGuests
        ]);
    }

    public function getSixMonthProfit(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');

        // Define the commission percentage (can be changed later)
        $commissionPercentage = 0.15; // Example: 15% commission

        // Get the start date (6 months ago) and end date (now)
        $startDate = Carbon::now()->subMonths(6)->startOfMonth(); // 6 months ago
        $endDate = Carbon::now()->endOfMonth(); // End of the current month

        // Initialize an array to store the profit for each month
        $profitsPerMonth = [];

        // Loop through each of the last 6 months
        for ($i = 0; $i < 6; $i++) {
            // Calculate the current month range
            $monthStart = Carbon::now()->subMonths($i)->startOfMonth();
            $monthEnd = Carbon::now()->subMonths($i)->endOfMonth();

            // Fetch payments for the specific month
            $monthlyPayments = Booking::where('propertyid', $propertyId)
                ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid') // Join with payments
                ->where('tbl_payment.status', 'success') // Only successful payments
                ->whereBetween('tbl_payment.created_at', [$monthStart, $monthEnd]) // Filter payments for the current month
                ->select('tbl_payment.amount') // Only select the payment amount
                ->get();

            // Calculate profit for the current month
            $monthlyProfit = 0;
            foreach ($monthlyPayments as $payment) {
                $profit = $payment->amount * (1 - $commissionPercentage); // Deduct commission to get the profit
                $monthlyProfit += $profit; // Sum the profits
            }

            // Store the profit and month name (formatted) in the array
            $profitsPerMonth[] = [
                'month' => $monthStart->format('F Y'), // Format the month as "Month Year" (e.g., "September 2024")
                'profit' => $monthlyProfit
            ];
        }

        // Reverse the array to have the latest month first
        $profitsPerMonth = array_reverse($profitsPerMonth);

        // Return the profits data for the last 6 months in the response
        return response()->json([
            'status' => 'success',
            'profits_per_month' => $profitsPerMonth
        ]);
    }

    public function getMonthlyBookingTrends(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');

        // Get the current year
        $currentYear = Carbon::now()->year;

        // Initialize an array to store the booking count for each month
        $bookingsPerMonth = [];

        // Loop through each month (1 to 12) to calculate bookings
        for ($month = 1; $month <= 12; $month++) {
            // Define the start and end of the month
            $monthStart = Carbon::create($currentYear, $month, 1)->startOfMonth();
            $monthEnd = Carbon::create($currentYear, $month, 1)->endOfMonth();

            // Count the number of bookings for the specific month
            $monthlyBookings = Booking::where('propertyid', $propertyId)
                ->whereBetween('created_at', [$monthStart, $monthEnd]) // Filter for the specific month
                ->count(); // Count the number of bookings

            // Store the booking count and month in the array
            $bookingsPerMonth[] = [
                'month' => $monthStart->format('F'), // Format the month as a full name (e.g., "January")
                'bookings' => $monthlyBookings
            ];
        }

        // Return the booking trends in the response
        return response()->json([
            'status' => 'success',
            'bookings_per_month' => $bookingsPerMonth
        ]);
    }

    public function getBookingList(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');

        $today = Carbon::today();

        $propertyType = Property::where('propertyid', $request->input('propertyid'))->first();


        // Fetch all bookings for the specific property where payment status is 'paid'
        $bookingList = Booking::where('tbl_booking.propertyid', $propertyId)
            ->whereDate('tbl_booking.checkin_date', $today)
            ->join('property', 'tbl_booking.propertyid', '=', 'property.propertyid') // Join with payments table
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid') // Join with payments table
            ->join('tbl_booker', 'tbl_booking.bookerid', '=', 'tbl_booker.bookerid') // Join with booker table
            ->join('unitdetails', 'tbl_booking.propertyid', '=', 'unitdetails.propertyid') // Join with UnitDetails table for unit name
            ->select(
                'property.property_type', // Booking Date
                'tbl_booking.bookingid', // Booking ID
                'tbl_booker.firstname', // Booker First Name
                'tbl_booker.lastname',  // Booker Last Name
                'unitdetails.unitname', // Unit Name from UnitDetails
                'tbl_booking.guest_count', // Number of Guests
                'tbl_payment.status' // Payment Status
            )
            ->get(); // Get the results

        // Format the result to include Booker Full Name
        $formattedBookingList = $bookingList->map(function ($booking) {
            return [
                'bookingid' => $booking->bookingid,
                'booker_name' => $booking->firstname . ' ' . $booking->lastname, // Full Booker Name
                'unit_name' => $booking->unitname, // Unit Name from UnitDetails model
                'guest_count' => $booking->guest_count,
                'status' => ucfirst($booking->status) // Capitalize status (e.g., 'Paid')
            ];
        });

        // Return the formatted booking list
        return response()->json([
            'status' => 'success',
            'property_type' => $propertyType->property_type,
            'bookings' => $formattedBookingList
        ]);
    }

    public function getWeeklyOccupancyRate(Request $request)
    {
        $this->enableCors($request);
    
        // Get the property ID from the request
        $propertyId = $request->input('propertyid');
    
        // Get the current week range
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
        $isSingleUnit = $unit->property_type !== 'Hotel'; // If it's not a "Hotel", we assume it's a single-unit property
    
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
    
        // Return the occupancy rate in the response
        return response()->json([
            'status' => 'success',
            'property_type' => $isSingleUnit ? 'Single Unit' : 'Multi-Unit (Hotel)',
            'occupancy_rate' => $occupancyRate,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'booked_days' => $isSingleUnit ? $bookedDays : $bookedUnitDays,
            'total_days_in_week' => $totalDaysInWeek
        ]);
    }

    public function getDailyRoomAvailability(Request $request)
    {
        $this->enableCors($request);
    
        // Get the property ID from the request
        $propertyId = $request->input('propertyid');
    
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