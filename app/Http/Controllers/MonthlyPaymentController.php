<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\MonthlyPayment;
use Carbon\Carbon; // to work with dates
use Illuminate\Support\Facades\Log;

class MonthlyPaymentController extends CORS
{
    // Method to check and update payment statuses
    public function checkDuePayments(Request $request)
{
    // Get today's date
    $today = Carbon::now()->toDateString();

    // Get the userid from the request
    $userId = $request->input('userid'); // Assume userid is passed in the request

    // Find all overdue payments for the specific user
    $overduePayments = MonthlyPayment::where('due_date', '<', $today)
                                    ->where('status', 'Pending')
                                    ->where('userid', $userId) // Filter by userid
                                    ->get();

    // Update payment status to 'overdue'
    foreach ($overduePayments as $payment) {
        $payment->status = 'Overdue';
        $payment->save();

        // Log the overdue action
        Log::info('Payment overdue for booking ID: ' . $payment->bookingid . ' (User ID: ' . $userId . ')');
    }

    return response()->json([
        'message' => 'Overdue payments updated',
        'count' => $overduePayments->count()
    ]);
}

    // Method to notify users of upcoming payments
    public function notifyUpcomingPayments(Request $request)
    {
        // Define the range for upcoming payments (e.g., notify 30 days in advance)
        $upcomingDate = Carbon::now()->addDays(15)->toDateString();
    
        $userId = $request->input('userid'); 
        Log::info('User ID received: ' . $userId);
    
        $upcomingPayments = MonthlyPayment::where('due_date', '<=', $upcomingDate)
                                          ->where('status', 'Pending')
                                          ->where('userid', $userId)
                                          ->get();
    
        foreach ($upcomingPayments as $payment) {
            Log::info('Upcoming payment for booking ID: ' . $payment->bookingid . ' (User ID: ' . $userId . ')');
        }
    
        return response()->json([
            'message' => 'Users notified about upcoming payments',
            'payments' => $upcomingPayments 
        ]);
    }
}
