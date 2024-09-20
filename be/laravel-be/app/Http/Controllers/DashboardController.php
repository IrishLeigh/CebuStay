<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Payment;
use App\Models\Property;
use App\Models\UnitDetails;
use App\Models\ReviewsAndRating;
use Carbon\Carbon;

class DashboardController extends CORS 
{
    public function getDashboardData(Request $request)
    {
        $this->enableCors($request);

        // Get the property ID from the request
        $propertyId = $request->input('propertyid');
        $property = Property::where('propertyid', $propertyId)->first();

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
        $data['monthly_revenue'] = $this->getMonthlyRevenue($propertyId);
        
        // Weekly Revenue
        // $data['weekly_revenue'] = $this->getWeeklyRevenue($propertyId);
        
        // Total Bookings
        $data['total_bookings'] = $this->getTotalBookings($propertyId);
        
        // Weekly Bookings
        $data['weekly_bookings'] = $this->getWeeklyBookings($propertyId);
        
        // Customer Ratings
        // $data['total_rating'] = $this->getTotalCustomerRating($propertyId);
        $data['weekly_rating'] = $this->getWeeklyCustomerRating($propertyId);
        
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

        return response()->json(['status' => 'success', 'singleUnit' => $isSingleUnit, 'data' => $data]);
    }

    private function getTotalPayments($propertyId) {
        return Booking::where('propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
            ->where('tbl_payment.status', 'success')
            ->sum('tbl_payment.amount');
    }

    private function getMonthlyRevenue($propertyId) {
        $startDate = Carbon::now()->subDays(30);
        return Booking::where('propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
            ->where('tbl_payment.status', 'success')
            ->where('tbl_payment.created_at', '>=', $startDate)
            ->sum('tbl_payment.amount');
    }

    private function getWeeklyRevenue($propertyId) {
        $startDate = Carbon::now()->startOfWeek();
        $endDate = Carbon::now()->endOfWeek();
        return Booking::where('propertyid', $propertyId)
            ->join('tbl_payment', 'tbl_booking.bookingid', '=', 'tbl_payment.bookingid')
            ->where('tbl_payment.status', 'success')
            ->whereBetween('tbl_payment.created_at', [$startDate, $endDate])
            ->sum('tbl_payment.amount');
    }

    private function getTotalBookings($propertyId) {
        return Booking::where('propertyid', $propertyId)->count();
    }

    private function getWeeklyBookings($propertyId) {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        return Booking::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->count();
    }

    private function getTotalCustomerRating($propertyId) {
        return ReviewsAndRating::where('propertyid', $propertyId)->sum('rating');
    }

    private function getWeeklyCustomerRating($propertyId) {
        $startOfWeek = Carbon::now()->startOfWeek();
        $endOfWeek = Carbon::now()->endOfWeek();
        return ReviewsAndRating::where('propertyid', $propertyId)
            ->whereBetween('created_at', [$startOfWeek, $endOfWeek])
            ->avg('rating');
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
                ->where('tbl_payment.status', 'success')
                ->whereBetween('tbl_payment.created_at', [$monthStart, $monthEnd])
                ->select('tbl_payment.amount')
                ->get();

            $monthlyProfit = $monthlyPayments->sum(function ($payment) use ($commissionPercentage) {
                return $payment->amount * (1 - $commissionPercentage);
            });

            $profitsPerMonth[] = [
                'month' => $monthStart->format('F Y'),
                'profit' => $monthlyProfit
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
}
