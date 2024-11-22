import React, { useEffect, useState } from 'react';
import './ReviewsRatings.css';
import { FaStar, FaRegStar, FaStarHalfAlt, FaUsers, FaSortNumericDown, FaChartBar, FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import axios from 'axios';
import { useUser } from '../../../../../components/UserProvider';
import ArrowRight from "@mui/icons-material/Send";
import Divider from "@mui/material/Divider";
import { Paper } from '@mui/material';

const dummyReviews = [
  {
    firstname: "John",
    lastname: "Doe",
    created_at: "2024-11-01T10:00:00Z",
    rating: 5,
    review: "Fantastic product! Highly recommend to anyone looking for quality.",
    isPositive: true,
  },
  {
    firstname: "Jane",
    lastname: "Smith",
    created_at: "2024-11-15T14:30:00Z",
    rating: 4,
    review: "Great value for money, but could use some minor improvements.",
    isPositive: true,
  },
  {
    firstname: "Robert",
    lastname: "Brown",
    created_at: "2024-10-30T08:20:00Z",
    rating: 3,
    review: "It’s okay. Does the job but not exceptional.",
    isPositive: false,
  },
  {
    firstname: "Emily",
    lastname: "Johnson",
    created_at: "2024-11-05T12:15:00Z",
    rating: 5,
    review: "Exceeded my expectations! Great service and product quality.",
    isPositive: true,
  },
  {
    firstname: "Michael",
    lastname: "Lee",
    created_at: "2024-11-07T16:45:00Z",
    rating: 2,
    review: "Not satisfied with the quality. I had higher expectations.",
    isPositive: false,
  },
  {
    firstname: "Sarah",
    lastname: "Wilson",
    created_at: "2024-11-19T11:00:00Z",
    rating: 4,
    review: "Good product, but delivery took longer than expected.",
    isPositive: true,
  },
  {
    firstname: "David",
    lastname: "Taylor",
    created_at: "2024-11-10T09:10:00Z",
    rating: 1,
    review: "Terrible experience. Would not recommend.",
    isPositive: false,
  },
  {
    firstname: "Sophia",
    lastname: "Martinez",
    created_at: "2024-11-20T18:00:00Z",
    rating: 5,
    review: "Absolutely love it! Will buy again for sure.",
    isPositive: true,
  },
];

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
  const [reviews, setReviews] = useState(dummyReviews);
  const [view, setView] = useState('All'); // Tab view: All, Latest, Oldest
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;

  // Filtered reviews based on view (e.g., "Latest", "Oldest", "All")
  let filteredReviews = dummyReviews;

  if (view === "Latest") {
    filteredReviews = dummyReviews.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  } else if (view === "Oldest") {
    filteredReviews = dummyReviews.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
  }

  // Pagination logic
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = filteredReviews.slice(indexOfFirstReview, indexOfLastReview);

  const nextPage = () => {
    if (currentPage < Math.ceil(filteredReviews.length / reviewsPerPage)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };




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
        const res = await axios.get(`http://127.0.0.1:8000/api/getallreviewsandratings`, {
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
        await axios.post('http://127.0.0.1:8000/api/reviewsandratings', {
          userid: user.userid,
          propertyid: propertyId,
          rating,
          review: comment
        });
        // Refetch the reviews after successful submission
        const res = await axios.get('http://127.0.0.1:8000/api/getallreviewsandratings', {
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

  // const filteredReviews = (view === 'All' ? reviews :
  //   view === 'Latest' ? [...reviews].sort((a, b) => new Date(b.date) - new Date(a.date)) :
  //     [...reviews].sort((a, b) => new Date(a.date) - new Date(b.date))
  // );


  return (
    <div id="reviews-and-ratings">
        <Paper sx={{ padding: "1.5rem", borderRadius: "0.8rem", width: "100%" }}>
      <div className="info-title-cntr">
        <FaArrowRight sx={{ color: "#16B4DD" }} />
        <div>Reviews And Ratings</div>
      </div>
      <Divider sx={{ width: "100%", color: "#ccc", margin: "20px 0" }} />

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
          <p className="average-number">{averageRating}</p>
          <div className="average-rating">
            {[...Array(Math.floor(averageRating))].map((_, index) => (
              <FaStar key={index} className="average-star filled" />
            ))}
            {averageRating % 1 !== 0 && <FaStarHalfAlt className="average-star filled" />}
            {[...Array(5 - Math.ceil(averageRating))].map((_, index) => (
              <FaRegStar key={index} className="average-star"style={{ marginBottom:'1.5rem'}} />
            ))}
          </div>
          <p>Based on {reviews.length} reviews</p>
        </div>

        <div className="summary-box">
  <FaChartBar className="summary-icon" />
  <h3>Rating Distribution</h3>
  <div className="star-distribution">
    {[5, 4, 3, 2, 1].map((star) => (
      <div key={star} className="star-distribution-item">
        <div className="star-row">
          <span className="star-rating">{star} star</span>
          <div className="star-visual">
            {[...Array(star)].map((_, idx) => (
              <FaStar key={idx} className="star filled" />
            ))}
            {[...Array(5 - star)].map((_, idx) => (
              <FaRegStar key={idx} className="star" />
            ))}
          </div>
        </div>
        <span className="star-count">{ratingsCount[star] || 0}</span>
      </div>
    ))}
  </div>
</div>


      </div>


      <div className="tabs" style={{ backgroundColor: "white" }}>
        <button className={`tab-button ${view === "All" ? "active" : ""}`} onClick={() => setView("All")}>
          All
        </button>
        <button className={`tab-button ${view === "Latest" ? "active" : ""}`} onClick={() => setView("Latest")}>
          Latest
        </button>
        <button className={`tab-button ${view === "Oldest" ? "active" : ""}`} onClick={() => setView("Oldest")}>
          Oldest
        </button>
      </div>

      <div className="reviews-list-container">
        <h2 className="reviews-title" style={{ textAlign: "center" }}>
          {view} Reviews
        </h2>
        <div className="reviews-list">
          {currentReviews.map((review, index) => (
            <div key={index} className={`review-card ${review.isPositive ? "positive" : "negative"}`}>
              <div className="review-header">
                <div className="review-avatar">
                  {`${review.firstname?.charAt(0) || ""}${review.lastname?.charAt(0) || ""}`}
                </div>
                <div className="review-info">
                  <div className="review-name">{review.firstname} {review.lastname}</div>
                  <div className="review-location">Unknown Location</div>
                </div>
                <div className="review-date">Reviewed: {new Date(review.created_at).toLocaleDateString()}</div>
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
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            className="prev-button"
            onClick={prevPage}
            disabled={currentPage === 1}
            style={{
              backgroundColor: "#16B4DD",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              fontSize: "16px",
              marginRight: "10px",
            }}
          >
            <FaArrowLeft /> Preview
          </button>
          <button
            className="next-button"
            onClick={nextPage}
            disabled={currentPage === Math.ceil(filteredReviews.length / reviewsPerPage)}
            style={{
              backgroundColor: "#16B4DD",
              color: "white",
              padding: "10px 20px",
              borderRadius: "5px",
              border: "none",
              cursor: currentPage === Math.ceil(filteredReviews.length / reviewsPerPage) ? "not-allowed" : "pointer",
              fontSize: "16px",
            }}
          >
            Next <FaArrowRight />
          </button>
        </div>
      </div>
    </Paper>
  </div>
  
  );
};

export default ReviewsAndRatingsSingleUnit;
