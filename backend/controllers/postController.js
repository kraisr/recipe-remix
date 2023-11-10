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

        if (!postId || rating === undefined) {
            return res.status(400).json({ error: "Post ID and rating are required." });
        }

        const user = await User.findOne({ 'posts._id': postId });

        if (!user) {
            return res.status(404).send('Post not found.');
        }

        // Extract the specific post from the user's posts array
        const post = user.posts.find(post => post._id.equals(postId));

        if (!post) {
            return res.status(404).send('Post not found in the user\'s posts.');
        }

        console.log(post);
        post.ratings.push(rating);
        console.log(post);

        const updatedPost = await post.save();

        res.status(200).json({ 
            post: updatedPost,
            averageRating: updatedPost.averageRating,
        });

    } catch (error) {
        res.status(500).json({ error: "Failed to add rating to post." });
    }
};
