import React, { useState, useEffect } from "react";

import "./commentsection.css";

const ReplySection = ({ postId, currentUserId, commentId }) => {
  const [comments, setComments] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [reply, setReply] = useState("");
  const [showReplyInputForComment, setShowReplyInputForComment] = useState(null);
  const [replies, setReplies] = useState([]);
  

  useEffect(() => {
    // Fetch comments for the given postId
    const fetchComments = async () => {
      try {
        const replyData = {
            postId: postId,
            commentId: commentId, 
          };
        const response = await fetch(`http://localhost:8080/posts/fetch-reply`, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
              },
              method: "POST",
              body: JSON.stringify(replyData)
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("data!: ", data.comment);
        setReplies(data.comment.replies);
        
        
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    

    // Call the fetchComments and fetchCurrentUserProfile functions
    fetchComments();
  }, [postId, currentUserId]);
  
  // Fetch user function
  const fetchUser = async (userId) => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch("http://localhost:8080/user/user", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          method: "GET",
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        console.log("data ", data.likedComments);

      } catch (error) {
        console.error('Error fetching user name:', error);
      }
  };

  const handleDeleteComment = async (replyId) => {
    try {
        // Make a DELETE request to your server to delete the reply
        const response = await fetch(`http://localhost:8080/posts/delete-reply`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
                postId: postId,
                commentId: commentId,
                replyId: replyId,
            })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // If the reply is successfully deleted, update the local state
        setReplies((prevReplies) => prevReplies.filter(reply => reply._id !== replyId));
    } catch (error) {
        console.error('Error deleting reply:', error);
    }
};


  

  return (
    <div className="comment-section">
        {replies.map((reply) => (
            <div key={reply._id} className="comment-item">
              <p><b>{reply.username}</b></p>
              <p>{reply.text}</p>

              {currentUserId === reply.username && (
                <button onClick={() => handleDeleteComment(reply._id)} className="button-44 deleteBtn">Delete</button>
              )}
            </div>
            
        ))}

        

    </div>
  );
};

export default ReplySection;