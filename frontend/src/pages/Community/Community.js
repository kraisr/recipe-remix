import React, { useState, useEffect } from "react";
import "./community.css";
import CreatePost from '../../components/CreatePost/CreatePost.js';
import Post from '../../components/Post/Post.js';

const Community = () => {
    const [isPostWindowOpen, setIsPostWindowOpen] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [posts, setPosts] = useState([]);
    const [clickedRecipe, setClickedRecipe] = useState('');
    const [currentPost, setCurrentPost] = useState(null);

    const fetchUserPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw Error('No token found');
            }

            const response = await fetch("http://localhost:8080/user/user", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log("data: ", data.posts);
            if (Array.isArray(data.posts)) {
                // Update the recipes state with the user's posts
                const recipeNames = data.posts.map(post => post.name);
                setRecipes(recipeNames);
                setPosts(data.posts);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

    const test = () => {
        console.log("recipes: ", recipes);
        console.log("posts: ", posts);
    }

    const handlePostClick = (recipeName) => {
      // Find the recipe object
      const foundRecipe = posts.find(post => post.name === recipeName);
      console.log("found recipe: ", foundRecipe)
      console.log("posts: ", posts);
      console.log("recipeName: ", recipeName);
      // Set the states of clickedRecipe and currentPost
      setClickedRecipe(recipeName);
      setCurrentPost(foundRecipe);
    };

    // Fetch user's posts when the component mounts
    useEffect(() => {
        fetchUserPosts();
    }, []);

    return (
        <div className="community-container">
            <div className="left-panel">
                <div className="posted-title">
                    <h4>My Posted Recipes</h4>
                </div>
                <hr />
                
                <div className="recipe-grid">
                    {recipes.map((recipe, index) => (
                      <ul className="recipe-list">
                        <li>
                          <div key={index} className="recipe-item button-33" onClick={() => handlePostClick(recipe)}>
                              {recipe}
                          </div>
                        </li>
                      </ul>
                    ))}
                </div>

                <button className="create-post-btn button-44" onClick={() => setIsPostWindowOpen(true)}>
                    <i className="fas fa-plus"></i>
                </button>
            </div>
            
            {/* <button onClick={test}>Create Post</button> */}

            <div className="scroll-wrapper">
              <div className="center-panel">
                {currentPost && (
                  <Post recipe={currentPost} />
                )}
              </div>
            </div>

            {/* <div className="right-panel">

            </div> */}

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
