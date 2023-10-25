import "./pantry.css";
import logoImg from "../../images/Vector.png";
import React, { useEffect, useState } from "react";
import { deleteIngredientFromPantry } from "./DeleteIngredient.js";

import remixSound from "../../audio/short.mp3";
import failSound from "../../audio/fail.mp3";

const Pantry = () => {
    const [pantryIngredients, setPantryIngredients] = useState([]);
    const [recipeSuggestions, setRecipeSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPantryOpen, setIsPantryOpen] = useState(false);
    const [isRecipesOpen, setIsRecipesOpen] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});

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

    const handleCheckboxClick = (ingredientName) => {
        setSelectedCheckboxes((prevSelected) => ({
          ...prevSelected,
          [ingredientName]: !prevSelected[ingredientName], // Toggle the status
        }));
      };

    const handleSelectAll = () => {
        // Determine if all checkboxes are currently checked or not
        const allChecked = Object.values(selectedCheckboxes).every((isChecked) => isChecked);
        
        // Toggle the status of all checkboxes based on the current state
        const updatedSelectedCheckboxes = {};
        for (const ingredient of pantryIngredients) {
          updatedSelectedCheckboxes[ingredient.ingredientName] = !allChecked;
        }
        
        setSelectedCheckboxes(updatedSelectedCheckboxes);
    };

    var snd = new Audio("file.wav");

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

    //perform the recipe remix here
    const handleDaRemix = async () => {
        try {

            const selectedIngredients = pantryIngredients.filter(
                (ingredient) => selectedCheckboxes[ingredient.ingredientName]
            );

            if (selectedIngredients.length === 0) {
                window.alert("No ingredients selected. Please add ingredients to your selection.");
                return;
            }
            
            console.log('ingredients:', pantryIngredients);
            if (pantryIngredients.length === 0) {
                setRecipeSuggestions([]);
                return;
            }
            const ingredientNames = selectedIngredients.map((ingredient) => ingredient.ingredientName);
            
            console.log("selected: ", ingredientNames);
            
            const response = await fetch("http://localhost:8080/api/search-recipes/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body:  JSON.stringify({ingredientNames })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            setRecipeSuggestions(data.data.searchRecipesByIngredients.edges);
            console.log("recipes:", recipeSuggestions);
            
            if (recipeSuggestions.length !== 0){
                const audio = new Audio(remixSound);
                audio.play();
                
            } else {
                const audio = new Audio(failSound);
                audio.play();
            }
            
            
        } catch (error) {
            console.error("Failed to fetch pantry ingredients:", error);
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
                {isSmallScreen && !isPantryOpen && !isRecipesOpen && <button className="pantry-toggle-button" onClick={openPantry} style={{display: 'block', zIndex: 500}}>Pantry</button>}
                {isSmallScreen && !isRecipesOpen && !isPantryOpen && <button className="recipes-toggle-button" onClick={openRecipes} style={{display: 'block', zIndex: 500}}>Matched Recipes</button>}

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
                                <input type="checkbox" name="checkbox" checked={selectedCheckboxes[ingredient.ingredientName] || false} // Set checked state based on selectedCheckboxes
                                                                       onChange={() => handleCheckboxClick(ingredient.ingredientName)}/>
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

                    <div className="select-all-btn">
                        <button className="button-17" onClick={handleSelectAll}>Select All</button>
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
                    <button className="filter-button">Filter</button>
                </div>
                
                <div className="ingredients-grid">
                    {recipeSuggestions && recipeSuggestions.length > 0 ? (
                        recipeSuggestions.map((recipe, index) => (
                            <div key={index} className="recipe-bubble">
                                <div className="recipe-name">{recipe.node.name}</div>
                                <button
                                    className="delete-button"
                                    onClick={() => handleDelete(recipe.node.name)}
                                >
                                    Delete
                                </button>
                            </div>
                            
                        ))
                    ) : (
                        <p>No recipes found.</p>
                    )}
                    <hr/>
                </div>
            </div>
        </div>
    );
}

export default Pantry;


       // Cleanup: remove the event listener when the component unmounts
    //     return () => {
    //         document.removeEventListener('click', handleDocumentClick);
    //     };
    // }, [isRecipeOpen]);
    // return ( 
    //         <div className="pantry-container">
    //             <div 
    //             className="pantry-tag" 
    //             style={{ display: isPantryOpen ? 'none' : 'flex' }} 
    //             onClick={(e) => {
    //                 e.stopPropagation();  // Stop the click event from bubbling up
    //                 setIsPantryOpen(!isPantryOpen);
    //             }}
    //             >
    //                 My Pantry
    //             </div>

    //             const data = await response.json();
    //             setPantryIngredients(data);
    //         } catch (error) {
    //             console.error("Failed to fetch pantry ingredients:", error);
    //         }
    //     };

    //     fetchPantryIngredients();
    // }, []);