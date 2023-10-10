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
    const [isMenuOpen, setMenuOpen] = useState(false);

    const navRef = useRef(null);

useEffect(() => {
    function handleClickOutside(event) {
        if (navRef.current && !navRef.current.contains(event.target)) {
            setMenuOpen(false);
        }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
}, [navRef]);

    return (
        <div className="landing-container">
            <div className="landing-nav" ref={navRef}>
                <h2>Recipe Remix</h2>
                <div className="hamburger-menu" onClick={() => setMenuOpen(!isMenuOpen)}>
                ☰
                </div>
                <div className={`nav-content ${isMenuOpen ? 'show' : ''}`}>
                    <span className="close-menu" onClick={() => setMenuOpen(false)}>×</span>
                    <Link to="/" style={{ textDecoration: "none" , color: "black" }}>
                        <h2>About</h2>
                    </Link>
                    <div className="landing-nav-button" >
                        <button type="button" className="landing-login" onClick={handleLoginClick}>
                            Login
                        </button>
                        <button type="button" className="landing-signup" onClick={handleRegisterClick}>
                            Sign Up
                        </button>
                    </div>
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