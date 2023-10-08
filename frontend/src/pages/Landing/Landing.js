import "./landing.css";
import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Slider from "../../components/Slider";

const Landing = ({setLoggedIn}) => {
    const navigate = useNavigate();

    const handleRegisterClick = () => {
        navigate("/Register");
    };
    
    const handleLoginClick = () => {
        navigate("/Login");
    };

    return (
        <div className="landing-container">
            <div className="landing-nav">
                <h2>Recipe Remix</h2>
                <Link to="/" style={{ textDecoration: "none" , color: "black" }}>
                    <h2>About</h2>
                </Link>
                <div className="landing-nav-button" >
                    <button type="button" class="landing-login" onClick={handleLoginClick}>
                        Login
                    </button>
                    <button type="button" class="landing-signup" onClick={handleRegisterClick}>
                        Sign Up
                    </button>
                </div>
            </div>

            <div className="landing-center-container">
                <h2>Find Recipes you can make, 
                    Fast and Simple
                </h2>
            </div>

            

            <div className="landing-bottom-container">
                <Slider />
            </div>
        </div>
    )
}
export default Landing;