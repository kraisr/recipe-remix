import React, { useState, useEffect } from 'react';
import './createpost.css'; // Consider creating a separate CSS for styling
import question from "../../images/question.png";
import { Button, Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';


function CreatePost({ isOpen, onRequestClose, recipes, onSubmit }) {

  const [recipeNames, setRecipeNames] = useState([]);
  const [recipeImages, setRecipeImages] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(null);
  const [recipeName, setRecipeName] = useState("");
  const [recipeIngredient, setRecipeIngredient] = useState("");
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState(question);
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const availableCategories = ["None","Italian", "Mexican", "Japanese", "Party Food"];
  const [difficulty, setDifficulty] = useState('');
  const [customTags, setCustomTags] = useState([]); // State for custom tags
  const [customTagInput, setCustomTagInput] = useState(''); // State for the input field of the custom tag
  const [tagError, setTagError] = useState('');
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  

const addCustomTag = () => {
  // Error handling examples:
  if (customTagInput.trim() === '') {
    setTagError('Please enter a tag.');
  } else if (allCategories.includes(customTagInput.trim())) {
    setTagError('This tag already exists.');
  } else if (isExplicit(customTagInput.trim())) {
    setTagError('Explicit tags are not allowed.');
  } else if (selectedCategories.length >= 5) {
    setTagError(`You can only select up to 5 tags.`);
  } else {
    if (customTagInput && !availableCategories.includes(customTagInput) && !customTags.includes(customTagInput)) {
      setCustomTags(prevTags => [...prevTags, customTagInput]);
      setCustomTagInput('');
    }    setTagError(''); // Clear any existing errors
  }
};

const handleTagSelection = (tag) => {
  if (selectedCategories.includes(tag)) {
    // Logic to remove the tag from the selection
    setSelectedCategories(selectedCategories.filter(t => t !== tag));
  } else if (selectedCategories.length < 5) {
    // Logic to add the tag to the selection
    setSelectedCategories([...selectedCategories, tag]);
  } else {
    // Set error message and show popup
    setErrorMessage(`You can only select up to 5 tags.`);
    setShowErrorPopup(true);
  }
};

{showErrorPopup && (
  <div className="error-popup">
    <p>{errorMessage}</p>
    <button onClick={() => setShowErrorPopup(false)}>Close</button>
  </div>
)}

// Logic to hide the popup and clear the error message
const closeErrorPopup = () => {
  setShowErrorPopup(false);
  setErrorMessage('');
};


  const handleCustomTagChange = (event) => {
    setCustomTagInput(event.target.value);
  };
  // Combine predefined categories with custom tags for rendering
  const allCategories = [...availableCategories, ...customTags];

  const isExplicit = (tag) => {
    // You would implement your own logic here
    const explicitWords = ['explicitWord1', 'explicitWord2']; // Example list of explicit words
    return explicitWords.includes(tag.toLowerCase());
  };
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

  const toggleCategory = (category) => {
    if (category === "None") {
      // If "None" is selected, set selectedCategories to only include "None"
      setSelectedCategories(["None"]);
    } else {
      setSelectedCategories(prev => {
        if (prev.includes(category)) {
          return prev.filter(cat => cat !== category);
        } else {
          // If another category is selected, ensure "None" is not in the list
          const newCategories = [...prev.filter(cat => cat !== "None"), category];
          return newCategories;
        }
      });
    }
  };
  
  const renderCategorySelection = () => {
    return (
      <div className="category-selection">
        <div className="tags-container">
          <div className="tags-title">Pick Your Tags!</div>
          <div className="category-container">
            {allCategories.map((category, index) => (
              <div 
                key={index} 
                className={`category-bubble ${selectedCategories.includes(category) ? 'selected' : ''}`} 
                onClick={() => toggleCategory(category)}
              >
                {category}
              </div>
            ))}
          </div>
          <div className="custom-tag-input-container">
            <input 
              type="text" 
              value={customTagInput} 
              onChange={handleCustomTagChange} 
              placeholder="Enter custom tag"
              className="custom-tag-input"
            />
            <button onClick={addCustomTag} className="add-tag-button">Add Tag</button>
          </div>
        </div>
      </div>
    );
  };

  const handleRecipeSelection = (event) => {
    const selectedRecipeName = event.target.value;
    const index = recipeNames.indexOf(selectedRecipeName);
    setSelectedRecipeIndex(index);
    setRecipeName(selectedRecipeName);
  
    // Update recipeIngredient with the ingredients of the selected recipe
    if (index !== -1) {
      const selectedIngredients = recipeIngredients[index];
      setRecipeIngredient(selectedIngredients);
    } else {
      // If no recipe is selected, clear the ingredients
      setRecipeIngredient('');
    }
  
    if (index !== -1) {
      const selectedImage = recipeImages[index];
      setSelectedImage(selectedImage);
      
      // Optionally, if you want to clear any existing custom image selection:
      // setSelectedImage(""); 
    }
  };
  
  const handleDifficultyChange = (event) => {
    setDifficulty(event.target.value);
  };


  const handleRecipeNameChange = (event) => {
    // Update the recipe name as the user types
    setRecipeName(event.target.value);
  };

  const handleIngredientNameChange = (event) => {
    // Update the recipe name as the user types
    setRecipeIngredient(event.target.value);
    // console.log("ing: ", recipeIngredient);
  };

  const handleCaptionChange = (event) => {
    // Update the recipe name as the user types
    setCaption(event.target.value);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Get the selected file
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result); // Set the selected image as a data URL
      };
      reader.readAsDataURL(file);
    }
  };

  const createPost = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw Error('No token found');
      }
  
      // Check if an image is selected
      if (!selectedImage) {
        // Display a warning message here
        alert('Please select an image before creating the post.');
        return; // Do not proceed with post creation
      }
  
      const post = {
        name: recipeName,
        image: selectedImage,
        caption: caption,
        ingredients: recipeIngredient,
        difficulty: difficulty,
        tags: selectedCategories,
      };
  
      console.log("post: ", post);
    
      const response = await fetch("http://localhost:8080/posts/create-post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(post)
      });
  
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      const data = await response.json();
      console.log("data ", data);

      onRequestClose();
  
      // Optionally, you can reset the form or perform other actions after a successful post creation
      // setRecipeName("");
      // setSelectedImage("");
      // setCaption("");
      window.location.reload();
    } catch (error) {
      console.error('Error creating a post:', error);
    }
  };
  
  // Increment current step to go to the next part of the form
  const handleNextClick = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  // Decrement current step to go back to the previous part of the form
  const handleBackClick = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 0));
  };

  // Close the form and reset the steps
  const handleClose = () => {
    onRequestClose(); // Call the function passed as a prop to close the modal
    setCurrentStep(0); // Reset the step back to the first one
    // Optionally, reset any other states if needed
  };

  const textFieldStyles = {
    bgcolor: "#ffffff",
    // width: '88%',
    "& label.Mui-focused": {
      color: "#000",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#a1c298",
      },
      "&:hover fieldset": {
        borderColor: "#88b083",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#6b9466",
      },
    }
};

  const dropdownStyles = {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#a1c298",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#88b083",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#6b9466",
    },
    "& .MuiInputLabel-root": { // This applies the color to the label in all states
      color: '#000',
    },
    "& .Mui-focused .MuiInputLabel-root": { // This ensures the label is black when focused
      color: "#000",
    },
    "& .MuiSelect-select": {
      bgcolor: "#ffffff",
      "&:focus": {
        bgcolor: "#ffffff", // Maintain the background color on focus
      },
    },
    width: '100%', // Use 100% width for full width or custom value
    marginBottom: '20px', // Optional: add margin-bottom if needed
  };

  
  const renderButtons = () => {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button
          variant="contained"
          sx={{
            bgcolor: '#FA7070',
            '&:hover': {
              bgcolor: '#e06363',
            },
          }}
          onClick={handleClose}
        >
          Close
        </Button>
        <Box>
          {currentStep > 0 && (
            <Button
              variant="outlined"
              sx={{
                color: '#FA7070',
                borderColor: '#FA7070',
                mr: '1rem',
                '&:hover': {
                  bgcolor: '#ffe5e5',
                  borderColor: '#e06363',
                },
              }}
              onClick={handleBackClick}
            >
              Back
            </Button>
          )}
          {currentStep < 4 && (
            <Button
              variant="contained"
              sx={{
                bgcolor: '#A1C298',
                '&:hover': {
                  bgcolor: '#8da881',
                },
              }}
              onClick={handleNextClick}
            >
              Next
            </Button>
          )}
          {currentStep === 4 && (
            <Button
              variant="contained"
              sx={{
                bgcolor: '#A1C298',
                '&:hover': {
                  bgcolor: '#8da881',
                },
              }}
              onClick={createPost}
            >
              Submit Post
            </Button>
          )}
        </Box>
      </Box>
    );
  };
   


  // Function to render the current step
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="choose-recipe" style={{ fontSize: '1.5rem' }}>
            <h4>Choose Recipe to Post: </h4>
            <FormControl variant="outlined" fullWidth margin="normal">
            <InputLabel id="recipe-select-label" sx={{ color: '#000' }}>Choose Recipe to Post</InputLabel>
            <Select
              labelId="recipe-select-label"
              id="recipe-select"
              value={recipeName}
              onChange={handleRecipeSelection}
              label="Choose Recipe to Post"
              sx={dropdownStyles}
              inputProps={{
                classes: {
                  notchedOutline: 'your-custom-outline-class' // You need to define this class in your CSS if you want custom styles
                },
              }}
            >
              <MenuItem value="">
                <em>None</em>
              </MenuItem>
              {recipeNames.map((recipeName, index) => (
                <MenuItem key={index} value={recipeName}>
                  {recipeName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          </div>
        );
      case 1:
        return (
          <div className="image-panel">
            <div className="image-label">Selected Image:</div>
            {selectedRecipeIndex !== null ? (
              <img src={selectedImage} alt="Recipe" className='image' />
            ) : (
              <div className="custom-image">
                <img src={selectedImage} alt="Custom upload" />
                <input type="file" onChange={handleImageChange} />
              </div>
            )}
          </div>
        );
        case 2: 
        return (
          <div className="category-selection">
          {renderCategorySelection()}
        </div>
        );
        case 3:
          return (
            <div>
              <TextField
                fullWidth
                label="Recipe Name"
                variant="outlined"
                value={recipeName}
                onChange={handleRecipeNameChange}
                margin="normal"
                sx={textFieldStyles}
              />
              <TextField
                fullWidth
                label="Ingredients"
                variant="outlined"
                multiline
                rows={6}
                value={recipeIngredient}
                onChange={handleIngredientNameChange}
                margin="normal"
                sx={textFieldStyles}
              />
            </div>
          );
        case 4:
          return (
            <><TextField
              fullWidth
              label="Description"
              variant="outlined"
              multiline
              rows={6}
              value={caption}
              onChange={handleCaptionChange}
              margin="normal"
              sx={textFieldStyles} /><FormControl fullWidth margin="normal" sx={dropdownStyles}>
                <InputLabel id="difficulty-select-label">Difficulty Level</InputLabel>
                <Select
                  labelId="difficulty-select-label"
                  id="difficulty-select"
                  value={difficulty}
                  onChange={handleDifficultyChange}
                  label="Difficulty Level"
                >
                  <MenuItem value="Beginner Friendly" className="menu-item-beginner">Beginner Friendly</MenuItem>
                  <MenuItem value="Intermediate Cook" className="menu-item-intermediate">Intermediate Cook</MenuItem>
                  <MenuItem value="Master Chef" className="menu-item-master">Master Chef</MenuItem>

                </Select>
              </FormControl></>
          );
      default:
        return <div>Unknown step</div>;
    }
  };


return (
    <div className={`create-post-window ${isOpen ? 'open' : 'closed'}`}>
      {renderCurrentStep()}
      {renderButtons()}
      {tagError && <div className="tag-error-message">{tagError}</div>}
    </div>
  );
}

export default CreatePost;