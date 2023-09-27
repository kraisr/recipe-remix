import React, {useState} from "react";
import { Link } from "react-router-dom"

const Navbar = () => {
    const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsSubMenuOpen(!isSubMenuOpen);
    };

    return (
        <nav>
            <div className="container">
                
                <Link to="/">
                    <img href="\images\logo.png" alt="logo" />
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

                <div className="profileImage" onClick={toggleMenu}>
                    <i class="fa-solid fa-user" ></i>

                </div>

                <div className={`sub-menu-wrap ${isSubMenuOpen ? 'open-menu' : ''}`} id='subMenu'>
                    <div className="sub-menu">
                        <div className="user-info">
                            <h2>Test Name</h2>
                        </div>
                        <hr />

                        <Link to="/../profile" class="sub-menu-link" onClick={toggleMenu}>
                            <i class="fa-solid fa-user"></i>
                            <p>Profile</p>
                            <span>{'>'}</span>
                        </Link>

                        <Link to="/../settings" class="sub-menu-link" onClick={toggleMenu}>
                            <i class="fa-solid fa-gear"></i>
                            <p>Settings</p>
                            <span>{'>'}</span>
                        </Link>

                        <Link to="/" class="sub-menu-link" onClick={toggleMenu}>
                            <i class="fa-solid fa-circle-info"></i>
                            <p>Help</p>
                            <span>{'>'}</span>
                        </Link>

                        <Link to="/" class="sub-menu-link" onClick={toggleMenu}>
                            <i class="fa-solid fa-right-from-bracket"></i>
                            <p>Logout</p>
                            <span>{'>'}</span>
                        </Link>
                    </div>
                </div>
                

            </div>

        </nav>
    )

    
}

export default Navbar