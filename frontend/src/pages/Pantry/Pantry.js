import "./pantry.css";
import logoImg from "../../images/Vector.png";
import React, { useEffect, useState } from "react";
import { deleteIngredientFromPantry } from "./DeleteIngredient.js";


const Pantry = () => {
    const [pantryIngredients, setPantryIngredients] = useState([]);
    const [recipeSuggestions, setRecipeSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPantryOpen, setIsPantryOpen] = useState(false);
    const [isRecipesOpen, setIsRecipesOpen] = useState(false);
    
    const openPantry = () => {
        setIsPantryOpen(true);
        setIsRecipesOpen(false);
    };

    // Function to open recipes and close pantry
    const openRecipes = () => {
        setIsRecipesOpen(true);
        setIsPantryOpen(false);
    };

    // Function to close both panels
    const closePanels = () => {
        setIsPantryOpen(false);
        setIsRecipesOpen(false);
    };


    useEffect(() => {
        const fetchPantryIngredients = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('No token found');
                }
                const response = await fetch("http://localhost:8080/user/get-pantry", {
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
                setPantryIngredients(data);
            } catch (error) {
                console.error("Failed to fetch pantry ingredients:", error);
            }
        };

        fetchPantryIngredients();
    }, []);

    const handleDelete = async (ingredientName) => {
        // Display a confirmation prompt to the user
        const userConfirmed = window.confirm(`Are you sure you want to delete ${ingredientName} from your pantry?`);
    
        // If the user confirms the deletion, proceed with the deletion logic
        if (userConfirmed) {
            await deleteIngredientFromPantry(ingredientName);
            setPantryIngredients(prevIngredients => prevIngredients.filter(ingredient => ingredient.ingredientName !== ingredientName));
        }
    };
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        const toggleButton = document.getElementById('toggleDropdown');
        const dropdown = document.getElementById('filterDropdown');
    
        dropdown.style.display = 'none';
    
        toggleButton.addEventListener('click', () => {
            if (dropdown.style.display == 'none') {
                dropdown.style.display = 'block'; // or 'relative' if you prefer
            } else {
                dropdown.style.display = 'none';
            }
        });
    
        // Cleanup: remove the event listener when the component unmounts
        return () => {
            toggleButton.removeEventListener('click', () => {
                if (dropdown.style.display == 'none') {
                    dropdown.style.display = 'block'; // or 'relative' if you prefer
                } else {
                    dropdown.style.display = 'none';
                }
            });
        };
    }, []);
    


    //perform the recipe remix here
    const handleDaRemix = async () => {
        try {
            console.log('ingredients:', pantryIngredients);
            if (pantryIngredients.length === 0) {
                setRecipeSuggestions([]);
                return;
            }
            const ingredientNames = pantryIngredients.map(ingredient => ingredient.ingredientName);
    
            const response = await fetch("http://localhost:8080/api/search-recipes/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ingredientNames })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setRecipeSuggestions(data.data.searchRecipesByIngredients.edges);
            console.log("recipes:", recipeSuggestions);
            
    
        } catch (error) {
            console.error("Failed to fetch pantry ingredients:", error);
        }
    } 

    const handleSaveRecipes = async (recipe) => {
        console.log("handleSaveRecipes called");
        console.log("Recipe being sent:", recipe);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in local storage.');
                return;
            }
    
            const response = await fetch("http://localhost:8080/user/save-recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(recipe)
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log(data.message);
            
        } catch (error) {
            console.error("Failed to save recipe:", error);
        }
    }
    

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        // Cleanup event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    // Determine if we're on a small screen
    const isSmallScreen = windowWidth < 769; // You can adjust this value as needed
    
        return (
            <div className="pantry-container">
                {isSmallScreen && !isPantryOpen && !isRecipesOpen && <button className="pantry-toggle-button" onClick={openPantry} style={{display: 'block', zIndex: 500,}}>Pantry</button>}
                {isSmallScreen && !isRecipesOpen && !isPantryOpen && <button className="pantry-toggle-button" onClick={openRecipes} style={{display: 'block', zIndex: 500, marginLeft: '55%'}}>Matched Recipes</button>}

                <div className={`pantry-left-container ${isPantryOpen ? 'slide-in' : ''}`}>
                    {isPantryOpen && <button onClick={closePanels} className="close-panel-button" style={{display: 'block'}}>X</button>} 
                    <div className="pantry-title">My Pantry</div>
                    <input 
                        type="text" 
                        placeholder="Search ingredients..." 
                        value={searchTerm} 
                        onChange={(e) => setSearchTerm(e.target.value)} 
                        className="search-input"
                    />
                    <div className="ingredients-grid">
                    {pantryIngredients.filter(ingredient => ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())).map(ingredient => (
                        <div key={ingredient._id} className="ingredient-bubble">
                            <div className="ingredient-name">{ingredient.ingredientName}</div>
                            <button 
                                className="delete-button" 
                                onClick={() => handleDelete(ingredient.ingredientName)}
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="pantry-center-container">
                <img alt="remix" src={logoImg} height="325px" width="270px" />  
                <button type="button" className="pantry-button" onClick={handleDaRemix}>
                    REMIX
                </button>          
            </div>

            <div className={`pantry-right-container ${isRecipesOpen ? 'slide-in' : ''}`}>
                {isRecipesOpen && <button onClick={closePanels} className="close-panel-button" style={{display: 'block'}}>X</button>}
                <div className="recipe-top-panel">
                    <div className="recipe-title">Matched Recipes</div>
                    <button id="toggleDropdown">Filter</button>
                    <div id="filterDropdown" className="dropdown-content">
                        <option value="option1">Option 1</option>
                        <option value="option2">Option 2</option>
                        <option value="option3">Option 3</option>
                    </div>
                </div>
                
                <div className="ingredients-grid">

                {recipeSuggestions && recipeSuggestions.length > 0 ? (
                    recipeSuggestions.map((recipe, index) => (
                        <div key={index} className="recipe-bubble">
                            <div className="recipe-name">{recipe.node.name}</div>
                            <button onClick={() => handleSaveRecipes(recipe.node)}>Save Recipe</button>
                        </div>
                    ))
                ) : (
                    <p>No recipes found.</p>
                )}


                </div>
            </div>
        </div>
    );
}

export default Pantry;


 