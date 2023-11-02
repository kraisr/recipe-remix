import React, { useState } from "react";
import "./community.css";
import CreatePost from '../../components/CreatePost/CreatePost.js';

const Community = () => {
    const [isPostWindowOpen, setIsPostWindowOpen] = useState(false);
    
    // Mocked recipes data for the sake of example, replace with actual data source
    const [recipes, setRecipes] = useState([
        { id: '1', name: 'Recipe 1' },
        { id: '2', name: 'Recipe 2' }
    ]);

    const handlePostSubmit = (selectedRecipe, caption) => {
        // Logic for handling post submission
        console.log("Posted recipe: ", selectedRecipe, " with caption: ", caption);
        setIsPostWindowOpen(false); // Close the post window after submitting
    };

    return (
        <div className="community-container">
            <div className="left-panel">
                <div className="posted-title">
                    <h4>My Posted Recipes</h4>  
                </div>
                <hr />
                
                <div className="recipe-grid">

                </div>

                <button className="create-post-btn" onClick={() => setIsPostWindowOpen(true)}>
                    <i className="fas fa-plus"></i>
                </button>
            </div>

            <div className="center-panel">

            </div>

            <div className="right-panel">

            </div>

            {isPostWindowOpen && (
                <CreatePost
                    isOpen={isPostWindowOpen}
                    onRequestClose={() => setIsPostWindowOpen(false)}
                />
            )}
        </div>
    );
}

export default Community;
