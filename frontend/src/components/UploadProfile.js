import React, { useState } from 'react';
import Avatar from 'react-avatar-edit';
import "../css/editprofile.css";
import logoImg from '../images/logo.png';

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
            <button onClick={exitModal}>
              X
            </button>
            <h2>Change Profile Picture</h2>
        </div>
      
      <div className='crop-container'>
        <Avatar
          width={390}
          height={295}
          onCrop={onCrop}
          onClose={onClose} 
          onBeforeFileLoad={onBeforeFileLoad}
          
        />
      </div>

      <button class="apply-pic-changes" onClick={() => handleApplyChanges()}>Apply Profile Picture</button>
    </div>
  );
}

export default UploadProfile;
