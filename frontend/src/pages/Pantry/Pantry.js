import "./pantry.css";
import logoImg from "../../images/Vector.png";
import React, { useEffect, useState } from "react";
import { deleteIngredientFromPantry } from "./DeleteIngredient.js";
import MyComponent from "./filter.js";
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import remixSound from "../../audio/success.mp3";
import failSound from "../../audio/fail.mp3";
import greatSound from "../../audio/great.mp3";
import mixingBowl from "../../images/mixing_bowl.gif";
import mixingBowlImg from "../../images/frame-1.png";
import DeleteIcon from '@mui/icons-material/Delete';
import RecipeWindow from '../../components/RecipeWindow/RecipeWindow'

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
    Modifier,
    useDroppable,
} from '@dnd-kit/core';

import {
    restrictToVerticalAxis,
    restrictToParentElement,
  } from '@dnd-kit/modifiers';

import {
    sortableKeyboardCoordinates,
    arrayMove,
    SortableContext,
    verticalListSortingStrategy,
    SortableItem,
    useSortable,
} from '@dnd-kit/sortable';


const DropZone = ({ onDelete }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: 'dropzone',
    });

    // if (!isOver) return null;

    return (
        <div ref={setNodeRef} className="dropzone" onDrop={onDelete}>
            <DeleteIcon fontSize="large" />
        </div>
    );
};

const SortableIngredient = ({ ingredient, selectedCheckboxes, handleCheckboxClick, handleDelete, onStartDrag }) => {
    const {
        attributes: sortableAttributes,
        listeners: sortableListeners,
        setNodeRef,
        transform,
        transition
    } = useSortable({ id: ingredient._id });    

    const handlePointerDown = (e) => {
        console.log("Pointer down!");
        sortableListeners.onPointerDown(e);
    };

    return (
        <div 
            ref={setNodeRef}
            style={{transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined, transition}}
            className="ingredient-bubble"                             
        >
            <div className="drag-checkbox-wrapper">
                <div className="drag-handle" {...sortableAttributes} {...sortableListeners} onClick={() => console.log("Handle clicked!")}>: : :</div>
                <input type="checkbox" name="checkbox" checked={selectedCheckboxes[ingredient.ingredientName] || false} onChange={() => handleCheckboxClick(ingredient.ingredientName)}/>
            </div>
            <div className="ingredient-name">{ingredient.ingredientName}</div>
            <button 
                className="delete-button" 
                onClick={() => handleDelete(ingredient.ingredientName)}
            >
                Delete
            </button>
        </div>
    );
};



const Pantry = () => {
    const [pantryIngredients, setPantryIngredients] = useState([]);
    let [recipeSuggestions, setRecipeSuggestions] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [recipeSearchTerm, setRecipeSearchTerm] = useState("");
    const [filteredRecipeSuggestions, setFilteredRecipeSuggestions] = useState([]);
    const [isPantryOpen, setIsPantryOpen] = useState(false);
    const [isRecipesOpen, setIsRecipesOpen] = useState(false);
    const [remixStatus, setRemixStatus] = useState(false);
    const [selectedCheckboxes, setSelectedCheckboxes] = useState({});
    const [noRecipesMessage, setNoRecipesMessage] = useState("Nothing to see here yet, try hitting remix!");
    const [listLength, setListLength] = useState("");
    const [isGifPlaying, setIsGifPlaying] = useState(false);
    const [sortedIngredients, setSortedIngredients] = useState(pantryIngredients);
    const [draggedIngredientName, setDraggedIngredientName] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [expandedRecipeIndex, setExpandedRecipeIndex] = useState(null);
    const [addedIngredient, setAddedIngredient] = useState(null);
    const [promptMessage, setPromptMessage] = useState("");
    const [selectedRecipes, setSelectedRecipes] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [currentlyModified, setCurrentlyModified] = useState(null);
    const [showPrompt, setShowPrompt] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState(null);
    const [refreshData, setRefreshData] = useState(false);


    const StyledButton = styled(Button)({
        backgroundColor: '#FFFAF0', // Light grey
        '&:hover': {
            backgroundColor: '#A9A9A9' // Darker shade of grey on hover
        },
        margin: '5px', // To give some space between buttons
        color: 'black', // Black text
    });
    

    const toggleRecipeExpansion = (index) => {
        if (expandedRecipeIndex === index) {
            setExpandedRecipeIndex(null);
        } else {
            setExpandedRecipeIndex(index);
        }
    };
    const [animate, setAnimate] = useState(true);

    useEffect(() => {
        const fetchUserSettings = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token found");
                }

                const response = await fetch("http://localhost:8080/user/user", {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    method: "GET",
                });

                if (!response.ok) {
                    throw new Error("Network response was not ok");
                }

                const data = await response.json();

                setAnimate(data.animate);

            } catch (error) {
                console.error("Error fetching user settings:", error);
            }
        };

        fetchUserSettings();
    }, []);


    const sensors = useSensors(
        useSensor(PointerSensor)
    );

    const startDrag = (ingredientName) => {
        console.log("Setting dragged ingredient:", ingredientName);
        setDraggedIngredientName(ingredientName);
    };
      
    const handleDragEnd = (event) => {
        const { active, over } = event;
    
        // If dropped over the drop zone, delete the ingredient
        if (over && over.id === 'dropzone') {
            handleDelete(draggedIngredientName);
            setDraggedIngredientName(null); // Reset the state after use
            return;
        }    
        
        // Ensure both active and over are defined
        if (!active || !over || active.id === over.id) {
            return;
        }
    
        // Continue with reordering based on ingredient _id
        const oldIndex = pantryIngredients.findIndex(ingredient => ingredient && ingredient._id === active.id);
        const newIndex = pantryIngredients.findIndex(ingredient => ingredient && ingredient._id === over.id);
        
        // Check that both oldIndex and newIndex are valid
        if (oldIndex !== -1 && newIndex !== -1) {
            setPantryIngredients(prevIngredients => arrayMove(prevIngredients, oldIndex, newIndex));
        }
    };
    
    
    
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    useEffect(() => {
        const container = document.querySelector('.ingredients-grid');
        container.addEventListener('dragover', handleDragOver);
        
        return () => {
            container.removeEventListener('dragover', handleDragOver);
        };
    }, []);

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
    }, [refreshData]);

    //recipe search
    useEffect(() => {
        if (recipeSuggestions.length > 0) {
            const term = recipeSearchTerm.toLowerCase();
    
            let filteredRecipes = "";
            if (recipeSuggestions[0]?.node?.name) {
                // This structure is for recipe remix
                filteredRecipes = recipeSuggestions.filter(
                    (recipe) => recipe.node.name.toLowerCase().includes(term)
                );
            } else if (recipeSuggestions[0]?.name) {
                // This structure is for recipe search
                filteredRecipes = recipeSuggestions.filter(
                    (recipe) => recipe.name.toLowerCase().includes(term)
                );
            }
    
            setFilteredRecipeSuggestions(filteredRecipes);
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
        
            setRecipeSuggestions(data.data.searchRecipeByNameOrIngredient.onPlan);

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

    const addToPantry = async (ingredientName, recipe) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await fetch('http://localhost:8080/user/add-pantry',
            {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`  // Add this line to include the token in the request header
                },
                body: JSON.stringify({ ingredientName: ingredientName })  // Sending the ingredient data
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log(data.message); // Ingredient added successfully
                setRefreshData(prev => !prev);
                setPromptMessage(null);
                setCurrentlyModified(recipe.node.name);
                setSuccessMessage("Ingredient added to pantry!");
                setTimeout(() => {
                    setCurrentlyModified(null);
                    setSuccessMessage(null);
                }, 2000);
            } else {
                setCurrentlyModified(recipe.node.name);
                setSuccessMessage(null);
                setPromptMessage("Ingredient already exists in pantry!");
                setTimeout(() => {
                    setCurrentlyModified(null);
                    setPromptMessage(null);
                }, 2000);
            }
        } catch (error) {
            console.error("Error adding ingredient to pantry:", error);
        }
    };

    const addToShoppingList = async (ingredientName, recipe) => {
        try {
            const token = localStorage.getItem('token');
            const email = localStorage.getItem('email');
            if (!token) {
                throw new Error('No token found');
            }
            const response = await fetch('http://localhost:8080/user/add-missing-ingredient',
            {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  "Authorization": `Bearer ${token}`  // Add this line to include the token in the request header
                },
                body: JSON.stringify({ email: email, item: ingredientName, quantity: 1 })  // Sending the ingredient data
            });
    
            const data = await response.json();
            if (response.ok) {
                console.log(data.message); // Ingredient added successfully
                // setRefreshData(prev => !prev);
                setPromptMessage(null);
                setCurrentlyModified(recipe.node.name);
                setSuccessMessage("Ingredient added to shopping list!");
                setTimeout(() => {
                    setCurrentlyModified(null);
                    setSuccessMessage(null);
                }, 2000);
            } else {
                setSuccessMessage(null);
                setCurrentlyModified(recipe.node.name);
                setPromptMessage("Ingredient already exists in shopping list!");
                setTimeout(() => {
                    setCurrentlyModified(null);
                    setPromptMessage(null);
                }, 2000);
            }
        } catch (error) {
            console.error("Error adding ingredient to pantry:", error);
        }
    };
    

    const handleDelete = async (ingredientName, event) => {
        if (event) {
            event.stopPropagation();
        }
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
            
            const selectedIngredients = pantryIngredients.filter(
                (ingredient) => selectedCheckboxes[ingredient.ingredientName]
            );

            if (selectedIngredients.length === 0) {
                window.alert("No ingredients selected. Please add ingredients to your selection.");
                return;
            }
            setTimeout(() => {
                setIsGifPlaying(true);
            }, 1000);
            
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
                body: JSON.stringify({ingredientNames })
            });
    
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
    
            const data = await response.json();
            console.log("animate: ", animate);
            console.log("data: ", data);
            console.log('type remix: ', typeof(data));
            
            if (animate) {
                const success = new Audio(greatSound);
                const fail = new Audio(failSound);
    
                if (data.data.searchRecipesByIngredients.edges.length !== 0) {
                    success.play();
                    setNoRecipesMessage("");
                    
                    setRemixStatus(true);
                } else {
                    fail.play();
                    setRemixStatus(false);
                    
                }
    
                // Delay for 5 seconds
                setTimeout(() => {
                    setIsGifPlaying(false);
                    setFilteredRecipeSuggestions(data.data.searchRecipesByIngredients.edges);
                    setRecipeSuggestions(data.data.searchRecipesByIngredients.edges);
                    if (remixStatus) {
                        console.log("status: ", remixStatus);
                        // window.alert("Success!");
                    } else {
                        // window.alert("Dubious Food :(");
                        setNoRecipesMessage("Oops! No recipes found");
                    }
                }, 5000);
            } else {
                // If animation is disabled, set the results immediately without audio or delay
                console.log("balls");
                setFilteredRecipeSuggestions(data.data.searchRecipesByIngredients.edges);
                if (data.data.searchRecipesByIngredients.edges.length !== 0) {
                    setRecipeSuggestions(data.data.searchRecipesByIngredients.edges);
                    setRemixStatus(true);
                } else {
                    setRemixStatus(false);
                    setNoRecipesMessage("Oops! No recipes found");
                }
            }
            
        } catch (error) {
            console.error("Failed to fetch pantry ingredients:", error);
        }
    } 


    const handleSaveRecipes = async (recipe, event) => {
        console.log(recipe);
        setCurrentlyModified(recipe.name);
        if (event) {
            event.stopPropagation();
        }

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
                const responseData = await response.json();

                if (responseData.error === "Error updating user recipes or recipe already exists") {
                    setSuccessMessage("");
                    setPromptMessage("Recipe already saved!");
    
                    // Optionally, auto-hide the message after 3 seconds
                    setTimeout(() => {
                        setPromptMessage("");
                    }, 2000);
                } else {
                    throw new Error('Network response was not ok');
                }
            }
    
            const data = await response.json();
            setPromptMessage("");
            setSuccessMessage("Recipe saved successfully!");
            setTimeout(() => {
                setSuccessMessage("");
            }, 2000);
            
            console.log(data.message);
            
        } catch (error) {
            console.error("Failed to save recipe:", error);
        }
    }

    const SuccessMessage = ({ message }) => {
        return message ? (
            <div style={{ color: 'green', textDecoration: 'underline', marginLeft: '13px' }}>
                {message}
            </div>
        ) : null;
    };
    

    useEffect(() => {
        window.addEventListener("resize", handleResize);
        // Cleanup event listener on component unmount
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOnDragStart = (event) => {
        const draggedItem = pantryIngredients.find(ingredient => ingredient._id === event.active.id);
        if (draggedItem) {
            setDraggedIngredientName(draggedItem.ingredientName);
        }
    };

    function handleMissingIngredientClick(ingredientName) {
        // Perform some action with the ingredientName
        console.log("Clicked on:", ingredientName);
        // setAddedIngredient(ingredientName);
        setSelectedIngredient(ingredientName);
        setShowPrompt(true);

        setTimeout(() => {
            setAddedIngredient(null);
        }, 2000);
    }    

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
                    <DndContext 
                        sensors={sensors} 
                        collisionDetection={closestCenter} 
                        onDragEnd={(event) => {
                            setIsDragging(false);
                            handleDragEnd(event); 
                        }}
                        onDragStart={(event) => {
                            setIsDragging(true);
                            handleOnDragStart(event);
                        }}
                        modifiers={[restrictToParentElement, restrictToVerticalAxis]}
                    >
                        <SortableContext items={pantryIngredients.map(i => i._id)} strategy={verticalListSortingStrategy}>
                            {pantryIngredients.filter(ingredient => ingredient.ingredientName.toLowerCase().includes(searchTerm.toLowerCase())).map(ingredient => (
                                <SortableIngredient 
                                key={ingredient._id} 
                                ingredient={ingredient} 
                                selectedCheckboxes={selectedCheckboxes} 
                                handleCheckboxClick={handleCheckboxClick} 
                                handleDelete={handleDelete}
                                onStartDrag={startDrag}
                            />
                            ))}
                        </SortableContext>

                        {isDragging && <DropZone onDelete={(event) => {
                            const ingredientName = event.dataTransfer.getData("text/plain");
                            handleDelete(ingredientName);
                        }} />}
                    </DndContext>
                </div>

                {pantryIngredients.length > 1 && (
                    <div className="select-all-btn">
                        <button className="button-17" onClick={handleSelectAll}>Select All</button>
                    </div>
                )}
            </div>

        <div className="pantry-center-container">


            {isGifPlaying && animate ? (
                <img
                    src={mixingBowl}
                    alt="Mixing Bowl"
                    className="mixing-bowl-gif"
                    // style={{ width: '100%', height: '100%' }} // Adjust the width and height as needed
                />
            ) : (
                <img
                    src={mixingBowlImg}
                    alt="Mixing Bowl"
                    className="mixing-bowl-static"
                    // style={{ width: '100%', height: '100%' }} // Adjust the width and height as needed
                />
            )}
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
                    <MyComponent/>
                </div>
            </div>
            <div className="recipe-search-panel">
                <input 
                    type="text"
                    placeholder="Search recipes..."
                    value={recipeSearchTerm}
                    onChange={handleRecipeSearchInputChange}
                    className="recipe-input"
                />
            </div>
            <div className="recipes-grid">
                {filteredRecipeSuggestions && filteredRecipeSuggestions.length > 0 && recipeSuggestions.length > 0? (
                    filteredRecipeSuggestions.map((recipe, index) => (
                        <div>
                        <div key={index} className="recipe-bubble" onClick={() => toggleRecipeExpansion(index)}>
                            <div className="recipe-name">
                                {recipe.node ? recipe.node.name : recipe.name}
                            </div>
                            {expandedRecipeIndex !== index && (
                                <div className="pantry-right-button-containter">
                                    <button className="pantry-save-button" onClick={(event) => handleSaveRecipes(recipe.node, event)}>Save</button>

                                </div>
                            )}
                        </div>
                        {expandedRecipeIndex !== index && recipe.node.name === currentlyModified ? (
                            <>
                                {promptMessage && (
                                    <div className="prompt-message" style={{ color: 'red', textDecoration: 'underline', marginLeft: '13px' }}>
                                        {promptMessage}
                                    </div>
                                )}
                                <SuccessMessage message={successMessage} />
                            </>
                        ) : null}
                        {expandedRecipeIndex === index && (
                            <div className={`expanded-content ${expandedRecipeIndex === index ? 'expanding' : 'collapsing'}`}>
                                <img src={ recipe.node ? recipe.node.mainImage : recipe.image } alt="recipe" className="recipe-image" />
                                <p style={{ width: '100%', marginTop: '10px' }}><b>Total time:</b> { recipe.node.totalTime }</p>
                                <div style={{ width: '100%', marginTop: '10px', textAlign: 'left' }}>
                                    <b>Ingredients:</b>
                                    <ul style={{ marginTop: '3px', marginBottom: '20px' }}>
                                        {recipe.node.ingredients
                                            .reduce((unique, ingredient) => {
                                            const isDuplicate = unique.some(
                                                uni => uni.name.trim().toLowerCase() === ingredient.name.trim().toLowerCase()
                                            );
                                            return isDuplicate ? unique : [...unique, ingredient];
                                            }, [])
                                            .map((ingredient, index) => (
                                            <li key={index} style={{ color: pantryIngredients.some(pantryItem => pantryItem.ingredientName.trim().toLowerCase() === ingredient.name.trim().toLowerCase()) ? 'inherit' : 'red' }}>
                                                {pantryIngredients.some(pantryItem => pantryItem.ingredientName.trim().toLowerCase() === ingredient.name.trim().toLowerCase()) ? (
                                                    ingredient.name
                                                ) : (
                                                <a href="#" className="ingredient-link" onClick={(e) => { 
                                                    e.preventDefault(); 
                                                    if (selectedIngredient === ingredient.name && showPrompt) {
                                                        setShowPrompt(false);
                                                    } else {
                                                        handleMissingIngredientClick(ingredient.name); 
                                                    } 
                                                }}>
                                                    {ingredient.name}
                                                </a>
                                                )}
                                                {selectedIngredient === ingredient.name && showPrompt && (
                                                <div className="ingredient-prompt">
                                                        <p style={{ color: 'black', marginBottom: '3px', marginTop: '3px' }}>
                                                            Do you want to add <span style={{ textDecoration: 'underline' }}>{selectedIngredient}</span> to your:
                                                        </p>
                                                        <StyledButton variant="contained" onClick={() => addToPantry(selectedIngredient, recipe)}>
                                                            Pantry
                                                        </StyledButton>
                                                        <StyledButton variant="contained" onClick={() => addToShoppingList(selectedIngredient, recipe)}>
                                                            Shopping List
                                                        </StyledButton>
                                                        <StyledButton variant="contained" onClick={() => setShowPrompt(false)}>
                                                            Close
                                                        </StyledButton>
                                                    </div>
                                                )
                                            }
                                            </li>
                                        ))}
                                    </ul>

                                    { addedIngredient && <p style={{color: 'green', fontSize: '0.8rem'}}>{addedIngredient} added to shopping list</p> }
                                    <div className="bottom-section">
                                        <div 
                                            className="view-more-button" 
                                            onClick={() => {
                                                console.log(recipe.node);
                                                setSelectedRecipes(recipe.node);
                                            }}
                                        >
                                            View More
                                        </div>

                                        {
                                            selectedRecipes && 
                                            <RecipeWindow 
                                                recipe={selectedRecipes} 
                                                onClose={() => setSelectedRecipes(null)} 
                                                onSave={(updatedRecipe) => {
                                                    setSelectedRecipes(updatedRecipe);
                                                 }}
                                                 edit={false}
                                            />
                                        }

                                        <div className="save-delete-buttons">
                                            <button className="pantry-save-button" style={{ marginRight: 0 }} onClick={() => handleSaveRecipes(recipe.node)}>Save</button>
                                            {/* <button className="delete-button" onClick={() => handleDelete(recipe.node.name)}>Delete</button> */}
                                        </div>
                                    </div>
                                    {promptMessage && recipe.node.name === currentlyModified && (
                                        <div className="prompt-message" style={{ color: 'red', textDecoration: 'underline' }}>
                                            {promptMessage}
                                        </div>
                                    )}
                                    { recipe.node.name === currentlyModified && <SuccessMessage message={successMessage} /> }
                                </div>
                            </div>
                        )}                        
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


 