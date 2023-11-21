import React, { useState, useEffect } from "react";

const CommentSection = ({ postId }) => {
  const [comments, setComments] = useState([]);

  useEffect(() => {
    // Fetch comments for the given postId
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setComments(data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    // Call the fetchComments function
    fetchComments();
  }, [postId]);

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <p>{comment.text}</p>
          <p>{comment.createdAt}</p>
        </div>
      ))}
    </div>
  );
};

export default CommentSection;