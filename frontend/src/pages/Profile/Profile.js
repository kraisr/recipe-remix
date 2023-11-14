import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import "./profile.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../../state";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import StarIcon from '@material-ui/icons/Star';
import CommentIcon from '@material-ui/icons/Comment';


//components
import EditProfile from "../../components/EditProfile/EditProfile";
import UploadProfile from "../../components/EditProfile/UploadProfile"
import Logout from "../../components/Logout/Logout"


const Profile = () => {
  const [userEmail, setUserEmail] = useState('');

  const [image, setImage] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [link, setLink] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

  const [userStats, setUserStats] = useState([]);

  const handlePostClick = (postId) => {
    navigate(`/community/${postId}`);
  };

  function formatLink(url) {
    if (!url) {
      return '#';
    }
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    } else {
      return `http://${url}`;
    }
  }

  const handleLogoutClick = () => {
    // Logout logic
    dispatch(setLogout());
    Navigate("/");
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  const handleEditPost = (postId) => {
    // Logic to edit the post
  };

  const handleDeletePost = (postId, postName) => {
    setPostToDelete({ id: postId, name: postName });
    setShowDeleteDialog(true);
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


  const DeleteConfirmationDialog = () => (
    <div style={{ /* Your styles for the dialog */ }}>
      <p>Are you sure you want to delete "{postToDelete?.name}"?</p>
      <button onClick={() => confirmDelete()}>Yes</button>
      <button onClick={() => setShowDeleteDialog(false)}>No</button>
    </div>
  );

  const confirmDelete = (postId) => {
    handlePostDeletion(postId);
    setShowDeleteDialog(false);
    setPostToDelete(null);
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const toggleModal = () => {
    setEditModal(true);
  }

  const applyChanges = (data) => {
    // Update the profile data
    setName(data.firstName);
    // setName(data.name);
    setUsername(data.username);
    setBio(data.bio);
    setLink(data.link);
    setImage(data.image);
  }

  const toggleLogoutModal = () => {
    setLogoutModal(!logoutModal); // Toggle the logout modal state
  }

  useEffect(() => {
    const fetchName = async (userId) => {
      try {
        const token = userId || localStorage.getItem('token');
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
        applyChanges(data);
        setUserEmail(data.email);

      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };

    fetchName(userId);
  }, [userId]);

  useEffect(() => {
    const fetchUserPosts = async (userId) => {
      try {
        const token = userId || localStorage.getItem('token');
        if (!token) {
          throw Error('No token found');
        }

        const response = await fetch("http://localhost:8080/posts/fetch-user-posts", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.posts && Array.isArray(data.posts)) {
          // Check if data.posts is an array before setting the state
          setPosts(data.posts);
          setUserStats(data);
        } else {
          console.error('Invalid posts data received:', data.posts);
        }

      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts(userId);
  }, [userId]);

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
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container">
      {showDeleteDialog && (
        <DeleteConfirmationModal
          onClose={() => setShowDeleteDialog(false)}
          onConfirm={confirmDelete}
          postName={postToDelete?.name}
          postId={postToDelete?.id}
        />
      )}
      <div className="left-container">
        <div className="user-profile-card">
          <div className="profile-picture">
          
            {image ? (
              <img src={image} alt="Profile Picture" />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}

          </div>
          <div className="profile-info">
            <h2 className="user-name">{name}</h2>
            <div className="user-statistics">
              <div className="stat-item">
                <span className="stat-value">{userStats.totalPosts}</span>
                <span className="stat-label">Posts</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userStats.averageRatingAcrossAllPosts}</span>
                <span className="stat-label">Rating</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">{userStats.totalRatingsCount}</span>
                <span className="stat-label">Ratings</span>
              </div>
            </div>
            <p className="user-bio">{bio}</p>
            <a href={formatLink(link)} className="user-link" target="_blank" rel="noopener noreferrer">{link}</a>
            
          </div>
          <div className="edit-profile" onClick={toggleModal}>
            {!userId && (<h3>Edit Profile</h3>)}
          </div>
          {editModal && (
            <EditProfile
              closeModal={setEditModal}
              applyChanges={applyChanges}
              profileData={{ name, username, bio, link, image }}
            />
          )}
        </div>
      </div>
      <div className="center-container">
        <div className="post-title">
          {!userId ? (<h4>My Posts</h4>) : (<h4>Posts</h4>)}
        </div>
        <div className="post-grid-container">
        <div className="post-grid">
          {posts.map((post, index) => (
            <div className="post">
              <div className="image-wrapper" onClick={() => handlePostClick(post._id)}>
                <img
                  className="post-image"
                  src={post.image}
                  alt={`Post ${index}`}
                />
                <div className="middle-icon">
                  <div className="rating-comments">
                    <div className="rating">
                      <StarIcon style={{ color: 'yellow' }} />
                      <span style={{color: 'white'}}>{post.averageRating}</span>
                    </div>
                    <div className="comments">
                      <CommentIcon style={{ color: 'white' }} />
                      <span style={{color: 'white'}}>{post.commentCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        </div>
      </div>
      <div className="right-container"></div>
    </div>
  );
};

export default Profile;