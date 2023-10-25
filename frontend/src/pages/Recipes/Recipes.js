import "./recipes.css";
import React, { useEffect, useState } from "react";


//ingredientLines
//id
//totalTiimie
//name
//numberOfServings
//source
//mainImage
//instructions
const Recipes = () => {
    const [savedRecipes, setSavedRecipes] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // for the search filter
    const [isRecipeOpen, setIsRecipeOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    const openRecipes = () => {
        setIsRecipeOpen(true);
    };

    const closePanels = () => {
        setIsRecipeOpen(false);
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        // Cleanup event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);
    

    useEffect(() => {
        // This assumes you have an endpoint to fetch saved recipes for a user
        const fetchSavedRecipes = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await fetch("http://localhost:8080/user/get-recipes", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setSavedRecipes(data);
            } catch (error) {
                console.error("Failed to fetch saved recipes:", error);
            }
        };

        fetchSavedRecipes();
    }, []);

    const handleRecipeClick = (recipe) => {
        setSelectedRecipe(recipe);
    }

    // Handle delete logic similarly to the Pantry one. This is a placeholder.
    const handleDelete = (recipeName) => {
        console.log("Delete logic for:", recipeName);
    }

    const isSmallScreen = windowWidth < 769; // You can adjust this value as needed


    return (
        <div className="recipes-container">
            {isSmallScreen && !isRecipeOpen && <button className="recipes-toggle-button" onClick={openRecipes} style={{display: 'block', zIndex: 500}}>My Recipes</button>}

            <div className={`recipes-box ${isRecipeOpen ? 'slide-in' : ''}`}>
                {isRecipeOpen && <button onClick={closePanels} className="close-panel-button" style={{display: 'block'}}>X</button>} 
                <div className="recipes-title">My Recipes</div>
                <input 
                    type="text" 
                    placeholder="Search My Recipes..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="search-input"
                />
                <div className="recipes-grid">
                    {savedRecipes.filter(recipe => recipe.name.toLowerCase().includes(searchTerm.toLowerCase())).map(recipe => (
                        <div key={recipe._id} className="recipe-bubble">
                            <div className="recipe-name" onClick={() => handleRecipeClick(recipe)}>{recipe.name}</div>
                            <button 
                                className="delete-button" 
                                onClick={() => handleDelete(recipe.name)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Recipes;