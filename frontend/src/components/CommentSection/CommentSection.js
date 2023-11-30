import React, { useState, useEffect } from "react";
import ReplySection from "../CommentSection/ReplySection";
import "./commentsection.css";

const CommentSection = ({ postId, currentUserId }) => {
  const [commentId, setCommentId] = useState("");
  const [comments, setComments] = useState([]);
  const [reply, setReply] = useState("");
  const [showReplyInputForComment, setShowReplyInputForComment] = useState(null);
  const [replies, setReplies] = useState({});
  
  

  useEffect(() => {
    // Fetch comments for the given postId
    const fetchComments = async () => {
      try {
        const response = await fetch(`http://localhost:8080/posts/${postId}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const responseUser = await fetch("http://localhost:8080/user/user", {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          method: "GET",
        });

        if (!responseUser.ok) {
          throw new Error('Network response was not ok');
        }
        const userData = await responseUser.json();
 
        const data = await response.json();
        
        // Get the user's liked comments
        const likedCommentIds = userData.likedComments.map(comment => comment._id);
        const unlikedCommentIds = userData.dislikedComments.map(comment=>comment._id);

        // Update comments with isLiked property
        const updatedComments = data.comments.map(comment => ({
          ...comment,
          isLiked: likedCommentIds.includes(comment._id),
          isUnliked: unlikedCommentIds.includes(comment._id),
        }));

        console.log("updated: ", updatedComments);
  
        setComments(updatedComments);
        console.log("rating: ", comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };
    

    // Call the fetchComments and fetchCurrentUserProfile functions
    fetchComments();
  }, [postId, currentUserId]);

  const fetchRepliesForComment = async (commentId) => {
    try {
      const response = await fetch(`http://localhost:8080/posts/${commentId}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Update replies state, using the commentId as the key
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: data.replies,
      }));
    } catch (error) {
      console.error('Error fetching replies:', error);
    }
  };
  
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
      setComments((prevComments) => prevComments.filter(comment => comment._id !== commentId));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };
  

  const handleLikeComment = async (commentId, userId) => {
    try {
      // Check if the comment is already liked or unliked by the user
      const isLiked = comments.find(comment => comment._id === commentId)?.isLiked || false;
      const isUnliked = comments.find(comment => comment._id === commentId)?.isUnliked || false;
      let flag = false;
      if (isLiked && !isUnliked) {
        
        await unlikeComment(commentId, flag);
      } else if (!isLiked && isUnliked) {
        comments.find(comment => comment._id === commentId).rating++; 
        await likeComment(commentId, flag);
      }else if (isLiked) {
        
        await unlikeComment(commentId);
      } else {
        
        console.log("hehere");
        flag = true;
        await likeComment(commentId, flag);
      }
  
      // Fetch updated comments and user data
      // await fetchComments();
      await fetchUser();
  
    } catch (error) {
      console.error('Error liking/disliking comment:', error);
    }
  };

  const likeComment = async (commentId, flag) => {
    // Make a request to like the comment
    const updateUserData = {
      commentId: commentId,
    };
  
    const response = await fetch(`http://localhost:8080/user/like-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateUserData)
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    // Update the local state to toggle isLiked and update the rating
    setComments((prevComments) =>
      prevComments.map(comment =>
        comment._id === commentId
          ? { ...comment, isLiked: true, isUnliked: false, rating: comment.rating + 1 }
          : comment
      )
    );
  
    // Update the comment rating on the server
    if(!flag){
      await updateCommentRating(commentId, 2);
    } else{
      await updateCommentRating(commentId, 1);
    }
  };
  
  const unlikeComment = async (commentId, flag) => {
    // Make a request to remove it from liked comments
    const response = await fetch(`http://localhost:8080/user/unlike-comment`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ commentId })
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    // Update the local state to toggle isLiked and update the rating
    setComments((prevComments) =>
        prevComments.map(comment =>
            comment._id === commentId
                ? { ...comment, isLiked: false, isUnliked: false, rating: comment.rating - 1 }
                : comment
        )
    );

    // Update the comment rating on the server
    await updateCommentRating(commentId, -1);
};


  const removeUnlikeComment = async (commentId, flag) => {
    // Make a request to remove it from liked comments
    const response = await fetch(`http://localhost:8080/user/remove-dislike`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ commentId })
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    // Update the local state to toggle isLiked and update the rating
    setComments((prevComments) =>
      prevComments.map(comment =>
        comment._id === commentId
          ? { ...comment, isLiked: false, isUnliked: false, rating: comment.rating + 1 }
          : comment
      )
    );
  
    // Update the comment rating on the server
    await updateCommentRating(commentId, 1);
  };

  const handleDislikeComment = async (commentId, userId) => {
    try {
      // Check if the comment is already liked or unliked by the user
      const isLiked = comments.find(comment => comment._id === commentId)?.isLiked || false;
      const isUnliked = comments.find(comment => comment._id === commentId)?.isUnliked || false;
      let flag = false;
      if (isUnliked && !isLiked) {
        // If already liked, make a request to remove it from liked comments
        // flag = true;
        console.log("testing");
        await removeUnlikeComment(commentId, flag);
      } else if (!isUnliked && isLiked) {
        comments.find(comment => comment._id === commentId).rating--; 
        await dislikeComment(commentId, flag);
      }else if (isUnliked) {
        // If already unliked, make a request to remove it from unliked comments
        await removeUnlikeComment(commentId);
      } else {
        // If not liked or unliked, make a request to like the comment
        console.log("hehere");
        flag = true;
        await dislikeComment(commentId, flag);
      }
  
      // Fetch updated comments and user data
      // await fetchComments();
      await fetchUser();
  
    } catch (error) {
      console.error('Error liking/disliking comment:', error);
    }
  };

  const dislikeComment = async (commentId, flag) => {
    // Make a request to like the comment
    const updateUserData = {
      commentId: commentId,
    };
  
    const response = await fetch(`http://localhost:8080/user/dislike-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updateUserData)
    });
  
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  
    // Update the local state to toggle isLiked and update the rating
    setComments((prevComments) =>
      prevComments.map(comment =>
        comment._id === commentId
          ? { ...comment, isLiked: false, isUnliked: true, rating: comment.rating - 1 }
          : comment
      )
    );
  
    // Update the comment rating on the server
    if(flag){
      await updateCommentRating(commentId, -1);
    } else{
      await updateCommentRating(commentId, -2);
    }
    
  };
  
  // Function to update comment rating on the server
  const updateCommentRating = async (commentId, ratingChange) => {
    try {
      const response = await fetch(`http://localhost:8080/posts/update-comment-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ commentId, ratingChange }),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error updating comment rating on the server:', error);
    }
  };
  
  
  

  const delete_all_likes = async () => {
    try {
      const response = await fetch(`http://localhost:8080/user/delete-all-comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        
      });

      const data = await response.json();
      console.log(data);
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
    } catch (error) {
      console.error('Error liking/disliking comment:', error);
    }
  }

  
  const handleReplyClick = (commentId) => {
    setShowReplyInputForComment(commentId);
  };

  const handleCommentChange = (event) => {
    setReply(event.target.value);
  };



  const handleReplySubmit = async (commentId) => {
    try {
      setCommentId(commentId);
  
      const replyData = {
        commentId: commentId,
        postId: postId,
        username: currentUserId,
        text: reply,
      };
  
      // Make the POST request
      const response = await fetch(`http://localhost:8080/posts/add-reply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(replyData)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const responseData = await response.json();
      console.log("Reply added successfully:", responseData);
  
      // Update the local state with the new reply
      setReplies((prevReplies) => ({
        ...prevReplies,
        [commentId]: [...(prevReplies[commentId] || []), responseData.reply],
      }));
  
      // Clear the reply input and hide it for the specific comment
      setReply("");
      setShowReplyInputForComment(null);
      window.location.reload();
    } catch (error) {
      console.error('Error adding reply to comment:', error);
    }

  };
  

  const handleCancelButton = () => {
      setReply("");
      setShowReplyInputForComment(false);
  }

  return (
    <div className="comment-section">
      <h2>Comments</h2>
      {comments.map((comment) => (
      <div key={comment._id} className="comment-item">
        <p className="comment-text"><b>{comment.username}</b></p>
        <div className="comment-text-section">
          <i
            className={`fa-thumbs-up ${comment.isLiked ? 'fa-solid' : 'fa-regular'}`}
            onClick={() => handleLikeComment(comment._id, currentUserId)}
          ></i>
          <p className="comment-rating">{comment.rating}</p>
          <i
            className={`fa-thumbs-down ${comment.isUnliked ? 'fa-solid' : 'fa-regular'}`}
            onClick={() => handleDislikeComment(comment._id, currentUserId)}
          ></i>
        </div>
        <p className="comment-text">{comment.text}</p>

        <h1 style={{ fontSize: '15px', cursor: 'pointer' }} onClick={() => handleReplyClick(comment._id)}>
          Reply
        </h1>
        {showReplyInputForComment === comment._id && (
            <div className="replying" style={{ fontSize: '20px', cursor: 'pointer' }}>
              <form action="/form/submit" method="POST">
                <textarea 
                  className="comment"
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                />
                <br/>
              </form>

              <div style={{ position:'relative' }} className="submit-cancel-reply">
                <button className="button-44  comment-cancel-btn" onClick={handleCancelButton}>Cancel </button>
                <button className="button-44  comment-submit-btn" onClick={() => handleReplySubmit(comment._id)}>Submit</button>
              </div>
            </div>
        )}
        
        <hr />

        <ReplySection
          postId={postId}
          currentUserId={currentUserId}
          commentId={comment._id}
          fetchReplies={fetchRepliesForComment}
          replies={replies[comment._id] || []}
        />
        
        {currentUserId === comment.username && (
          <button onClick={() => handleDeleteComment(comment._id)} className="button-44 deleteBtn">Delete</button>
        )}
      </div>
    ))}
    {/* <button onClick={delete_all_likes}>delete all</button> */}
    </div>
  );
};

export default CommentSection;