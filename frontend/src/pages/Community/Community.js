import React, { useState, useEffect } from "react";
import "./community.css";
import CreatePost from '../../components/CreatePost/CreatePost.js';
import Post from '../../components/Post/Post.js';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';

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
    const [posts, setPosts] = useState([]);
    const [currentPostId, setCurrentPostId] = useState(null);
    const { postId } = useParams();
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState({ users: [], posts: [] });
    const navigate = useNavigate();
    const cuisines = ["Italian", "Mexican", "Japanese", "Mediterranean", "Indian", "Party Food"];

    const handleSearch = async (searchTerm) => {
      setSearchTerm(searchTerm);
    
      if (searchTerm.trim() === '') {
        setSearchResults({ users: [], posts: [] });
        return;
      }
    
      try {
        const response = await fetch(`http://localhost:8080/user/search-community?term=${encodeURIComponent(searchTerm)}`);
        if (!response.ok) {
          throw new Error('Problem fetching search suggestions');
        }
        const results = await response.json();
        console.log(results);
        setSearchResults(results);
      } catch (error) {
        console.error('Error fetching search suggestions:', error);
      }
    };

    const fetchAllPosts = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw Error('No token found');
            }

            const response = await fetch("http://localhost:8080/posts/fetch-all-posts", {
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
        fetchAllPosts();
    }, []);

    return (
        <div className="community-container">
            <div className="left-panel">
                <center>
                    <button className="create-post-btn button-44" onClick={() => setIsPostWindowOpen(true)}>
                      <i className="fas fa-plus"></i>
                    </button>
                </center>

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

                <div className="divide-line"></div>
                
                <div className="posted-title">
                    <h5>Categories</h5>
                </div>
                <div className="categories-grid">
                    {cuisines.map((cuisine, index) => (
                        <div key={index} className="category-item">
                            {cuisine}
                        </div>
                    ))}
                </div>
            </div>

            <div className="center-panel">
              <center>
              <div className="search-input-container">
                <input 
                    type="text" 
                    placeholder="Search Posts or Users..." 
                    value={searchTerm} 
                    onChange={(e) => handleSearch(e.target.value)} 
                    className="search-input"
                />
                  <div className="search-suggestions-container">
                  <ul className="search-suggestions-dropdown">
                    {searchResults.users.map((user, index) => (
                      <li key={`user-${index}`} className="suggestion-item" onClick={() => navigate(`/profile/${user.token}`)}>
                        {user.firstName} {user.lastName} ({user.username})
                      </li>
                    ))}
                    {searchResults.users.length > 0 && searchResults.posts.length > 0 && (
                      <li className="divider">------ POSTS ------</li>
                    )}
                    {searchResults.posts.map((post, index) => (
                      <li key={`post-${index}`} className="suggestion-item">
                        {post.name} - {post.caption}
                      </li>
                    ))}
                  </ul>
                </div>
                </div>
              </center>
              <div className="center-button">
                <button className="community-button">Ratings</button>
                <button className="community-button">Recentness</button>
              </div>

              <div className="c-post-grid">
                  {posts.map((post) => (
                    <ul className="post-list" key={post._id}>
                      <li>
                        <div className="post-item" onClick={() => handlePostClick(post._id)}>
                            <h4>{post.name}</h4>
                            <div className="subtitle">
                              <div className="author"> 
                                <p>{post.user.firstName} {post.user.lastName}</p> 
                              </div>
                              <div className="time">
                                <p>{post.timeAgo}</p>
                              </div>
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
