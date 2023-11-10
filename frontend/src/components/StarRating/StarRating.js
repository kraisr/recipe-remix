import React, { useState, useEffect } from 'react';
import './starRating.css';

const StarRating = ({ postId }) => {
  const [currentRating, setCurrentRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(undefined);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/posts/fetch-user-rating`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ postId: postId }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const responseData = await response.json();
        if (responseData.rating) {
          setCurrentRating(responseData.rating);
        }
      } catch (error) {
        console.error('Error fetching rating:', error);
      }
    };

    if (postId) {
      fetchRating();
    }
  }, [postId]);

  const submitRating = async (ratingValue) => {
    const payload = { postId, rating: ratingValue };

    try {
      const response = await fetch('http://localhost:8080/posts/add-rating', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(payload),
      });
      // console.log('postId: ', postId);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Rating submitted:', responseData);
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleStarClick = (ratingValue) => {
    setCurrentRating(ratingValue);
    submitRating(ratingValue);
  };

  const handleStarHover = (ratingValue) => {
    setHoverRating(ratingValue);
  };

  const handleStarHoverOut = () => {
    setHoverRating(undefined);
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
