import React, { useState, useEffect } from "react";

const CommentSection = ({ postId, currentUserId }) => {
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
        console.log("comments: ", data.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    // Call the fetchComments function
    fetchComments();
    
    
  }, [postId]);

  const handleDeleteComment = async (commentId) => {
    try {
      // Make a DELETE request to your server to delete the comment
      const response = await fetch(`http://localhost:8080/posts/delete-comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          postId: postId,
          commentId: commentId
        })
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      // If the comment is successfully deleted, update the local state
      setComments((prevComments) => prevComments.filter(comment => comment.id !== commentId));
  
      // Reload the page
      window.location.reload();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      {comments.map((comment) => (
        <div key={comment.id} className="comment-item">
          <p>{comment.username}</p>
          <p>{comment.text}</p>
          {currentUserId === comment.username && (
            console.log("current user1: ", currentUserId),
            console.log("current user1: ", comment.userId),
            <button onClick={() => handleDeleteComment(comment._id)}>Delete</button>
          )}
        </div>
      ))}
    </div>
  );
};

export default CommentSection;