import React, { useState } from 'react';
import './ReviewsRatings.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaUsers, FaSortNumericDown, FaChartBar } from 'react-icons/fa';

const generateDummyReviews = (count) => {
  const names = ['Charlie Davis', 'Emma Frost', 'George Hill', 'Isabella Johnson', 'Kevin Lee', 'Liam Brown', 'Sophia Clark', 'James White', 'Olivia Lewis', 'Noah Walker', 'Mia Harris', 'Ethan Young', 'Ava King', 'Mason Wright', 'Isabella Lopez', 'Lucas Scott', 'Charlotte Adams', 'Jackson Nelson', 'Amelia Carter', 'Oliver Mitchell', 'Harper Perez', 'Henry Turner', 'Ella Collins', 'Sebastian Hall', 'Zoe Rivera', 'Leo Jenkins', 'Aria Sanchez', 'Jack Morris', 'Lily Price', 'Benjamin Morgan', 'Nora Cooper', 'Alexander Hughes', 'Emily Bell', 'William Murphy', 'Abigail Kelly', 'Daniel Ross', 'Madison Cooper', 'Matthew Bailey', 'Ella Turner', 'Michael Barnes', 'Hannah Rivera', 'James Martinez', 'Grace Cooper', 'David Lee', 'Chloe Adams', 'Gavin Thompson', 'Addison Roberts', 'Eli Johnson', 'Sofia Martinez', 'Samuel Anderson', 'Evelyn Miller'];
  const reviews = [];
  for (let i = 0; i < count; i++) {
    reviews.push({
      user: { initials: names[i][0] + names[i].split(' ')[1][0], name: names[i] },
      comment: `This is review number ${i + 1}.`,
      rating: Math.floor(Math.random() * 5) + 1,
      date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toISOString() // Random date within the last year
    });
  }
  return reviews;
};

const ReviewsRatings = () => {
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [reviews, setReviews] = useState(generateDummyReviews(50));
  const [view, setView] = useState('All'); // Tab view: All, Latest, Oldest
  const [showReviewForm, setShowReviewForm] = useState(false);

  const user = { initials: 'AB', name: 'Alex Brown' };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleRatingChange = (ratingValue) => setRating(ratingValue);

  const handleSubmit = () => {
    if (comment && rating) {
      setReviews([
        ...reviews,
        { user, comment, rating, date: new Date().toISOString() }
      ]);
      setComment('');
      setRating(0);
      setShowReviewForm(false); // Hide review form after submission
    }
  };

  const handleCancel = () => {
    setComment('');
    setRating(0);
    setShowReviewForm(false); // Hide review form when cancel is pressed
  };

  const averageRating = (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1);
  const ratingsCount = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const filteredReviews = (view === 'All' ? reviews :
    view === 'Latest' ? [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)) :
    [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date))
  );

  return (
    <div className="outer-container">
      <div className="reviews-container">
        <div className="summary">
          <div className="summary-box">
            <FaUsers className="summary-icon" />
            <h3>Total Reviews</h3>
            <p className="summary-number">{reviews.length}</p>
            <p>People's experiences</p>
          </div>

              <div className="summary-box">
          <FaStar className="summary-icon" />
          <h3>Average Rating</h3>
          <div className="average-rating-container">
            <p className="average-number">{averageRating}</p>
            <div className="average-rating">
              {[...Array(Math.floor(averageRating))].map((_, index) => (
                <FaStar key={index} className="average-star filled" />
              ))}
              {averageRating % 1 !== 0 && <FaStarHalfAlt className="average-star filled" />}
              {[...Array(5 - Math.ceil(averageRating))].map((_, index) => (
                <FaRegStar key={index} className="average-star" />
              ))}
            </div>
          </div>
          <p>Based on {reviews.length} reviews</p>
        </div>

          <div className="summary-box">
          <FaChartBar className="summary-icon" />
            <h3>Rating Distribution</h3>
            <div className="star-distribution">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="star-distribution-item">
                  <span className="star-rating">{star} star</span>
                  <div className="star-visual">
                    {[...Array(star)].map((_, idx) => (
                      <FaStar key={idx} className="star filled" />
                    ))}
                    {[...Array(5 - star)].map((_, idx) => (
                      <FaRegStar key={idx} className="star" />
                    ))}
                  </div>
                  <span className="star-count">{ratingsCount[star] || 0}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="tabs">
          <button
            className={`tab-button ${view === 'All' ? 'active' : ''}`}
            onClick={() => setView('All')}
          >
            All
          </button>
          <button
            className={`tab-button ${view === 'Latest' ? 'active' : ''}`}
            onClick={() => setView('Latest')}
          >
            Latest
          </button>
          <button
            className={`tab-button ${view === 'Oldest' ? 'active' : ''}`}
            onClick={() => setView('Oldest')}
          >
            Oldest
          </button>
        </div>

        {showReviewForm && (
          <div className="review-input-container">
            <div className="review-input">
              <div className="rating">
                <div className="user-initials">{user.initials}</div>
                {[...Array(5)].map((_, index) => (
                  <span
                    key={index}
                    className={`star ${index < rating ? 'filled' : ''}`}
                    onClick={() => handleRatingChange(index + 1)}
                  >
                    <FaStar />
                  </span>
                ))}
              </div>
              <textarea
                placeholder="Write your review here..."
                value={comment}
                onChange={handleCommentChange}
              />
              <div className="buttons">
                <button className="submit" onClick={handleSubmit}>Submit</button>
                <button className="cancel" onClick={handleCancel}>Cancel</button>
              </div>
            </div>
          </div>
        )}

        <div className="write-review-button-container">
          <button className="write-review-button" onClick={() => setShowReviewForm(!showReviewForm)}>
            {showReviewForm ? 'Close Review Form' : 'Write a Review'}
          </button>
        </div>

        <div className="reviews-list-container">
          <h2 className="reviews-title">{view} Reviews</h2>
          <div className="reviews-list">
            {filteredReviews.map((review, index) => (
              <div key={index} className="review">
                <div className="user-info">
                  {/* <div className="user-initials">{review.user.initials}</div> */}
                  <div className="user-name">{review.user.name}</div>
                </div>
                <div className="review-rating">
                  {[...Array(review.rating)].map((_, idx) => (
                    <FaStar key={idx} className="star filled" />
                  ))}
                  {[...Array(5 - review.rating)].map((_, idx) => (
                    <FaRegStar key={idx} className="star" />
                  ))}
                </div>
                <div className="review-comment">{review.comment}</div>
                <button className="read-more">Read Review</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewsRatings;
