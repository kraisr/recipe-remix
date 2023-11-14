import React from 'react';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff'; // Importing the icon

const PrivateProfile = () => {
  return (
    <div className="private-profile">
      <VisibilityOffIcon style={{ fontSize: 40 }} />
      <p className="private-profile-text">Private Profile</p>
    </div>
  );
};

export default PrivateProfile;
