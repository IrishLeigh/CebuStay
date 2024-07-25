import React, { useState } from "react";
import "../../css/ReviewsAndRatings.css";

const ReviewsAndRatingsMultiUnit = () => {
  const [selectedUnit, setSelectedUnit] = useState("Unit 1");
  const [review, setReview] = useState({
    name: "John Doe",
    date: "2024-07-01",
    rating: 4,
    text: "In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before the final copy is available.",
    unit: "Unit 1", // Added unit field
  });
  const [newReview, setNewReview] = useState({
    name: "",
    rating: 0,
    text: "",
    date: new Date().toISOString().split("T")[0],
    unit: "Unit 1", // Added unit field
  });

  const handleAddReview = () => {
    if (newReview.rating > 0 && newReview.text && newReview.name) {
      setReview({ ...newReview });
      setNewReview({
        name: "",
        rating: 0,
        text: "",
        date: new Date().toISOString().split("T")[0],
        unit: selectedUnit, // Ensure new review includes the selected unit
      });
    }
  };

  return (
    <>
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
      <div className="review-unit">
        <span>
          <strong>Reviewed:</strong> {review.unit}
        </span>{" "}
        {/* Display unit */}
      </div>
      <div className="review-text">{review.text}</div>
      {/* <div className="add-review">
          <h3>Add a Review for {selectedUnit}</h3>
          <TextField
            label="Your Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newReview.name}
            onChange={(e) =>
              setNewReview({ ...newReview, name: e.target.value })
            }
          />
          <TextField
            label="Rating (1-5)"
            type="number"
            InputProps={{ inputProps: { min: 1, max: 5 } }}
            variant="outlined"
            fullWidth
            margin="normal"
            value={newReview.rating}
            onChange={(e) =>
              setNewReview({ ...newReview, rating: Number(e.target.value) })
            }
          /> */}
      {/* <TextField
            label="Write your review here..."
            variant="outlined"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={newReview.text}
            onChange={(e) =>
              setNewReview({ ...newReview, text: e.target.value })
            }
          /> */}
      {/* <FormControl fullWidth variant="outlined" margin="normal"> */}
      {/* <InputLabel>Unit/Room</InputLabel> */}
      {/* <Select
              value={selectedUnit}
              onChange={(e) => {
                setSelectedUnit(e.target.value);
                setNewReview({ ...newReview, unit: e.target.value });
              }}
              label="Unit/Room"
            >
              <MenuItem value="Unit 1">Unit 1</MenuItem>
              <MenuItem value="Unit 2">Unit 2</MenuItem>
               Add more MenuItems for additional units/rooms 
            </Select> */}
      {/* </FormControl> */}
      {/* <Button variant="contained" color="primary" onClick={handleAddReview}>
            Submit
          </Button> */}
      {/* </div> */}
    </>
  );
};

export default ReviewsAndRatingsMultiUnit;
