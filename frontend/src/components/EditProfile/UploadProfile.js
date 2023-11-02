import React, { useState } from "react";
import Avatar from "react-avatar-edit";
import "./editProfile.css";
import logoImg from "../../images/logo.png";
import { Button } from "@mui/material";

function UploadProfile({ closeModal, onImageChange}) {
  const [src, setSrc] = useState(null); 
  const onClose = () => {
    setSrc(null); // Update the src state when the Avatar is closed
  }

  const onCrop = (preview) => {
    // Handle the cropped image preview
    setSrc(preview);
  }

  const onBeforeFileLoad = (elem) => {
    if (elem.target.files[0].size > 10000000) {
      alert("File is too big!");
      elem.target.value = "";
    }
  }

  const handleApplyChanges = () => {
    // Call the parent function to update the image
    onImageChange(src);
    closeModal();
  }

  const exitModal = () => {
    closeModal()
  }

  return (
    <div className="change-picture">
        <div className="top">
            <button className="exit" onClick={exitModal}>
              X
            </button>
            <h2>Change Profile Picture</h2>
        </div>
      
      <div className="crop-container">
        <div className="recipe-image">
          <Avatar
            width={390}
            height={295}
            onCrop={onCrop}
            onClose={onClose} 
            onBeforeFileLoad={onBeforeFileLoad}
            
          />
        </div>
        
      </div>

      <Button 
                    onClick={handleApplyChanges} 
                    variant="contained"
                    sx={{
                        backgroundColor: "#FA7070",
                        color: "#ffffff",
                        borderRadius: "24px",
                        padding: "12px 24px",
                        mb: "7%",
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
                    Apply
                </Button>    
                </div>
  );
}

export default UploadProfile;
