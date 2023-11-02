import React, { useState, useEffect } from "react";
import "./post.css";


const Post = ({ recipe }) => {

  return (
    <div className="recipe-content">

      <div className="name-container">
        <h1>
          {recipe.name} 
        </h1>
      </div>

      <div className="image-container">
        <img src={recipe.image} alt={recipe.name} className="recipe-image" />
      </div>

      {/* <div className="time-container">
        <div>
            <span style={{ fontWeight: 'bold', marginRight: '0.5em' }}>Total Time:</span>
            {recipe.totalTime}
        </div>
      </div>

      <div>
          <span style={{ fontWeight: 'bold', marginRight: '0.5em' }}>Number of Servings:</span>
          {recipe.numberOfServings}
      </div> */}

      <div className="ingredientLines-container">
        <div className="window-title">Ingredients:</div>
        <ul>
            {recipe.ingredients.map((line, index) => (
                <li key={index}>{line}</li>
            ))}
        </ul>
      </div>

      <div className="instructions-container">
        <div className="window-title">Caption:</div>
        <ol className="instructions-list">
            {recipe.caption}
        </ol>
      </div>
  </div>
  );
};


export default Post;