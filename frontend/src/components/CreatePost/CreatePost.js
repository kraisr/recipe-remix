import React, { useState, useEffect } from 'react';
import './createpost.css'; // Consider creating a separate CSS for styling
import Avatar from "react-avatar-edit";


//Components
import UploadProfile from "../EditProfile/UploadProfile";

function CreatePost({ isOpen, onRequestClose, recipes, onSubmit }) {

  const [recipeNames, setRecipeNames] = useState([]);
  const [recipeImages, setRecipeImages] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [recipeIngredient, setRecipeIngredient] = useState("");
  const [caption, setCaption] = useState("");

  // Use useEffect to fetch user's recipes when the component mounts
  useEffect(() => {
    fetchUserRecipes(); 
  }, []);

  const fetchUserRecipes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw Error('No token found');
      }

      const response = await fetch("http://localhost:8080/user/user", 
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        method: "GET",
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      const recipeNamesArray = data.recipes.map((recipe) => recipe.name) || [];
      const recipeImagesArray = data.recipes.map((recipe) => recipe.mainImage) || [];
      const recipeIngredientsArray = data.recipes.map((recipe) => recipe.ingredientLines);
      setRecipeNames(recipeNamesArray);
      setRecipeImages(recipeImagesArray);
      setRecipeIngredients(recipeIngredientsArray);

    } catch (error) {
      console.error('Error fetching user name:', error);
    }
  };

  const handleRecipeSelection = (event) => {
    console.log("ingredients: ", recipeIngredients[1]);
    const selectedRecipeName = event.target.value;
    const index = recipeNames.indexOf(selectedRecipeName);
   
    setSelectedRecipeIndex(index);
    setRecipeName(selectedRecipeName);
    if (index !== -1) {
      const ingredientsArray = recipeIngredients[index];
      const parsedIngredients = ingredientsArray.join(', '); // Join the ingredients with commas
  
      setRecipeIngredient(parsedIngredients);
    }
    
  };

  const handleRecipeNameChange = (event) => {
    // Update the recipe name as the user types
    setRecipeName(event.target.value);
  };

  const handleIngredientNameChange = (event) => {
    // Update the recipe name as the user types
    setRecipeIngredients(event.target.value);
  };

  const handleCaptionChange = (event) => {
    // Update the recipe name as the user types
    setCaption(event.target.value);
  };

  

  return (
    <div className={`create-post-window ${isOpen ? 'open' : 'closed'}`}>
      
      <div className="top-panel">
        <div className="text-options">
          <div className="choose-recipe">
            <h4>Choose Recipe to Post: </h4>
            <select onChange={handleRecipeSelection}>
              <option value="">Select a Recipe</option>
              {recipeNames.map((recipeName, index) => (
                <option key={index} value={recipeName}>
                  {recipeName}
                </option>
              ))}
            </select>
          </div>
          <h4>or</h4>
          <h4>Create Post from Scratch</h4>
        </div>
        <div className="close-container" onClick={onRequestClose}>
          <div className="leftright"></div>
          <div className="rightleft"></div>
        </div>
      </div>

      <div className="post-panel">
        
        <div className="image-panel">
          {selectedRecipeIndex > -1 ? (
            <img src={recipeImages[selectedRecipeIndex]} alt="Recipe" className='image'/>
          ) : (
            <Avatar 
              width={290} 
              height={195} 
              className="image"
            />
          )}
        </div>
        
        <div className="data-panel">
          <div class="input-data">
            <input type="text" required value={recipeName} onChange={handleRecipeNameChange}/>
            <div class="underline"></div>
            <label for="">Recipe Name</label>
          </div>

          <div class="input-data recipe-ingredients">
            <textarea type="text" required value={recipeIngredient} onChange={handleIngredientNameChange}/>
            <div class="underline"></div>
            {/* <label for="">Ingredients </label> */}
          </div>

          <div class="input-data caption">
            <input type="text" required value={caption} onChange={handleCaptionChange}/>
            <div class="underline"></div>
            <label for="">Description </label>
          </div>
        </div>
          

        <button className='button-18'> Create Post</button>
       
      </div>
    </div>
  );
}

export default CreatePost;
