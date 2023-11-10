import Post from '../models/Post.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const savePost = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { name, image, caption, ingredients } = req.body;

        // Create a new post object
        const newPost = new Post({
            user: userId, // Set the reference to the user ID
            name,
            image,
            caption,
            ingredients: ingredients || [],
            ratings: [],
        });

        // Save the new post to the database
        const savedPost = await newPost.save();

        res.status(201).json({ message: "Post created successfully", post: savedPost });
    } catch (err) {
        console.error("Error in savePost function:", err);
        res.status(500).json({ error: "Failed to create post: " + err.message });
    }
};
  
  export const deletePost = async (req, res) => {
    try {
      const token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userId = decoded.id;
      console.log("hi");
      const postId = req.body.postId; // Get the post ID from the request body
  
      // Use findOneAndUpdate to remove the post with the matching _id
      
      const updatedUser = await User.findOneAndUpdate(
        userId, 
        { $pull: { posts: { _id: postId } } },
        { new: true }
      );
  
      if (!updatedUser) {
        // User or post not found
        return res.status(404).json({ message: 'User or post not found' });
      }
  
      // Successfully deleted the post
      return res.status(200).json({ message: 'Post deleted', user: updatedUser });
    } catch (error) {
      // Handle errors, e.g., database error or invalid request
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };


export const fetchPostById = async (req, res) => {
    try {
        const { postId } = req.params;

        const post = await Post.findById(postId).populate('user', 'firstName lastName username');

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error finding the post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const fetchPostsByUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
    
        const posts = await Post.find({ user: userId })
                                .sort({ createdAt: -1 })
                                .populate('user', 'firstName lastName username');
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error finding posts for the user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const addRatingToPost = async (req, res) => {
    try {
        const { postId, rating } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if the user has already rated the post
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Check if the post already has a rating from this user
        const existingRatingIndex = post.ratings.findIndex(r => r.user.equals(userId));
        if (existingRatingIndex !== -1) {
            // Update the existing rating
            post.ratings[existingRatingIndex].value = rating;
        } else {
            // Add a new rating
            post.ratings.push({ user: userId, value: rating });
        }

        await post.save(); // Save the updated post

        res.status(200).json({ 
            message: "Rating added successfully",
            post, // The saved post with ratings
        });

    } catch (error) {
        console.error('Error adding rating to post:', error);
        res.status(500).json({ message: 'Failed to add rating to post.' });
    }
};

export const fetchUserRating = async (req, res) => {
    try {
        // Extract the postId from query parameters
        const { postId } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        // Find the post by ID
        const post = await Post.findById(postId);

        // Check if the post exists
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Find the user's rating from the post's ratings array
        const userRating = post.ratings.find(rating => rating.user.toString() === userId);

        // If the user hasn't rated the post, return an appropriate message
        if (!userRating) {
            return res.status(200).json({ rating: null });
        }

        // Return the user's rating
        res.status(200).json({ rating: userRating.value });
    } catch (error) {
        // If the token is invalid or expired, return an unauthorized error
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ message: 'Unauthorized: Invalid token' });
        }

        // Log the error and return a server error response
        console.error('Error fetching user rating:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

};
