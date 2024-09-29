<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\ReviewsAndRating;
use App\Models\UserModel;

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
        $review->rating = $request->input('rating');
        $review->review = $request->input('review');
        if ($request->input('unitname')) {
            $review->unitname = $request->input('unitname');
        }
        $review->save();



        return response()->json([
            'status' => 'success',
            'message' => 'Review created successfully.',
            'houseRule' => $review,
        ]);
    }

    public function getReviewsAndRatingByReviewId(Request $request)
    {
        $this->enableCors($request);

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
                'users.firstname',
                'users.lastname'
            )
            ->get();

        if ($reviews->isEmpty()) {
            return response()->json([
                'status' => 'error',
                'message' => 'No reviews found for this review ID.',
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
