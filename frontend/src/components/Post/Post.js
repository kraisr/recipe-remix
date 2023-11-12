import React, { useState, useEffect } from "react";
import "./post.css";
import StarRating from "../StarRating/StarRating";
import { FacebookShareButton, TwitterShareButton, WhatsappShareButton, FacebookIcon, TwitterIcon, WhatsappIcon, EmailShareButton, EmailIcon, LinkedinShareButton, LinkedinIcon, PinterestShareButton, PinterestIcon } from "react-share";

const Post = ({ postId }) => {
  const [post, setPost] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);

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

    // Function to handle share modal toggle
    const toggleShareModal = () => {
      setShowShareModal(!showShareModal);
    };
  
    // Function to render share modal
    const renderShareModal = () => {
      if (!post) return null;
      const url = `http://localhost:3000/community/${postId}`;
  
      const header = post.name + "\n\nINGREDIENTS\n";
      const content = header + post.ingredients.join("\n") + `\n\nPreview dish at: ${post.image}\n\nView on Recipe Remix at: ${url}`;
      const twitter = header + post.ingredients.join(", ").substring(0, 50) + `...\n\nPreview dish at: ${post.image}\n\nView entire recipe at:`;
  
      return (
        <div className="share-modal">
          <TwitterShareButton title={twitter} url={url} via="RecipeRemix">
            <TwitterIcon size={32} round />  
          </TwitterShareButton> 
          <EmailShareButton subject={post.name} body={content}>
            <EmailIcon size={32} round />
          </EmailShareButton>
          <PinterestShareButton media={post.image} description={content} url={url}>
            <PinterestIcon size={32} round />
          </PinterestShareButton>
        </div>
      );
    };

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
        <button onClick={toggleShareModal} className="share-button">Share</button>
        {showShareModal && renderShareModal()}
        <StarRating postId={postId} />
      </div>
    ) : null
  );
};


export default Post;