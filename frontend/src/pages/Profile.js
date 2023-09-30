import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import "../css/profile.css";


//components
//import AddProfile from "../components/AddProfile";

const Profile = () => {

  const [image, setImage] = useState(null);
  const inputFile = useRef(null);

  const handleFileUpload = e => {
    const { files } = e.target;
    if (files && files.length) {
      const filename = files[0].name;

      var parts = filename.split(".");
      const fileType = parts[parts.length - 1];
      console.log("fileType", fileType); //ex: zip, rar, jpg, svg etc.

      setImage(files[0]);
    }
  };

  const onButtonClick = () => {
    inputFile.current.click();
  };

    
    return(
        <div className="container">
            
            <div className="left-container">
                <div className="user-profile-header">
                    <h1>User's Profile</h1>
                </div>

                <div className="user-profile-card">
                    <div className="pfp-container">
                        
                        <div className="profile-picture">
                        {image && (
                            <img
                                alt="not found"
                                width={"250px"}
                                src={URL.createObjectURL(image)}  // Check if image is not null
                            />
                        )}          
                        </div>

                        <input
                            style={{ display: "none" }}
                            // accept=".zip,.rar"
                            ref={inputFile}
                            onChange={handleFileUpload}
                            type="file"
                        />
                        
                        <div className="add-pic" onClick={onButtonClick}>
                            <i class="fa-solid fa-camera"></i>
                        </div>

                        <div className="remove-pic" onClick={() => setImage(null) }>
                            <i class="fa-solid fa-trash"></i>
                        </div>
                        
                    </div>
                    

                    <div className="profile-info">
                        <h2>user</h2>
                    </div>
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