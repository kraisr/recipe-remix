import { useRef, useEffect, useState } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import "./post.css";
import StarRating from "../StarRating/StarRating";
import {
  TwitterShareButton,
  TwitterIcon,
  EmailShareButton,
  EmailIcon,
  PinterestShareButton,
  PinterestIcon
} from "react-share";
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';

const Post = ({ postId, isOwner, onDelete }) => {
  const [post, setPost] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [posts, setPosts] = useState([]);
  const { userId } = useParams();

  const dropdownRef = useRef(null);

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const closeDropdown = () => setShowDropdown(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        closeDropdown();
      }
    };

    // Bind the event listener
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // These are the handlers for the menu items
  const handleEditClick = () => {
    // Add your edit logic here
    setShowDropdown(false); // hide the menu
  };
  
  const handleDeleteClick = () => {
    setShowDropdown(false); // hide the dropdown menu
    setPostToDelete(post); // store the post to delete
    setShowDeleteDialog(true); // show the delete confirmation dialog
  };
  
  // Function to render the dropdown menu
  const renderDropdownMenu = () => (
    <div ref={dropdownRef} className="dropdown-menu">
      <div className="dropdown-menu-item" onClick={handleEditClick}>Edit</div>
      <div className="dropdown-menu-item" onClick={handleDeleteClick}>Delete</div>
    </div>
  );

  const DeleteConfirmationDialog = () => (
    <div style={{ /* Your styles for the dialog */ }}>
      <p>Are you sure you want to delete "{postToDelete?.name}"?</p>
      <button onClick={() => confirmDelete()}>Yes</button>
      <button onClick={() => setShowDeleteDialog(false)}>No</button>
    </div>
  );

  const confirmDelete = async (postId) => {
    if (postToDelete && postToDelete.id) {
      handlePostDeletion(postId);
      setShowDeleteDialog(false); // hide the confirmation dialog
      setPostToDelete(null); // reset the post to delete
    }
  };

  const handlePostDeletion = async (postId) => {

    const requestBody = {
      postId: postId,
    };

    console.log('Sending:', requestBody);

    try {
      const token = userId || localStorage.getItem('token');
      if (!token) {
        throw Error('No token found');
      }
      const requestBody = {
        postId: postId,
      };
      const response = await fetch(`http://localhost:8080/posts/delete-user-posts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      setPosts(posts.filter((post) => post._id !== postId));
      console.log("new posts: ", posts);
      onDelete(postId); // Call the deletion callback

    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const DeleteConfirmationModal = ({ onClose, onConfirm, postName, postId }) => (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000,
      borderRadius: '30px',
      opacity: 1,
    }}>
      <div style={{
        backgroundColor: 'rgb(222, 237, 250)',
        padding: '3%',
        borderRadius: '30px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minWidth: '20%',
        minHeight: '30%',
      }}>
        <h3 style={{ padding: '30px' }}>Are you sure you want to delete "{postName}"?</h3>
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div style={{
            width: '100%',
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <button
              className="delete-confirmation-button cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="delete-confirmation-button delete"
              onClick={() => onConfirm(postId)}
            >
              Delete
            </button>
          </div>        </div>
      </div>
    </div>
  );
  
  useEffect(() => {
    setIsBookmarked(false);
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
    checkIfBookmarked();
  }, [postId]);

  const checkIfBookmarked = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw Error('No token found');
      }
      const response = await fetch(`http://localhost:8080/posts/is-bookmarked`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ postId: postId })
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log(data);
      setIsBookmarked(data.isBookmarked);
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

  const handleBookmark = async () => {
    setIsBookmarked(!isBookmarked);
    // Make a request to your backend to bookmark or unbookmark the post
    if (isBookmarked) {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw Error('No token found');
        }
        const response = await fetch(`http://localhost:8080/posts/remove-bookmark`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ postId: postId })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response);
      } catch (error) {
        console.error('Error fetching post:', error);
      }

    } else {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw Error('No token found');
        }
        const response = await fetch(`http://localhost:8080/posts/bookmark-post`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
          body: JSON.stringify({ postId: postId })
        });
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        console.log(response);
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    }
  };

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

  const RecipeDifficulty = ({ difficultyLevel }) => {
    let color;
    switch (difficultyLevel) {
      case "Beginner Friendly":
        color = "green";
        break;
      case "Intermediate Cook":
        color = "orange";
        break;
      case "Master Chef":
        color = "red";
        break;
      default:
        color = "black"; // Default color
    }

    return (
      <span className="diffculty-span" style={{ color: color }}>
        {difficultyLevel}
      </span>
    );
  };

  return (
    post ? (  // Check if post is not null
      <div className="recipe-content2">
        {/* Dropdown menu for post owners */}
        {isOwner && (
          <div className="post-owner-menu">
            <button onClick={toggleDropdown} className="three-dots-button">...</button>
            {showDropdown && renderDropdownMenu()}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        {showDeleteDialog && (
      <DeleteConfirmationModal
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        postName={postToDelete?.name}
        postId={postToDelete?.id}
      />
    )}

        <div className="name-container">
          <h1>{post.name}</h1>
        </div>

        <div className="image-container">
          <img src={post.image} alt={post.name} className="recipe-image" />
        </div>

        <div className="difficulty-container">
          <span className="window-title">Difficulty:</span>
          <RecipeDifficulty difficultyLevel={post.difficulty} />
        </div>

        <div className="tags-container">
          <span className="window-title">Tags:</span>
          {post.tags.map((category, index) => (
            <div key={index} className="tag-bubble">
              {category}
            </div>
          ))}
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

        <div className="bottom-container">
          <button onClick={handleBookmark} className="bookmark-button">
            {isBookmarked ? <BookmarkIcon /> : <BookmarkBorderIcon />}
          </button>

          <button onClick={toggleShareModal} className="share-button">
            <center>
              <svg className="share-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30" width="20px" height="20px">
                <path d="M 23 3 A 4 4 0 0 0 19 7 A 4 4 0 0 0 19.09375 7.8359375 L 10.011719 12.376953 A 4 4 0 0 0 7 11 A 4 4 0 0 0 3 15 A 4 4 0 0 0 7 19 A 4 4 0 0 0 10.013672 17.625 L 19.089844 22.164062 A 4 4 0 0 0 19 23 A 4 4 0 0 0 23 27 A 4 4 0 0 0 27 23 A 4 4 0 0 0 23 19 A 4 4 0 0 0 19.986328 20.375 L 10.910156 15.835938 A 4 4 0 0 0 11 15 A 4 4 0 0 0 10.90625 14.166016 L 19.988281 9.625 A 4 4 0 0 0 23 11 A 4 4 0 0 0 27 7 A 4 4 0 0 0 23 3 z" />
              </svg>
            </center>
          </button>
          {showShareModal && renderShareModal()}
        </div>
        <StarRating postId={postId} />
      </div>
    ) : null
  );
};


export default Post;