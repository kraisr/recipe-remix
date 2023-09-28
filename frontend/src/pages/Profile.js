import { Link } from "react-router-dom"
import "../css/profile.css";


const Profile = () => {
    return(
        <div className="container">
            
            <div className="left-container">
                <div className="user-profile-header">
                    <h1>Ryan's Profile</h1>
                </div>

                <div className="user-profile-card">
                    <div className="pfp-container">
                        <div className="profile-picture">
                            <i class="fa-solid fa-user"></i>
                        </div>

                        <div className="add-pic">
                            <i class="fa-solid fa-camera"></i>
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