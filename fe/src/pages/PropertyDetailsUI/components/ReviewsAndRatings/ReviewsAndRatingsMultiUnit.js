import React, { useState, useEffect } from "react";
import "../../css/ReviewsAndRatings.css";
import {
  FaStar,
  FaRegStar,
  FaStarHalfAlt,
  FaUsers,
  FaChartBar,
  FaThumbsUp,
  FaThumbsDown,
} from "react-icons/fa";
import axios from "axios";
import { useUser } from "../../../../components/UserProvider";

// Function to generate dummy reviews
const generateDummyReviews = (count) => {
  const names = [
    "Charlie Davis",
    "Emma Frost",
    "George Hill",
    "Isabella Johnson",
    "Kevin Lee",
    "Liam Brown",
    "Sophia Clark",
    "James White",
    "Olivia Lewis",
    "Noah Walker",
    "Mia Harris",
    "Ethan Young",
    "Ava King",
    "Mason Wright",
    "Isabella Lopez",
    "Lucas Scott",
    "Charlotte Adams",
    "Jackson Nelson",
    "Amelia Carter",
    "Oliver Mitchell",
    "Harper Perez",
    "Henry Turner",
    "Ella Collins",
    "Sebastian Hall",
    "Zoe Rivera",
    "Leo Jenkins",
    "Aria Sanchez",
    "Jack Morris",
    "Lily Price",
    "Benjamin Morgan",
    "Nora Cooper",
    "Alexander Hughes",
    "Emily Bell",
    "William Murphy",
    "Abigail Kelly",
    "Daniel Ross",
    "Madison Cooper",
    "Matthew Bailey",
    "Ella Turner",
    "Michael Barnes",
    "Hannah Rivera",
    "James Martinez",
    "Grace Cooper",
    "David Lee",
    "Chloe Adams",
    "Gavin Thompson",
    "Addison Roberts",
    "Eli Johnson",
    "Sofia Martinez",
    "Samuel Anderson",
    "Evelyn Miller",
  ];

  const units = [
    "Unit 1A",
    "Unit 2B",
    "Unit 3C",
    "Unit 4D",
    "Unit 5E",
    "Unit 6F",
    "Unit 7G",
    "Unit 8H",
    "Unit 9I",
    "Unit 10J",
  ];

  const positiveComments = [
    "Excellent service!",
    "Had a great time!",
    "Very clean and well maintained.",
    "Loved the location.",
    "Would definitely recommend.",
    "Amazing experience!",
  ];

  const negativeComments = [
    "Not as expected.",
    "Could have been better.",
    "Poor service.",
    "Would not recommend.",
    "Needs improvement.",
    "Disappointing experience.",
  ];

  const reviews = [];
  for (let i = 0; i < count; i++) {
    const isPositive = Math.random() > 0.5; // Randomly decide if the comment is positive or negative
    const comments = isPositive ? positiveComments : negativeComments;
    const comment = comments[Math.floor(Math.random() * comments.length)];

    reviews.push({
      user: {
        initials: names[i][0] + names[i].split(" ")[1][0],
        name: names[i],
      },
      comment,
      rating: Math.floor(Math.random() * 5) + 1,
      date: new Date(
        Date.now() - Math.floor(Math.random() * 10000000000)
      ).toISOString(), // Random date within the last year
      unit: units[i % units.length], // Assign a unit to the review
      isPositive,
    });
  }
  return reviews;
};

const ReviewsAndRatingsMultiUnit = ({ propertyId }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState([]);
  const [view, setView] = useState("All"); // Tab view: All, Latest, Oldest
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [selectedUnit, setSelectedUnit] = useState("All"); // State for selected unit
  const [unit, setUnit] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const user = { initials: "AB", name: "Alex Brown" };
  const { user } = useUser();

  useEffect(() => {
    // Fetch reviews or use dummy data
    setReviews(generateDummyReviews(50));
  }, []);

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleRatingChange = (ratingValue) => setRating(ratingValue);

  // const handleSubmit = () => {
  //   if (comment && rating) {
  //     setReviews([
  //       ...reviews,
  //       {
  //         user,
  //         comment,
  //         rating,
  //         date: new Date().toISOString(),
  //         unit: `Unit ${reviews.length + 1}`,
  //         isPositive: rating >= 3,
  //       },
  //     ]);
  //     setComment("");
  //     setRating(0);
  //     setShowReviewForm(false); // Hide review form after submission
  //   }
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(
          `http://127.0.0.1:8000/api/getallreviewsandratings`,
          { params: { propertyid: propertyId } }
        );
        setReviews(res.data.reviews);
      } catch (err) {
        console.log(err);
      }
    };

    fetchReviews();
  }, [propertyId]);

  const handleSubmit = async () => {
    if (comment && rating) {
      try {
        await axios.post("http://127.0.0.1:8000/api/reviewsandratings", {
          userid: user.userid,
          propertyid: propertyId,
          rating,
          review: comment,
        });
        // Refetch the reviews after successful submission
        const res = await axios.get(
          "http://127.0.0.1:8000/api/getallreviewsandratings",
          {
            params: {
              propertyid: propertyId,
            },
          }
        );
        setReviews(res.data.reviews);
      } catch (err) {
        console.log(err);
      }

      setComment("");
      setRating(0);
      setShowReviewForm(false); // Hide review form after submission
      setErrorMessage("");
    } else {
      setErrorMessage("Please enter a comment and rating.");
      setTimeout(() => {
        setErrorMessage("");
      }, 3000);
    }
  };

  const handleCancel = () => {
    setComment("");
    setRating(0);
    setShowReviewForm(false); // Hide review form when cancel is pressed
  };

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;
  const ratingsCount = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const filteredReviews = reviews
    .filter((review) =>
      selectedUnit === "All" ? true : review.unitname === selectedUnit
    )
    .filter(
      (review) =>
        view === "All"
          ? true
          : view === "Latest"
          ? new Date(review.date) >=
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          : new Date(review.date) <
            new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Before the last 30 days
    )
    .sort((a, b) =>
      view === "Latest"
        ? new Date(b.date) - new Date(a.date)
        : new Date(a.date) - new Date(b.date)
    );

  return (
    <div className="outer-container">
      <div className="reviews-container">
        <div className="tabs">
          <button
            className={`tab-button ${view === "All" ? "active" : ""}`}
            onClick={() => setView("All")}
          >
            All
          </button>
          <button
            className={`tab-button ${view === "Latest" ? "active" : ""}`}
            onClick={() => setView("Latest")}
          >
            Latest
          </button>
          <button
            className={`tab-button ${view === "Oldest" ? "active" : ""}`}
            onClick={() => setView("Oldest")}
          >
            Oldest
          </button>
        </div>

        <div className="unit-dropdown-container">
          <select
            id="unit-select"
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
          >
            <option value="All">All Units</option>
            {Array.from(new Set(reviews.map((review) => review.unitname))).map(
              (unit, index) =>
                unit && (
                  <option key={index} value={unit}>
                    {unit}
                  </option>
                )
            )}
          </select>
        </div>

        <div className="reviews-list-container">
          <h2 className="reviews-title">{view} Reviews</h2>
          {/* <div className="reviews-list">
            {filteredReviews.map((review, index) => (
              <div
                key={index}
                className={`review-card ${
                  review.isPositive ? "positive" : "negative"
                }`}
              >
                <div className="review-header">
                  <div className="review-avatar">{review.user.initials}</div>
                  <div className="review-info">
                    <div className="review-name">{review.user.name}</div>
                    <div className="review-location">Unknown Location</div>
                  </div>

                  <div className="review-date">
                    Reviewed: {new Date(review.date).toLocaleDateString()}
                  </div>
                </div>
                <div className="review-content">
                  <div className="review-unit">
                    <span>
                      <strong>Unit:</strong> {review.unitname}
                    </span>
                  </div>
                  <div
                    className={`review-${
                      review.isPositive ? "positive" : "negative"
                    }`}
                  >
                    <span className="review-icon">
                      {review.isPositive ? "😊" : "😞"}
                    </span>{" "}
                    {review.comment}
                  </div>
                </div>
                <div className="review-footer">
                  <div className="review-rating">
                    {[...Array(review.rating)].map((_, idx) => (
                      <FaStar key={idx} className="star filled" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, idx) => (
                      <FaRegStar key={idx} className="star" />
                    ))}
                  </div>
                  <div className="review-buttons">
                    <button className="like-button">
                      <FaThumbsUp />
                    </button>
                    <button className="dislike-button">
                      <FaThumbsDown />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div> */}

          <div className="reviews-list">
            {filteredReviews.map((review, index) => (
              <div
                key={index}
                className={`review-card ${
                  review.isPositive ? "positive" : "negative"
                }`}
              >
                <div className="review-header">
                  <div className="review-avatar">{`${
                    review.firstname?.charAt(0) || ""
                  }${review.lastname?.charAt(0) || ""}`}</div>
                  <div className="review-info">
                    <div className="review-name">
                      {review.firstname} {review.lastname}
                    </div>
                    <div className="review-location">
                      <strong>Unit:</strong> {review.unitname}
                    </div>
                  </div>

                  <div className="review-date">
                    Reviewed: {formatDate(review.created_at)}
                  </div>
                </div>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, idx) => (
                    <FaStar key={idx} className="star filled" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, idx) => (
                    <FaRegStar key={idx} className="star" />
                  ))}
                </div>
                <div className="review-content">
                  <div>{review.review}</div>
                </div>
                <div className="review-footer">
                  {/* <div className="review-buttons">
                    <button className="like-button">
                      <FaThumbsUp />
                    </button>
                    <button className="dislike-button">
                      <FaThumbsDown />
                    </button>
                  </div> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsAndRatingsMultiUnit;
