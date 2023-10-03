import React, { useState } from 'react'
import Avatar from 'react-avatar-edit'

import "../css/editprofile.css";

function UploadProfile({closeModal}) {
    const [src, setSrc] = useState(null);
    const [preview, setPreview] = useState(null);

    const onClose =() => {
        setPreview(null)
    }

    const onCrop =(view) => {
        setPreview(view)
    }

    const exitModal = () => {
        closeModal()
    }

  return (
    <div className="div">
        <div className='crop-container'>
            <Avatar>
                width={200}
                height={100}
                onCrop={onCrop}
                onClose={onClose}
                src={src}
            </Avatar>
        </div>
    </div>
    
  )
}

export default UploadProfile