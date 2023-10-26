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
            <div className="suggested-recipes">
                {/* Content for suggested recipes */}
            </div>

            <div className="community-feed">
                <button className="create-post-button" onClick={() => setIsPostWindowOpen(true)}>+</button>
            </div>

            <div className="close-friends">
                {/* Content for close friends */}
            </div>

            <CreatePost
                isOpen={isPostWindowOpen}
                onRequestClose={() => setIsPostWindowOpen(false)}
                recipes={recipes}
                onSubmit={handlePostSubmit}
            />
        </div>
    );
}

export default Community;
