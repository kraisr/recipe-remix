import React, { useState, useEffect } from "react";
import "./post.css";
import StarRating from "../StarRating/StarRating";

const Post = ({ postId }) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPostData() {
      try {
        const response = await fetch(`http://localhost:8080/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };

    if (postId) {
      fetchPostData();
    }
  }, [postId]);

  return (
    post ? (  // Check if post is not null
      <div className="recipe-content2">
        <div className="name-container">
          <h1>{post.name}</h1>
        </div>
  
        <div className="image-container">
          <img src={post.image} alt={post.name} className="recipe-image" />
        </div>
  
        <div className="ingredientLines-container">
          <div className="window-title">Ingredients:</div>
          <ul>
            {post.ingredients.map((line, index) => (
              <li key={index}>{line}</li>
            ))}
          </ul>
        </div>
  
        <div className="instructions-container">
          <div className="window-title">Caption:</div>
          <div className="instructions-list">
            {post.caption}
          </div>
        </div>
        <StarRating postId={postId} />
      </div>
    ) : null
  );
};


export default Post;