import React, { useState, useEffect } from "react"
import { Button } from "@mui/material";
import "./editProfile.css";
import { TextField } from '@mui/material';
//components
import UploadProfile from "./UploadProfile"
import uploadImageToS3 from "../UploadImagetoS3/UploadImagetoS3";

function EditProfile({closeModal, applyChanges, profileData}) {
  const [editModal, setEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(profileData.image !== null && typeof profileData.image === "object" ? "" : profileData.image || "");
  const [name, setName] = useState(profileData.name !== null && typeof profileData.name === "object" ? "" : profileData.name || "");
  const [username, setUsername] = useState(profileData.username !== null && typeof profileData.username === "object" ? "" : profileData.username || "");
  const [bio, setBio] = useState(profileData.bio !== null && typeof profileData.bio === "object" ? "" : profileData.bio || "");
  const [link, setLink] = useState(profileData.link !== null && typeof profileData.link === "object" ? "" : profileData.link || "");


  const toggleModal = () => {
    setEditModal(true);
  }

  const exitModal = () => {
    closeModal()
  }

  const handleImageChange = async (file) => {
    setSelectedImage(file);
    
  };

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

  //post request to server
  const postChanges = () => {

    const updatedData = {
      firstName: name,
      username: username,
      bio: bio,
      link: link,
      image: selectedImage,
    };

    // Make a POST request to update the user's profile
    fetch('http://localhost:8080/user/user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(updatedData)
    })
    .then(response => {
      console.log("server response:", response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // Assuming the response contains the updated user data
      return response.json();
    })
    .then(data => {
      // Update the profile data in the parent component
      console.log("data", data.user);
      applyChanges(data.user);
      closeModal();
    })
    .catch(error => {
      console.error('Error updating profile:', error);
      // Handle errors appropriately (e.g., display an error message to the user)
    });
  }

  const handleApplyChanges = () => {
    // Pass the updated data to the parent component
    //applyChanges({ name, username, bio, link, image: selectedImage });
    closeModal();
    
    postChanges();
    
  }

  const revertChange = () => {
    setSelectedImage(null);
  }

  const textFieldStyles = {
    bgcolor: "#ffffff",
    // width: '88%',
    "& label.Mui-focused": {
      color: "#000",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#a1c298",
      },
      "&:hover fieldset": {
        borderColor: "#88b083",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6b9466",
      },
    }
  };

  return (
    <div className="modal-background">
        <div className="modal-container-edit">

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
                  <div className="picture-text" onClick={revertChange}>
                      <p>Set to Default</p>
                  </div>
              </div>

              <div className="user-info">
                <div className="name">
                  <p>Name</p>
                  <TextField
                    variant="outlined"
                    onChange={handleNameChange}
                    value={name}
                    sx={textFieldStyles}
                  />
                </div>

                <div className="username">
                  <p>username</p>
                  <TextField
                    variant="outlined"
                    onChange={handleUsernameChange}
                    value={username}
                    sx={textFieldStyles}
                  />
                </div>

                <div className="bio">
                  <p>bio</p>
                  <TextField
                    variant="outlined"
                    onChange={handleBioChange}
                    value={bio}
                    sx={textFieldStyles}
                    multiline
                    rows={2}
                  />
                </div>

                <div className="Link" >
                  <p>Link</p>
                  <TextField
                    variant="outlined"
                    onChange={handleLinkChange}
                    value={link}
                    sx={textFieldStyles}
                  />
                </div>
              </div>

            </div>

            <div className="footer">
            <Button 
                    onClick={exitModal}
                    variant="contained"
                    sx={{
                        backgroundColor: "#fff",
                        color: "#3c4043",
                        borderRadius: "24px",
                        padding: "12px 30px",
                        fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                        fontSize: "14px",
                        fontWeight: 500,
                        textTransform: "none",
                        boxShadow: "rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px",
                        "&:hover": {
                            backgroundColor: "#f1f3f4",
                            boxShadow: "rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px",
                        },
                        "&:active": {
                            boxShadow: "0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%)",
                        },
                        "&:focus": {
                            borderColor: "#4285f4",
                            boxShadow: "rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px",
                        },
                        "&.Mui-disabled": {
                            boxShadow: "rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px",
                        },
                        mr: 2, // Add margin to the right of the button
                    }}
                >
                    Cancel
                </Button>

                <Button 
                    onClick={handleApplyChanges} 
                    variant="contained"
                    sx={{
                        backgroundColor: "#FA7070",
                        color: "#ffffff",
                        borderRadius: "24px",
                        padding: "12px 24px",
                        fontFamily: '"Google Sans", Roboto, Arial, sans-serif',
                        fontSize: "14px",
                        fontWeight: 500,
                        textTransform: "none",
                        boxShadow: "rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px",
                        "&:hover": {
                            backgroundColor: "#bc5050",
                            boxShadow: "rgba(60, 64, 67, .3) 0 2px 3px 0, rgba(60, 64, 67, .15) 0 6px 10px 4px",
                        },
                        "&:active": {
                            boxShadow: "0 4px 4px 0 rgb(60 64 67 / 30%), 0 8px 12px 6px rgb(60 64 67 / 15%)",
                        },
                        "&:focus": {
                            borderColor: "#4285f4",
                            boxShadow: "rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px",
                        },
                        "&.Mui-disabled": {
                            boxShadow: "rgba(60, 64, 67, .3) 0 1px 3px 0, rgba(60, 64, 67, .15) 0 4px 8px 3px",
                        },
                    }}
                >
                    Apply Changes
                </Button>
            </div>
        </div>
    </div>
  )
}

export default EditProfile