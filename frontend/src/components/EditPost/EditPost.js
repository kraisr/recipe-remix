import React, { useState, useEffect } from 'react';
import './editpost.css'; // Consider creating a separate CSS for styling
import question from "../../images/question.png";
import { Button, Box, TextField, MenuItem, FormControl, InputLabel, Select } from '@mui/material';


function EditPost({ isOpen, onRequestClose, postToEdit, onSubmit }) {

  const postId = postToEdit?.postId; // Use the postId passed from the parent component

  const [recipeName, setRecipeName] = useState(postToEdit.name);
  const [caption, setCaption] = useState(postToEdit.caption);
  const [selectedImage, setSelectedImage] = useState(postToEdit.mainImage || question);

  const [recipeNames, setRecipeNames] = useState([]);
  const [recipeImages, setRecipeImages] = useState([]);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [selectedRecipeIndex, setSelectedRecipeIndex] = useState(null);
  const [recipeIngredient, setRecipeIngredient] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const availableCategories = ["Italian", "Mexican", "Japanese", "Party Food", "Vegan"];
  const [difficulty, setDifficulty] = useState('');

  // Use useEffect to fetch user's recipes when the component mounts
  useEffect(() => {
    if (postToEdit) {
      setRecipeName(postToEdit.name);
      setSelectedImage(postToEdit.image || question);
      setRecipeIngredient(postToEdit.ingredients.join('\n')); // Assuming ingredients are an array
      setCaption(postToEdit.caption);
      setSelectedCategories(postToEdit.tags || []);
      setDifficulty(postToEdit.difficulty);
      // Set other fields as needed
    }
  }, [postToEdit]);

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
    setSelectedCategories(prev =>
      prev.includes(category) ? prev.filter(cat => cat !== category) : [...prev, category]
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

  const editPost = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw Error('No token found');
      }

      if (!selectedImage) {
        alert('Please select an image before updating the post.');
        return;
      }

      const post = {
        postId: postId,
        name: recipeName,
        image: selectedImage,
        caption: caption,
        ingredients: recipeIngredient,
        difficulty: difficulty,
        tags: selectedCategories,
      };

      console.log("Updating post: ", post);

      const response = await fetch("http://localhost:8080/posts/edit-post", {
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
      console.log("Updated post data: ", data);

      onRequestClose();
      window.location.reload();
    } catch (error) {
      console.error('Error updating the post:', error);
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
          {currentStep < 3 && (
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
          {currentStep === 3 && (
            <Button
              variant="contained"
              sx={{
                bgcolor: '#A1C298',
                '&:hover': {
                  bgcolor: '#8da881',
                },
              }}
              onClick={editPost}
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
          <div className="edit-post-heading" style={{ fontSize: '1.5rem' }}>
            <h4>Editing the Following Post:</h4>
            <h4>{recipeName}</h4>
            {/* Other details of the post can be displayed here if needed */}
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
            <div className="category-selection">
              {availableCategories.map((category, index) => (
                <div
                  key={index}
                  className={`category-bubble ${selectedCategories.includes(category) ? 'selected' : ''}`}
                  onClick={() => toggleCategory(category)}>
                  {category}
                </div>
              ))}
            </div>
          </div>
        );
      case 2:
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
      case 3:
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
    <div className={`edit-post-window ${isOpen ? 'open' : 'closed'}`}>
      {renderCurrentStep()}
      {renderButtons()}
    </div>
  );
}

export default EditPost;