import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import "./profile.css";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setLogout } from "../../state";
import { v4 as uuidv4 } from 'uuid'; // Import the uuid library
import VisibilityIcon from '@material-ui/icons/Visibility';


//components
import EditProfile from "../../components/EditProfile/EditProfile";
import UploadProfile from "../../components/EditProfile/UploadProfile"
import Logout from "../../components/Logout/Logout"


const Profile = () => {
  const [image, setImage] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [link, setLink] = useState(null);
  const[selectedImage, setSelectedImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const [logoutModal, setLogoutModal] = useState(false);
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const { userId } = useParams();

  const handlePostClick = (postId) => {
    navigate(`/community/${postId}`);
  };

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
        if (data && Array.isArray(data)) {
          // Check if data.posts is an array before setting the state
          setPosts(data);
        } else {
          console.error('Invalid posts data received:', data);
        }

      } catch (error) {
        console.error('Error fetching user posts:', error);
      }
    };

    fetchUserPosts(userId);
  }, [userId]);

  const handlePostDeletion = async (postId) => {
    try {

      const token = userId || localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await fetch(`http://localhost:8080/user/delete-post`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(postId),
      });

      if (!response.ok) {
        throw new Error('Failed to delete the post');
      }

      // Update the posts state after successful deletion
      setPosts(posts.filter((post) => post._id !== postId));
      console.log("new posts: ", posts);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="container">
      <div className="left-container">
        <div className="user-profile-header">
          {!name ? (
            <h2>User's Profile</h2>
          ) : (
            <h2>{name}'s Profile</h2>
          )}
        </div>

        <div className="user-profile-card">
          <div className="card-options" onClick={toggleDropdown} ref={dropdownRef}>
            {!userId && (<i className="fas fa-ellipsis-h"></i>)}
            {dropdownOpen && (
              <div className="card-dropdown-menu">
                <Link to="/settings" className="card-dropdown-item">Settings</Link>
                <Link to="/preferences" className="card-dropdown-item">Preferences</Link>
                <Link to="/help" className="card-dropdown-item">Help</Link>
                <Link className="card-dropdown-item" onClick={toggleLogoutModal}>Logout</Link>
              </div>
            )}
          </div>
          {logoutModal && <Logout closeModal={toggleLogoutModal} isOpen={logoutModal} />}

          <div className={`${!image ? "profile-picture" : " uploaded-pfp"}`} onClick={toggleModal}>
            {image ? (
              <img src={image} alt="Profile Picture" />
            ) : (
              <i className="fa-solid fa-user"></i>
            )}
          </div>

          <div className="profile-info">
            <div className="profile-field">
              <span className="field-label">Name</span>
              <span className="field-value">{name}</span>
            </div>
            <hr className="field-divider" />
            <div className="profile-field">
              <span className="field-label">Bio</span>
              <span className="field-value">{bio}</span>
            </div>
            <hr className="field-divider" />
            <div className="profile-field">
              <span className="field-label">Link</span>
              <span className="field-value">{link}</span>
            </div>
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
                  <VisibilityIcon style={{ fontSize: 40, color: 'white' }} />
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
