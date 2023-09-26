import { Link } from "react-router-dom"

const Navbar = () => {
    return (
        <header>
            <div className="container">
                <div className="navhome">
                    <Link to="/">
                        <img src="../images/logo.png" alt="logo" />
                    </Link>
                </div>

                <Link to="/../pantry">
                    <h1>Pantry</h1>
                </Link>

                <Link to="/">
                    <h1>Recipes</h1>
                </Link>

                <Link to="/">
                    <h1>Community</h1>
                </Link>

                <div className="profileImage">
                    <Link to="/../profile">
                        <i class="fa-solid fa-user"></i>
                    </Link>
                </div>
                
                
            </div>
        </header>
    )
}

export default Navbar