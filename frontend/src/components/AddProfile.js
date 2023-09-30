import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom"
import "../css/profile.css";

const AddProfile = () => {
    const [image, setImage] = useState("");
    const inputFile = useRef(null);

    var binaryData = [];
    binaryData.push(image);
      
    const handleFileUpload = e => {
        console.log("test");
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
        inputFile.current.click(handleFileUpload);
    };

    return (
        <div className="pfp-container">
            <div className="profile-picture">
            <img
                alt="not found"
                width={"10px"}
                height={"50px"}
                src={window.URL.createObjectURL(new Blob(binaryData, {type: "application/zip"}))}
                />           
            </div>
            <div className="add-pic" onClick={onButtonClick}>
                <i class="fa-solid fa-camera"></i>
            </div>

            <div className="remove-pic" onClick={() => setImage(null) }>
                <i class="fa-solid fa-trash"></i>
            </div>
        </div>
        
    )
}

export default AddProfile;