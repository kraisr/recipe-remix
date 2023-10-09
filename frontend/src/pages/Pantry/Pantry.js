import "./pantry.css";
import logoImg from "../../images/Vector.png"
import React, { useState, useEffect } from 'react';

const Pantry = () => {
    const [ingredients, setIngredients] = useState([]);

    useEffect(() => {
        // Fetch the user's pantry from the backend
        const fetchPantry = async () => {
            const userId = localStorage.getItem('userId');
            const response = await fetch(`http://localhost:8080/get-pantry?userId=${userId}`);
            const data = await response.json();
            setIngredients(data.pantry);
        };
    
        fetchPantry();
    }, []);
    

    return (
        <div className="pantry-container">
            <div className="pantry-left-container">
                <h2> My Pantry </h2>
                <div className="ingredients-grid">
                    {ingredients.map((ingredient, index) => (
                        <div className="ingredient-bubble" key={index}>
                            {ingredient.ingredientName}
                        </div>
                    ))}
                </div>
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



