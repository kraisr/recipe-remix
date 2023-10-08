import "../css/pantry.css";
import logoImg from "../images/Vector.png"
const Pantry = () => {
    return (
        <div className="pantry-container">
            <div className="pantry-left-container">
                <h2>
                    My Pantry
                </h2>
            </div>

            <div className="pantry-center-container">
                <img alt="remix" src={logoImg} height="325px" width="270px" />
                
                <button type="button" class="pantry-button">
                        REMIX
                </button>
            </div>
            <div className="pantry-right-container">
                <h2>
                    Matched Recipes
                </h2>
            </div>
        </div>

    )
}

export default Pantry;