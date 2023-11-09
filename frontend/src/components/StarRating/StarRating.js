import React, { useState } from 'react';
import './starRating.css';

const StarRating = () => {
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(undefined);


  const handleStarClick = (ratingValue) => {
    setCurrentRating(ratingValue);
  };

  const handleStarHover = (ratingValue) => {
    setHoverRating(ratingValue);
  };


  const handleStarHoverOut = () => {
    setHoverRating(undefined); // Reset hover rating
  };

  return (
    <div className="star-rating">
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;
        let style = {};
        if (hoverRating !== undefined) {
            style = ratingValue <= hoverRating ? { color: 'orange' } : {};
        } else {
            style = ratingValue <= currentRating ? { color: 'orange' } : {};
        }

        return (
          <span
            key={ratingValue}
            className="star"
            style={style}
            onClick={() => handleStarClick(ratingValue)}
            onMouseEnter={() => handleStarHover(ratingValue)}
            onMouseLeave={handleStarHoverOut}
          >
            &#9733;
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
