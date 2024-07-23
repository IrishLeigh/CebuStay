import React, { useState } from "react";
import "../../css/ReviewsAndRatings.css";
import ArrowRight from "@mui/icons-material/Send";
import { Divider } from "@mui/material";

const ReviewsAndRatingsSingleUnit = () => {
  const [review, setReview] = useState({
    name: "John Doe",
    date: "2024-07-01",
    rating: 4,
    text: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.",
  });
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    text: "",
    date: new Date().toISOString().split("T")[0],
  });

  const handleAddReview = () => {
    if (newReview.rating > 0 && newReview.text && newReview.name) {
      setReview({ ...newReview });
      setNewReview({
        name: "",
        rating: 0,
        text: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  };

  return (
    <>
      <div
        style={{
          width: "100%",
          height: "0.1rem",
          boxSizing: "border-box",
          margin: "20px 0", // Adds top and bottom margin of 20px
          padding: 0,
          backgroundColor: "#A334CF",
        }}
      >
        {/* Design is still not Sure */}
      </div>
      <div className="review-container">
        <div className="info-title-cntr">
          <ArrowRight sx={{ color: "#16B4DD" }} />
          <div>Review And Rating</div>
        </div>
        <Divider sx={{ width: "100%", color: "#ccc", margin: "20px 0" }} />{" "}
        {/* Adds spacing before the divider */}
        <div className="review-header">
          <span className="review-name">{review.name}</span>
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
        <div className="review-text">{review.text}</div>
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
      </div>
    </>
  );
};

export default ReviewsAndRatingsSingleUnit;
