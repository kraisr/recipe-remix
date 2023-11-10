import React, { useState, useEffect } from "react";
import "./community.css";
import CreatePost from '../../components/CreatePost/CreatePost.js';
import Post from '../../components/Post/Post.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams } from 'react-router-dom';

const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          color: '#000',
          "&.Mui-focused": {
            color: '#000',
          }
        },
      },
    },
  },
});


const Community = () => {
    const [isPostWindowOpen, setIsPostWindowOpen] = useState(false);
    const [recipes, setRecipes] = useState([]);
    const [posts, setPosts] = useState([]);
    const [clickedRecipe, setClickedRecipe] = useState('');
    const [currentPost, setCurrentPost] = useState(null);
    const [currentPostId, setCurrentPostId] = useState(null);
    const { postId } = useParams();
    const [searchTerm, setSearchTerm] = useState("");

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

    const handlePostClick = (postId) => {
      // Find the recipe object
      setCurrentPostId(postId);
    };
    useEffect(() => {
      if (postId) {
        setCurrentPostId(postId);
      }
    }, [postId]);
    

    // Fetch user's posts when the component mounts
    useEffect(() => {
        fetchUserPosts();
    }, []);

    return (
        <div className="community-container">
            <div className="left-panel">
                <button className="create-post-btn button-44" onClick={() => setIsPostWindowOpen(true)}>
                    <i className="fas fa-plus"></i>
                </button>

                <div className="posted-title">
                    <h5>My Posted Recipes</h5>
                </div>
                {/* <hr /> */}
                
                <div className="recipe-grid">
                  {posts.map((post) => (
                    <ul className="recipe-list" key={post._id}>
                      <li>
                        <div className="recipe-item button-33" onClick={() => handlePostClick(post._id)}>
                            {post.name}
                        </div>
                      </li>
                    </ul>
                  ))}
                </div>
                <div className="posted-title">
                    <h5>Categories</h5>
                </div>
            </div>
            
            {/* <button onClick={test}>Create Post</button> */}

            <div className="center-panel">
              <center>
                <input 
                    type="text" 
                    placeholder="Search Posts..." 
                    value={searchTerm} 
                    onChange={(e) => setSearchTerm(e.target.value)} 
                    className="search-input"
                />
              </center>
              <div className="center-button">
                <button className="community-button">Ratings</button>
                <button className="community-button">Recentness</button>
              </div>

              <div className="post-grid">
                  {posts.map((post) => (
                    <ul className="post-list" key={post._id}>
                      <li>
                        <div className="post-item" onClick={() => handlePostClick(post._id)}>
                            <h4>{post.name}</h4>
                            <div className="author"> 
                              <p>User: </p> 
                            </div>
                            <div className="time">
                              <p>Posted at: </p>
                            </div>
                        </div>
                      </li>
                    </ul>
                  ))}
              </div>

            </div>

            <div className="scroll-wrapper">
              <div className="right-panel">
                {currentPostId && (
                  <Post postId={currentPostId} />
                )}
              </div>
            </div>

            {/* <div className="right-panel">

            </div> */}

            {isPostWindowOpen && (
              <ThemeProvider theme={theme}>
                <CreatePost
                    isOpen={isPostWindowOpen}
                    onRequestClose={() => setIsPostWindowOpen(false)}
                />
              </ThemeProvider>
            )}
        </div>
    );
}

export default Community;
