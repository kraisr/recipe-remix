import React, { useState } from 'react';
import './createpost.css'; // Consider creating a separate CSS for styling

function CreatePost({ isOpen, onRequestClose, recipes, onSubmit }) {
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [caption, setCaption] = useState('');

  if (!isOpen) return null; // If not open, don't render anything

  return (
    <div className="create-post-window"> {/* A similar class to recipe-window */}
      <button className="close-button" onClick={onRequestClose}>X</button>
      <h2>Post a Recipe</h2>
      
      <select value={selectedRecipe} onChange={e => setSelectedRecipe(e.target.value)}>
        {recipes.map(recipe => (
          <option value={recipe.id} key={recipe.id}>{recipe.name}</option>
        ))}
      </select>

      <textarea
        placeholder="Add a caption..."
        value={caption}
        onChange={e => setCaption(e.target.value)}
      />

      <button onClick={() => onSubmit(selectedRecipe, caption)}>Post</button>
    </div>
  );
}

export default CreatePost;
