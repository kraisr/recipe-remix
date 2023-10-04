import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import "../css/profile.css";


//components
import EditProfile from "../components/EditProfile";
import UploadProfile from "../components/UploadProfile"


const Profile = () => {

  const [image, setImage] = useState(null);
  const [editModal, setEditModal] = useState(false);
  const inputFile = useRef(null);

  const toggleModal = () => {
    setEditModal(true);
  }

 
    return(
        <div className="container">
            
            <div className="left-container">
                <div className="user-profile-header">
                    <h1>User's Profile</h1>
                </div>

                <div className="user-profile-card">
                    <div className="pfp-container">
                        
                        <div className="profile-picture">
                            {image ? (
                                <img
                                    alt="not found"
                                    max-width={"5px"}
                                    height={"30px"}
                                    src={URL.createObjectURL(image)}
                                />
                            ) : (
                                <i className="fa-solid fa-user"></i>
                            )}          
                        </div>
                        
                        {/* <input
                            style={{ display: "none" }}
                            ref={inputFile}
                            onChange={handleFileUpload}
                            type="file"
                        /> */}
                        
                        {/* <div className="add-pic" onClick={onButtonClick}>
                            <i class="fa-solid fa-camera"></i>
                        </div>

                        <div className="remove-pic" onClick={() => setImage(null) }>
                            <i class="fa-solid fa-trash"></i>
                        </div> */}
                        
                    </div>
                    

                    <div className="profile-info">
                        <div className="name">
                            <h2>User's Name</h2>
                        </div>
                        <div className="bio-container">
                            <p>Test bio test etst testst</p>
                        </div>

                        <div className="link-container">
                            <p>Links</p>
                        </div>
                    </div>

                    <div className="edit-profile" onClick={toggleModal}>
                        <h3>Edit Profile</h3>
                    </div>

                    {editModal && <EditProfile closeModal={setEditModal}/>}
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