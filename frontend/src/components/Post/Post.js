import React, { useState, useEffect } from "react";
import "./post.css";


const Post = ({ postId }) => {
  console.log('post id in POST: ', postId);
  const [post, setPost] = useState(null);

  useEffect(() => {
    console.log('postId:', postId);
    async function fetchPostData() {
      try {
        const response = await fetch(`http://localhost:8080/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setPost(data);
        console.log('data32: ', data);
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
      <div className="recipe-content">
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
      </div>
    ) : null  // Return null if post is not set yet
  );
};


export default Post;