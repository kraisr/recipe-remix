import "./pantry.css";
import logoImg from "../../images/Vector.png";
import React, { useEffect, useState } from "react";
import { deleteIngredientFromPantry } from "./DeleteIngredient.js";

import remixSound from "../../audio/short.mp3";
import failSound from "../../audio/fail.mp3";

const Pantry = () => {
    const [pantryIngredients, setPantryIngredients] = useState([]);
    let [recipeSuggestions, setRecipeSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
    const [filteredRecipeSuggestions, setFilteredRecipeSuggestions] = useState([]);
    const [isPantryOpen, setIsPantryOpen] = useState(false);
    const [isRecipesOpen, setIsRecipesOpen] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [noRecipesMessage, setNoRecipesMessage] = useState("Nothing to see here yet, try hitting remix!");
    const[listLength, setListLength] = useState("");

    //identify if the filtered recipe is being remixed or searched


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

    //recipe search
    useEffect(() => {
        if (recipeSuggestions.length > 0) {
            const term = recipeSearchTerm.toLowerCase();
            console.log('term:', term);
            console.log("recipe suggestions: ", recipeSuggestions);
            let filteredRecipes = "";
            filteredRecipes = recipeSuggestions.filter(
                (recipe) => recipe.node.name.toLowerCase().includes(term)
            );
            
            setFilteredRecipeSuggestions(filteredRecipes);
            //console.log("filtered: ", filteredRecipeSuggestions);
        }
    }, [recipeSearchTerm, recipeSuggestions]);


    const handleRecipeSearch = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/search-all-recipes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ searchTerm: recipeSearchTerm }),
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log('data: ', data);
        
            setRecipeSuggestions(data);

            console.log("recipes: ", recipeSuggestions);

            setListLength(data.data.searchRecipeByNameOrIngredient.onPlan.length);
            console.log(listLength);

            // Handle the response data here (e.g., update state with the matching recipes)
        } catch (error) {
            console.error("Failed to search for recipes:", error);
        }
    };

    const handleRecipeSearchInputChange = (event) => {

        const searchTerm = event.target.value;
        setRecipeSearchTerm(searchTerm);

        // Check if there are no recipe suggestions or if the "noRecipesMessage" is displayed
        
        if ( 
            (noRecipesMessage === "Oops! No recipes found" || noRecipesMessage === "Nothing to see here yet, try hitting remix!") 
            
        ) {
            // Perform a live search
            handleRecipeSearch();
        } 
    };
    

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
            console.log("length: ", recipeSuggestions.length);
            const success = new Audio(remixSound);
            const fail = new Audio(failSound);
            
            if (data.data.searchRecipesByIngredients.edges.length !== 0){
                success.play();
                setNoRecipesMessage("");
                setFilteredRecipeSuggestions(data.data.searchRecipesByIngredients.edges);
                
            } else {
                fail.play();
                setNoRecipesMessage("Oops! No recipes found");
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

                    {pantryIngredients.length > 1 && (
                        <div className="select-all-btn">
                            <button className="button-17" onClick={handleSelectAll}>Select All</button>
                        </div>
                    )}
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
                <div className="recipe-search-panel">
                    <input 
                        type="text"
                        placeholder="Search recipes..."
                        value={recipeSearchTerm}
                        onChange={handleRecipeSearchInputChange}
                        className="recipe-input"
                    />
                    {/* <button class="magnifying-glass" type="button" onClick={handleRecipeSearch}>
                        <i class="fa-solid fa-magnifying-glass"></i>
                    </button> */}
                    
                </div>

                <div className="ingredients-grid">
                    {filteredRecipeSuggestions && filteredRecipeSuggestions.length > 0 && recipeSuggestions.length > 0? (
                        filteredRecipeSuggestions.map((recipe, index) => (
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
                        <p>{noRecipesMessage}.</p>
                    )}

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