<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\ReviewsAndRating;
use App\Models\Booking;
use App\Models\BookingHistory;

class ReviewsAndRatingsController extends CORS
{
    /**
     * Create a new amenity for a property.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function insertReviewsAndRating(Request $request)
    {
        $this->enableCors($request);

        $review = new ReviewsAndRating();

        // $review->rid = $request->input('rid');
        $review->userid = $request->input('userid');
        $review->propertyid = $request->input('propertyid');
        //check first is user has a booking or has booked in the property in Booking model if yes then proceed with rating if not return
        //use the Booking and BookingHistory model to look for a record that has the userid and propertyid

        $booking = Booking::where('userid', $review->userid)->where('propertyid', $review->propertyid)->get();
        $bookingHistory = BookingHistory::where('userid', $review->userid)->where('propertyid', $review->propertyid)->get();
        if ($booking->isEmpty() && $bookingHistory->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'User has not made a booking or booked in the property.',
            ], 404);
        }

        $review->bhid = $request->input('bhid');
        $review->rating = $request->input('rating');
        $review->review = $request->input('review');
        if ($request->input('unitname')) {
            $review->unitname = $request->input('unitname');
        }
        $review->save();
        $find_booking = BookingHistory::where('bhid', $review->bhid)->first();
        $find_booking->isreview = true;
        $find_booking->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Review created successfully.',
            'houseRule' => $review,
        ]);
    }

    public function getReviewsAndRatingByReviewId(Request $request)
    {
        $this->enableCors($request);
        $reviews = null;

        // Check if 'rid' is present in the request
        if ($request->input('rid')) {
            $rid = $request->input('rid');

            $reviews = DB::table('reviewsandratings')
                ->join('users', 'reviewsandratings.userid', '=', 'users.userid')
                ->where('reviewsandratings.rid', $rid)
                ->select(
                    'reviewsandratings.rid',
                    'reviewsandratings.userid',
                    'reviewsandratings.rating',
                    'reviewsandratings.review',
                    'reviewsandratings.unitname',
                    'reviewsandratings.created_at',
                    'users.firstname',
                    'users.lastname'
                )
                ->get();
        } else if ($request->input('bhid')) {
            $bhid = $request->input('bhid');

            $reviews = DB::table('reviewsandratings')
                ->join('users', 'reviewsandratings.userid', '=', 'users.userid')
                ->where('reviewsandratings.bhid', $bhid)
                ->select(
                    'reviewsandratings.rid',
                    'reviewsandratings.userid',
                    'reviewsandratings.rating',
                    'reviewsandratings.review',
                    'reviewsandratings.unitname',
                    'reviewsandratings.created_at',
                    'users.firstname',
                    'users.lastname'
                )
                ->get();
        }

        // Check if $reviews is null or empty
        if (is_null($reviews) || $reviews->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No reviews found for the given ID.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'reviews' => $reviews,
        ]);
    }


    public function getAllReviewsAndRatings(Request $request)
    {
        $this->enableCors($request);

        $propertyId = $request->input('propertyid');

        $reviews = DB::table('reviewsandratings')
            ->join('users', 'reviewsandratings.userid', '=', 'users.userid')
            ->select(
                'reviewsandratings.rid',
                'reviewsandratings.userid',
                'reviewsandratings.propertyid',
                'reviewsandratings.rating',
                'reviewsandratings.review',
                'reviewsandratings.unitname',
                'reviewsandratings.created_at',
                'users.firstname',
                'users.lastname'
            )
            ->where('reviewsandratings.propertyid', $propertyId)
            ->get();

        //calculate the average of column rating in $reviews and put it in $propertyrating
        $propertyrating = $reviews->avg('rating');

        if ($reviews->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No reviews found for the specified property.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'propertyrating' => $propertyrating,
            'reviews' => $reviews,
        ]);
    }
    public function getUserReviewsAndRatings(Request $request)
    {
        $this->enableCors($request);
        $userid = $request->input('userid');

        $reviews = ReviewsAndRating::where('userid', $userid)->get();

        if ($reviews->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No reviews found for the specified user.',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'reviews' => $reviews,
        ]);
    }
}
