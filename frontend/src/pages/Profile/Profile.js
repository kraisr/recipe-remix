import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import "./profile.css";


//components
import EditProfile from "../../components/EditProfile/EditProfile";
import UploadProfile from "../../components/EditProfile/UploadProfile"


const Profile = () => {

  const [image, setImage] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const [name, setName] = useState(null);
  const [username, setUsername] = useState(null);
  const [bio, setBio] = useState(null);
  const [link, setlink] = useState(null);

  const toggleModal = () => {
    setEditModal(true);
  }

  const applyChanges = (data) => {
    // Update the profile data
    setName(data.name);
    setUsername(data.username);
    setBio(data.bio);
    setlink(data.link);
    setImage(data.selectedImage)
  }

  useEffect(() => {
    const fetchUserName = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch("http://localhost:8080/user/user", 
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`  // Add this line to include the token in the request header
          },
          method: "GET",
        });
  
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
  
        const data = await response.json();
        setName(data.firstName);
      } catch (error) {
        console.error('Error fetching user name:', error);
      }
    };
  
    fetchUserName();
  }, []);
  

 
    return(
        <div className="container">
            
            <div className="left-container">
                <div className="user-profile-header">
                    {!name ? (
                        <h2>User's Profile</h2>
                    ): (
                        <h2>{name}'s Profile</h2>
                    )}
                    
                </div>

                <div className="user-profile-card">
                    <div className="pfp-container">
                        
                    <div className={`${!image ? "profile-picture": " uploaded-pfp"}`} onClick={toggleModal}>
                    {image ? (
                        <img src={image} alt="Profile Picture" />
                      ) : (
                        <i className="fa-solid fa-user"></i>
                    )}
                  </div>
                        
                    </div>
                    

                    <div className="profile-info">
                        <div className="profile-field">
                        <span className="field-label">Name</span>
                        <span className="field-value">{name}</span>
                        </div>
                        <hr class="field-divider" />
                        
                        <div className="profile-field">
                        <span className="field-label">Bio</span>
                        <span className="field-value">{bio}</span>
                        </div>
                        <hr class="field-divider" />
                        
                        <div className="profile-field">
                        <span className="field-label">Link</span>
                        <span className="field-value">{link}</span>
                        </div>
                    </div>

                    <div className="edit-profile" onClick={toggleModal}>
                        <h3>Edit Profile</h3>
                    </div>

                    {editModal && <EditProfile 
                                    closeModal={setEditModal} 
                                    applyChanges={applyChanges}
                                     profileData={{ name, username, bio, link, image }}
                                    />}
                </div>
                
            </div>
            <div className="center-container">
        
            </div>
            <div className="right-container">
                
            </div>
        </div>
        
    )
}

export default Profile;