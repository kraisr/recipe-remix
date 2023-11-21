import Post from '../models/Post.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

export const savePost = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { name, image, caption, ingredients, difficulty, tags } = req.body;

        // Create a new post object
        const newPost = new Post({
            user: userId, // Set the reference to the user ID
            name,
            image,
            caption,
            ingredients: ingredients || [],
            ratings: [],
            difficulty,
            tags,
        });
        
        // Save the new post to the database
        const savedPost = await newPost.save();

        res.status(201).json({ message: "Post created successfully", post: savedPost });
    } catch (err) {
        console.error("Error in savePost function:", err);
        res.status(500).json({ error: "Failed to create post: " + err.message });
    }
};
  
export const deletePostsByUser = async (req, res) => {
    try {

      console.log("delete post");

      const { postId } = req.body;
      console.log(postId);

      // Fetch and log all posts
      const allPosts = await Post.find({});
      allPosts.forEach(post => {
        console.log(`Post Name: ${post.name}, Post ID: ${post._id}`);
      });
  
      // Find the post by ID to delete
      const postToDelete = await Post.findById(postId);
      if (!postToDelete) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      // Optionally, log the specific post details (for debugging)
      console.log(`Deleting Post: ${postToDelete.name}, ID: ${postToDelete._id}`);
  
      // Delete the specific post
      await Post.findByIdAndRemove(postId);
  
      res.status(200).json({ message: "Post deleted successfully" });
    } catch (err) {
      console.error("Error in deletePost function:", err);
      res.status(500).json({ error: err.message });
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

export const fetchAllPosts = async (req, res) => {
    try {
        const allPosts = await Post.find({})
                                    .sort({ createdAt: -1 })
                                    .populate('user', 'firstName lastName username');
        res.status(200).json(allPosts);
    } catch (error) {
        console.error('Error finding all posts:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

export const fetchPostsByUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
    
        const posts = await Post.find({ user: userId })
                                .sort({ createdAt: -1 })
                                .populate('user', 'firstName lastName username');
        
        // Calculate additional fields
        const totalPosts = posts.length;
        const totalRatingsCount = posts.reduce((acc, post) => acc + post.ratings.length, 0);
        let sumOfAllRatings = 0;
        posts.forEach(post => {
            sumOfAllRatings += post.ratings.reduce((acc, rating) => acc + rating.value, 0);
        });
        const averageRatingAcrossAllPosts = totalRatingsCount ? (sumOfAllRatings / totalRatingsCount).toFixed(2) : 0;

        res.status(200).json({
            posts,
            totalPosts,
            averageRatingAcrossAllPosts,
            totalRatingsCount
        });
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

export const bookmarkPost = async (req, res) => {
    try {
        const { postId } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const updatedSavedPosts = [...user.savedPosts, post].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        user.savedPosts = updatedSavedPosts;
        await user.save();

        res.status(200).send('Post saved successfully');
    } catch (error) {
        console.error('Error bookmarking post:', error);
        res.status(500).json({ message: 'Failed to bookmark post.' });
    }
};


export const removeBookmark = async (req, res) => {
    try {
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

        await User.findByIdAndUpdate(userId, { $pull: { savedPosts: { _id: postId } } });
        res.status(200).send('Post removed from saved posts successfully');
    } catch (error) {
        console.error('Error removing bookmark from post:', error);
        res.status(500).json({ message: 'Failed to remove bookmark from post.' });
    }
};

export const isBookmarked = async (req, res) => {
    try {
        const { postId } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        
        const user = await User.findById(userId);
        const isBookmarked = user.savedPosts.some(post => post._id.toString() === postId);

        res.status(200).json({ isBookmarked });
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }

};

// Add the following function to handle adding a comment to a post
export const addCommentToPost = async (req, res) => {
    try {
        const { postId, text, createdAt } = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Create a new comment object
        const newComment = {
            user: userId,
            text: text,
            createdAt: createdAt
        };

        // Add the new comment to the post's comments array
        post.comments.push(newComment);
        console.log("new:", newComment);
        // Save the updated post
        await post.save();

        res.status(201).json({ message: 'Comment added successfully', post });

    } catch (error) {
        console.error('Error adding comment to post:', error);
        res.status(500).json({ message: 'Failed to add comment to post.' });
    }
};



