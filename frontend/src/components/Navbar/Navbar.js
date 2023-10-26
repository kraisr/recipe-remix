import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logoImg from '../../images/logo.png';
import "./navbar.css"

//components
import Logout from "../Logout/Logout";

const Navbar = () => {
    let [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
    const [editModal, setEditModal] = useState(false);
    const [logoutModal, setLogoutModal] = useState(false);
    const [click, setClick] = useState(false);
    const [image, setImage] = useState(false);
    
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

    const toggleLogoutModal = () => {
        setLogoutModal(!logoutModal); // Toggle the logout modal state
    }

    const toggleModal = () => {
        setEditModal(true);
        toggleMenu();
    }

    // useEffect(() => {
        
    
    // }, []); 

    // const getProfile = async () => {
    //     try {
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //           throw new Error('No token found');
    //         }
    
    //         const response = await fetch("http://localhost:8080/user/user", 
    //         {
    //           headers: {
    //             "Content-Type": "application/json",
    //             "Authorization": `Bearer ${token}`  // Add this line to include the token in the request header
    //           },
    //           method: "GET",
    //         });
      
    //         if (!response.ok) {
    //           throw new Error('Network response was not ok');
    //         }
      
    //         const data = await response.json();
    //         applyChanges(data);
    
    //       } catch (error) {
    //         console.error('Error fetching user name:', error);
    //       }
    // }

    const handleOutsideClick = (event) => {
        const clickedElement = event.target;
        const isProfileImageClicked =
            (clickedElement && clickedElement.classList?.contains('profileImage')) ||
            ((clickedElement && clickedElement.parentElement) &&
                clickedElement.classList?.contains('corner-profile'));

        if (isProfileImageClicked) {
            if (window.innerWidth <= 768) {
                // Navigate to the profile page when clicking the profile image on smaller screens
                // Replace "/../profile" with the actual URL for the profile page
                window.location.href = "http://localhost:3000/profile";
            } else {
                // Open/close the submenu for larger screens
                toggleMenu();
            }
        } else {
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

                    <Link to="/../recipes">
                        <h1 className="nav-links" onClick={closeMobileMenu}>Recipes</h1>
                    </Link>

                    <Link to="/../community">
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

                            <Link to="/../preferences" className="sub-menu-link" onClick={toggleMenu}>
                                <i className="fa-solid fa-gear"></i>
                                <p>Preferences</p>
                                <span>{">"}</span>
                            </Link>

                                <Link to="/../settings" className="sub-menu-link" onClick={toggleMenu}>
                                    <i className="fa-solid fa-gear"></i>
                                    <p>Settings</p>
                                    <span>{'>'}</span>
                                </Link>

                                <Link to="/../shoppingList" className="sub-menu-link" onClick={toggleMenu}>
                                    <i className="fa-solid fa-gear"></i>
                                    <p>Shopping List</p>
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

                                <Link className="sub-menu-link" onClick={setLogoutModal}>
                                    <i className="fa-solid fa-user"></i>
                                    <p>Logout</p>
                                    <span>{'>'}</span>
                                </Link>

                                {logoutModal && <Logout closeModal={toggleLogoutModal} isOpen={logoutModal} />}

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