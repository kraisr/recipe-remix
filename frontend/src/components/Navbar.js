import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoImg from '../images/logo.png';


//components
import Logout from "./Logout";

const Navbar = () => {
    let [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [click, setClick] = useState(false);
    
    let submenuRef = useRef(null);

    const handleClick = () =>setClick(!click);

  const closeMobileMenu = () => setClick(false);

    const [button, setButton,] = useState(true);
    const showButton = () => {
      if(window.innerWidth <= 960){
        setButton(false);
      }else{
        setButton(true);
      }
    };
  
    window.addEventListener('resize', showButton);

    const toggleMenu = () => {
        if(isSubMenuOpen){
            isSubMenuOpen = false;
        }else{
            isSubMenuOpen = true;
            
        }
        setIsSubMenuOpen(isSubMenuOpen);
    };

    const toggleModal = () => {
        setEditModal(true);
        toggleMenu();
    }

    const handleOutsideClick = (event) => {
        const clickedElement = event.target;
        const isProfileImageClicked = (clickedElement && clickedElement.classList?.contains('profileImage')) || ((clickedElement && clickedElement.parentElement) && clickedElement.classList?.contains('corner-profile'));        
        if (isProfileImageClicked) {
            toggleMenu();
        }
        else {
            
            isSubMenuOpen = false;
            setIsSubMenuOpen(isSubMenuOpen);
        }   
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

                <div className={click ? 'nav-menu active' : 'nav-menu'}>
                    
                    
                    <Link to="/../pantry">
                        <h1 className="nav-links" onClick={closeMobileMenu}>Pantry</h1>
                    </Link>

                    <Link to="/">
                        <h1 className="nav-links" onClick={closeMobileMenu}>Recipes</h1>
                    </Link>

                    <Link to="/">
                        <h1 className="nav-links" onClick={closeMobileMenu}>Community</h1>
                    </Link>

                    <div className="profile-container nav-links">
                        <div className="profileImage">
                            <i className="fa-solid fa-user corner-profile"></i>
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

                                <Link to="/../profile" className="sub-menu-link" onClick={toggleModal}>
                                    <i className="fa-solid fa-user"></i>
                                    <p>Logout</p>
                                    <span>{'>'}</span>
                                </Link>

                                {editModal && <Logout />}

                            </div>
                        </div>
                    </div>
                </div>
                
                <div className='menu-icon' onClick={handleClick}>
                    <i className={click ? 'fas fa-times' : 'fas fa-bars'}></i>
                </div>
            </div>

            
        </nav>
    );
}

export default Navbar;