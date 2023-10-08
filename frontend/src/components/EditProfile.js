import React, { useState, useEffect } from 'react'
import "../css/editprofile.css";


//components
import UploadProfile from "./UploadProfile"


function EditProfile({closeModal, applyChanges, profileData}) {
  const [editModal, setEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(profileData.image !== null && typeof profileData.image === 'object' ? '' : profileData.image || '');
  const [name, setName] = useState(profileData.name !== null && typeof profileData.name === 'object' ? '' : profileData.name || '');
  const [username, setUsername] = useState(profileData.username !== null && typeof profileData.username === 'object' ? '' : profileData.username || '');
  const [bio, setBio] = useState(profileData.bio !== null && typeof profileData.bio === 'object' ? '' : profileData.bio || '');
  const [link, setLink] = useState(profileData.link !== null && typeof profileData.link === 'object' ? '' : profileData.link || '');


  const toggleModal = () => {
    setEditModal(true);
  }

  const exitModal = () => {
    closeModal()
  }

  const handleImageChange = (image) => {
    setSelectedImage(image);
  }

  const handleNameChange = (event) => {
    setName(event.target.value);
  }
  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  }
  const handleBioChange = (event) => {
    setBio(event.target.value);
  }
  const handleLinkChange = (event) => {
    setLink(event.target.value);
  }

  const handleApplyChanges = () => {
    // Pass the updated data to the parent component
    applyChanges({ name, username, bio, link, selectedImage });
    closeModal();
  }

  return (
    <div className="modal-background">
        <div className="modal-container">

            <div className="title">
                <h1>Edit Profile</h1>
            </div>

            <div className="body">
              <div className="profile-pic-section">
                  <div className={`${!selectedImage ? "picture": " "}`} onClick={toggleModal}>
                    {selectedImage ? (
                        <img src={selectedImage} alt="Profile Picture" />
                      ) : (
                        <i className="fa-solid fa-user"></i>
                    )}
                  </div>

                   {editModal && <UploadProfile closeModal={setEditModal} onImageChange={handleImageChange}/>}

                  <div className="picture-text">
                      <p>Change profile picture</p>
                  </div>
              </div>

              <div className="user-info">
                <div className="name">
                  <p>Name</p>
                  <input type="text" onChange={handleNameChange} value={name}/>
                </div>

                <div className="username">
                  <p>username</p>
                  <input type="text" onChange={handleUsernameChange} value={username}/>
                </div>

                <div className="bio">
                  <p>bio</p>
                  <input type="text" onChange={handleBioChange} value={bio}/>
                </div>

                <div className="Link" >
                  <p>Link</p>
                  <input type="text" onChange={handleLinkChange} value={link}/>
                </div>
              </div>

            </div>

            <div className="footer">
                <div className="cancel" onClick={exitModal}>Cancel</div>
                <div className="apply" onClick={handleApplyChanges}>Apply Changes</div>
            </div>
        </div>
    </div>
  )
}

export default EditProfile