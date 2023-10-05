import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "./logout.css"

const Logout = () => {
    
    return (
        <div className="logout-modal">
            <div className="logout-confirmation">
                <h3>Are you sure you want to logout?</h3>
            </div>
            <div className="logout-buttons">
                <div className="lg-cancel button-17"><h4>Cancel</h4></div>
                <div className="lg-logout button-17"><h4>Logout</h4></div>
            </div>
        </div>
    )
}

export default Logout