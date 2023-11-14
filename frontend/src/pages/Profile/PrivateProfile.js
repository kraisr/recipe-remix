import React from 'react';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import './privateProfile.css';

const PrivateProfile = () => {
  return (
    <div className="private-profile">
      <VisibilityOffIcon style={{ fontSize: '10rem' }} />
      <p className="private-profile-text">Private Profile</p>
    </div>
  );
};

export default PrivateProfile;
