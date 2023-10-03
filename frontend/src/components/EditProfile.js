import React, { useState } from 'react'
import "../css/editprofile.css";

//components
import UploadProfile from "./UploadProfile"


function EditProfile({closeModal}) {
  const [editModal, setEditModal] = useState(false);

  const toggleModal = () => {
    setEditModal(true);
  }

  const exitModal = () => {
    closeModal()
  }
  return (
    <div className="modal-background">
        <div className="modal-container">
            <button onClick={exitModal}>
              X
            </button>

            <div className="title">
                <h1>Edit Profile</h1>
            </div>

            <div className="body">
              <div className="profile-pic-section">
                  <div className="picture" onClick={toggleModal}>
                    {/* <i className="fa-solid fa-user"></i> */}
                    <UploadProfile></UploadProfile>
                  </div>

                  {/* {editModal && <UploadProfile closeModal={editModal}/>} */}

                  <div className="picture-text">
                      <p>Change profile picture</p>
                  </div>
              </div>

              <div className="user-info">
                <div className="name">
                  <p>Name</p>
                  <input type="text" />
                </div>

                <div className="username">
                  <p>username</p>
                  <input type="text" />
                </div>

                <div className="bio">
                  <p>bio</p>
                  <input type="text" />
                </div>

                <div className="Link">
                  <p>Link</p>
                  <input type="text" />
                </div>
              </div>

            </div>

            <div className="footer">
                <div className="cancel" onClick={exitModal}>Cancel</div>
                <div className="apply" onClick={exitModal}>Apply Changes</div>
            </div>
        </div>
    </div>
  )
}

export default EditProfile