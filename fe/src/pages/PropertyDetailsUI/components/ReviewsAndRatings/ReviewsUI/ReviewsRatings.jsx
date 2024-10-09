import React, { useEffect, useState } from 'react';
import './ReviewsRatings.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaUsers, FaSortNumericDown, FaChartBar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import axios from 'axios';
import { useUser } from '../../../../../components/UserProvider';
import ArrowRight from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";
import { Paper } from '@mui/material';


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

const ReviewsAndRatingsSingleUnit = ({ propertyId, setRatingg }) => {
  const { user } = useUser();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  // const [reviews, setReviews] = useState(generateDummyReviews(50));
  const [reviews, setReviews] = useState([]);
  const [view, setView] = useState('All'); // Tab view: All, Latest, Oldest
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  // const user = { initials: 'AB', name: 'Alex Brown' };

  const handleCommentChange = (e) => setComment(e.target.value);

  const handleRatingChange = (ratingValue) => setRating(ratingValue);

  // const handleSubmit = () => {
  //   if (comment && rating) {
  //     setReviews([
  //       ...reviews,
  //       { user, comment, rating, date: new Date().toISOString() }
  //     ]);
  //     setComment('');
  //     setRating(0);
  //     setShowReviewForm(false); // Hide review form after submission
  //   }
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    };
    return date.toLocaleString('en-US', options);
  };



  useEffect(() => {
    
    const fetchData = async () => {
      try {
        const res = await axios.get(`https://whitesmoke-shark-473197.hostingersite.com/api/getallreviewsandratings`, {
          params: {
            propertyid: propertyId
          }
        });
        console.log("reviews", res.data);
        setRatingg(res.data.propertyrating);
        setReviews(res.data.reviews);
      } catch (err) {
        console.log(err);
      }
    };

    fetchData();
  }, []);

  const handleSubmit = async () => {
    if (comment && rating) {
      try {
        await axios.post('https://whitesmoke-shark-473197.hostingersite.com/api/reviewsandratings', {
          userid: user.userid,
          propertyid: propertyId,
          rating,
          review: comment
        });
        // Refetch the reviews after successful submission
        const res = await axios.get('https://whitesmoke-shark-473197.hostingersite.com/api/getallreviewsandratings', {
          params: {
            propertyid: propertyId
          }
        });
        setReviews(res.data.reviews);
      } catch (err) {
        console.log(err);
      }

      setComment('');
      setRating(0);
      setShowReviewForm(false); // Hide review form after submission
      setErrorMessage('');
    }
    else {
      setErrorMessage('Please enter a comment and rating.');
      setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }
  };

  const handleCancel = () => {
    setComment('');
    setRating(0);
    setShowReviewForm(false); // Hide review form when cancel is pressed
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;
  const ratingsCount = reviews.reduce((acc, review) => {
    acc[review.rating] = (acc[review.rating] || 0) + 1;
    return acc;
  }, {});

  const filteredReviews = (view === 'All' ? reviews :
    view === 'Latest' ? [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)) :
      [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date))
  );


  return (
    < div id = "reviews-and-ratings">
      
        <Paper sx={{padding: "1.5rem", borderRadius: "0.8rem", width : "100%"}}>
        <div className="info-title-cntr">
            <ArrowRight sx={{ color: "#16B4DD" }} />
            <div>Reviews And Ratings</div>
          </div>
          <Divider sx={{ width: "100%", color: "#ccc", margin: "20px 0" }} />{" "}
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

          {/* {showReviewForm && (
            <div className="review-input-container">
              <div className="review-input">
                <div className="rating">
                  <div className="user-initials">{`${user.firstname?.charAt(0) || ''}${user.lastname?.charAt(0) || ''}`}</div>
                  <div className="review-name">{user.firstname} {user.lastname}</div>

                </div>
                <div>
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
                {errorMessage && (
                  <p style={{ color: 'red' }}>{errorMessage}</p>
                )}
              </div>
            </div>
          )} */}

          {/* <div className="write-review-button-container">
            <button className="write-review-button" onClick={() => setShowReviewForm(!showReviewForm)}>
              {showReviewForm ? 'Close Review Form' : 'Write a Review'}
            </button>
          </div> */}

          <div className="reviews-list-container">
            <h2 className="reviews-title">{view} Reviews</h2>
            {/* <div className="reviews-list">
              {filteredReviews.map((review, index) => (
                <div key={index} className="review">
                  <div className="user-info">
                    <div className="user-name">{review.firstname} {review.lastname}</div>
                    <div>{formatDate(review.created_at)}</div>
                  </div>
                  <div className="review-rating">
                    {[...Array(review.rating)].map((_, idx) => (
                      <FaStar key={idx} className="star filled" />
                    ))}
                    {[...Array(5 - review.rating)].map((_, idx) => (
                      <FaRegStar key={idx} className="star" />
                    ))}
                  </div>
                  <div className="review-comment">{review.review}</div>
                  <button className="read-more">Read Review</button>
                </div>
              ))}
            </div> */}

            {/* Review Card */}
            <div className="reviews-list">
              {filteredReviews.map((review, index) => (
                <div
                  key={index}
                  className={`review-card ${review.isPositive ? "positive" : "negative"
                    }`}
                >
                  <div className="review-header">
                    <div className="review-avatar">{`${review.firstname?.charAt(0) || ''}${review.lastname?.charAt(0) || ''}`}</div>
                    <div className="review-info">
                      <div className="review-name">{review.firstname} {review.lastname}</div>
                      <div className="review-location">Unknown Location</div>
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
                    <div>
                      {review.review}
                    </div>
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
        </Paper>

    </div>
  );
};

export default ReviewsAndRatingsSingleUnit;
