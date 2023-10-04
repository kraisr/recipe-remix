import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoImg from '../images/logo.png';


//components
import Logout from "./Logout";

const Navbar = () => {
    let [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    let submenuRef = useRef(null);

    const toggleMenu = () => {
        if(isSubMenuOpen){
            isSubMenuOpen = false;
        }else{
            isSubMenuOpen = true;
            
        }
        setIsSubMenuOpen(isSubMenuOpen);
    };

    const handleOutsideClick = (event) => {
        const clickedElement = event.target;
        const isProfileImageClicked = (clickedElement && clickedElement.classList?.contains('profileImage')) || ((clickedElement && clickedElement.parentElement) && clickedElement.classList?.contains('fa-user'));        
        if (isProfileImageClicked) {
            toggleMenu();
        }
        else {
            
            isSubMenuOpen = false;
            setIsSubMenuOpen(isSubMenuOpen);
        }   
        //console.log(isSubMenuOpen);
    };

    useEffect(() => {
        document.addEventListener('click', handleOutsideClick);

        return () => {
            document.removeEventListener('click', handleOutsideClick);
        };
    }, []);

    return (
        <nav>
            <div className="container">
                <Link to="/">
                    <img alt="logo" src={logoImg}/>
                </Link>
                
                <Link to="/../pantry">
                    <h1>Pantry</h1>
                </Link>

                <Link to="/">
                    <h1>Recipes</h1>
                </Link>

                <Link to="/">
                    <h1>Community</h1>
                </Link>

                <div className="profile-container">
                    <div className="profileImage">
                        <i className="fa-solid fa-user"></i>
                    </div>

                    <div className={`sub-menu-wrap ${isSubMenuOpen ? 'open-menu' : ''}`} ref={submenuRef}>
                        <div className="sub-menu">
                            {/* <div className="user-info">
                                <h2>Test Name</h2>
                            </div>
                            <hr /> */}

                            <Link to="/../profile" className="sub-menu-link" onClick={toggleMenu}>
                                <i className="fa-solid fa-user"></i>
                                <p>Profile</p>
                                <span>{'>'}</span>
                            </Link>

                            <Link to="/../settings" className="sub-menu-link" onClick={toggleMenu}>
                                <i className="fa-solid fa-gear"></i>
                                <p>Settings</p>
                                <span>{'>'}</span>
                            </Link>

                            {/* <Link to="/../settings" className="sub-menu-link" onClick={toggleMenu}>
                                <i className="fa-solid fa-gear"></i>
                                <p>Preferences</p>
                                <span>{'>'}</span>
                            </Link> */}

                            <Link to="/../help" className="sub-menu-link" onClick={toggleMenu}>
                                <i className="fa-solid fa-user"></i>
                                <p>Help</p>
                                <span>{'>'}</span>
                            </Link>

                            <Link to="/../profile" className="sub-menu-link" onClick={toggleMenu}>
                                <i className="fa-solid fa-user"></i>
                                <p>Logout</p>
                                <span>{'>'}</span>
                            </Link>

                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;