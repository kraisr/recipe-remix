import "../css/landing.css";
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
const Landing = () => {
    return (
        <div className="landing-container">
            <div className="landing-nav">
                <h2>Recipe Remix</h2>
                <Link to="/" style={{ textDecoration: 'none' , color: "black" }}>
                    <h2>About</h2>
                </Link>
                <div className="landing-nav-button" >
                    <button type="button" class="landing-login">
                        Login
                    </button>
                    <button type="button" class="landing-signup">
                        Sign Up
                    </button>
                </div>
            </div>

            <div className="landing-center-container">

            </div>

            <div className="landing-bottom-container">

            </div>
            <h2>
            Landing
            </h2>
        </div>
    )
}
export default Landing;