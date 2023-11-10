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

    const fetchUserPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw Error('No token found');
            }

            const response = await fetch("http://localhost:8080/posts/fetch-user-posts", {
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
            // console.log("data: ", data);
            if (Array.isArray(data)) {
                // Update the recipes state with the user's posts
                const recipeNames = data.map(post => post.name);
                setRecipes(recipeNames);
                setPosts(data);
            } else {
                console.error('Invalid data format:', data);
            }
        } catch (error) {
            console.error('Error fetching user posts:', error);
        }
    };

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
                <div className="posted-title">
                    <h4>My Posted Recipes</h4>
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

                <button className="create-post-btn button-44" onClick={() => setIsPostWindowOpen(true)}>
                    <i className="fas fa-plus"></i>
                </button>
            </div>

            <div className="scroll-wrapper">
              <div className="center-panel">
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
