import React, { useEffect, useState } from "react";
import "../../css/ReviewsAndRatings.css";
import axios from "axios";

const ReviewsAndRatingsSingleUnitss = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    text: "",
    date: new Date().toISOString().split("T")[0],
  });

  const fetchData = async () => {
    try {
      const res = await axios.get(
        `https://whitesmoke-shark-473197.hostingersite.com/api/getallreviewsandratings`
      );
      console.log("reviews", res.data);
      setReviews(res.data.reviews); // Set the reviews from the response
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <div className="reviews-container">
        {reviews.map((review, index) => (
          <div key={index} className="review">
            <div className="review-header">
              <span className="review-name">{`${review.firstname} ${review.lastname}`}</span>
              <div className="review-rating">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`star ${i < review.rating ? "filled" : ""}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="review-text">{review.review}</div>
          </div>
        ))}
      </div>
      {/* <div className="add-review">
        <h3>Add a Review</h3>
        <input
          type="text"
          value={newReview.name}
          onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
          placeholder="Your Name"
        />
        <input
          type="number"
          min="1"
          max="5"
          value={newReview.rating}
          onChange={(e) => setNewReview({ ...newReview, rating: Number(e.target.value) })}
          placeholder="Rating (1-5)"
        />
        <textarea
          value={newReview.text}
          onChange={(e) => setNewReview({ ...newReview, text: e.target.value })}
          placeholder="Write your review here..."
        />
        <button onClick={handleAddReview}>Submit</button>
      </div> */}
    </>
  );
};

export default ReviewsAndRatingsSingleUnit;
