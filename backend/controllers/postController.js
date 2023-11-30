import { v4 as uuidv4 } from 'uuid';
import Post from '../models/Post.js';
import Comment from '../models/Post.js';
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

export const editPost = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;
        const { postId, name, image, caption, ingredients, difficulty, tags } = req.body;
        console.log("Post ID:", postId);
        console.log("Name:", name);
        console.log("Image URL:", image);
        console.log("Caption:", caption);
        console.log("Ingredients:", ingredients);
        console.log("Difficulty:", difficulty);
        console.log("Tags:", tags);
        // Find the post by ID and ensure the user owns the post
        const post = await Post.findOne({ _id: postId, user: userId });
        if (!post) {
            return res.status(404).json({ error: "Post not found or user not authorized to edit this post" });
        }

        // Update the post with new data
        post.name = name;
        post.image = image;
        post.caption = caption;
        post.ingredients = ingredients || [];
        post.difficulty = difficulty;
        post.tags = tags;

        // Save the updated post to the database
        const updatedPost = await post.save();

        res.status(200).json({ message: "Post updated successfully", post: updatedPost });
    } catch (err) {
        console.error("Error in editPost function:", err);
        res.status(500).json({ error: "Failed to update post: " + err.message });
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
const calculateAverageRating = (post) => {
    const totalRatings = post.ratings.length;
    if (totalRatings === 0) {
        return 0; // or any default value
    }

    const sumOfRatings = post.ratings.reduce((acc, rating) => acc + rating.value, 0);
    return sumOfRatings / totalRatings;
};

export const fetchAllPosts = async (req, res) => {
    try {
        const { sortingOrder } = req.query;

        let sortCriteria;

        switch (sortingOrder) {
            case 'newest':
                sortCriteria = { createdAt: -1 };
                break;
            case 'highest':
                sortCriteria = { averageRating: -1 };
                break;
            case 'lowest':
                sortCriteria = { averageRating: 1 };
                break;
            default:
                sortCriteria = { averageRating: -1 };
                // handle other cases or set a default sorting order
        }

        const allPosts = await Post.find({})
            .populate('user', 'firstName lastName username');

        // Calculate and add average rating to each post
        const postsWithAverageRating = allPosts.map((post) => ({
            ...post.toObject(),
            averageRating: calculateAverageRating(post),
        }));

        // Sort posts based on the calculated averageRating
        console.log("criteria: ", sortingOrder);
        let posts = "";
        if (sortingOrder !== 'newest'){
            postsWithAverageRating.sort((a, b) => sortCriteria.averageRating * (a.averageRating - b.averageRating));
            posts = postsWithAverageRating;
        } else {
            const allPosts = await Post.find({})
            .sort(sortCriteria)
            .populate('user', 'firstName lastName username');

            posts = allPosts;
        }



        res.status(200).json(posts);
    } catch (error) {
        console.error('Error finding all posts:', error);
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
        const { postId, username, text, createdAt, rating} = req.body;
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // console.log(profilePicture);

        // Create a new comment object
        const newComment = {
            user: userId,
            username: username,
            text: text,
            createdAt: createdAt,
            rating: rating,
            isLiked: false,
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


export const fetchAllComments = async (req, res) => {
    try {
        
        const { postId } = req.params; // Assuming postId is in the URL parameters

        // Find the post by ID and populate the comments from the user collection
        const post = await Post.findById(postId).populate('comments.user', 'firstName lastName username').exec();

        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        const comments = post.comments;
        

        res.status(200).json({ comments });
    } catch (error) {
        console.error('Error fetching comments for the post:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const deleteComment = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const postId = req.body.postId;
        const commentId = req.body.commentId;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { comments: { _id: commentId } } },
            { new: true }
        ).select('-password');

        if (!updatedPost) {
            return res.status(400).json({ error: "Error updating comments" });
        }

        res.status(200).json({ message: "Comment deleted successfully" });
    } catch (err) {
        console.error("Error in deleteComment function:", err);
        res.status(500).json({ error: err.message });
    }
};

export const updateCommentRating = async (req, res) => {
    try {
        const { commentId, ratingChange } = req.body;

        // Find the post containing the comment
        const post = await Post.findOne({ 'comments._id': commentId });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        // Find and update the rating of the specified comment
        const comment = post.comments.find(comment => comment._id.equals(commentId));

        if (!comment) {
            return res.status(404).json({ error: 'Comment not found' });
        }

        // Update the comment rating
        console.log(comment.rating);
        comment.rating += ratingChange;
        console.log(comment.rating);
        // Save the updated post
        await post.save();

        res.status(200).json({ message: 'Comment rating updated successfully', post });
    } catch (error) {
        console.error('Error updating comment rating:', error);
        res.status(500).json({ error: 'Failed to update comment rating' });
    }
};


export const addReplyToComment = async (req, res) => {
    try {
        const { commentId, postId, username, text } = req.body;
        console.log("commentid: ", commentId);
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        // Check if the post exists
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Find the comment by ID
        const comment = post.comments.find(comment => comment._id.toString() === commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        // Create a new reply object
        const newReply = {
            user: userId,
            username: username,
            text: text,
        };

        // Add the new reply to the comment's replies array
        comment.replies.push(newReply);

        console.log(comment);
        // Save the updated post
        await post.save();

        res.status(201).json({ message: 'Reply added successfully', post });

    } catch (error) {
        console.error('Error adding reply to comment:', error);
        res.status(500).json({ message: 'Failed to add reply to comment.' });
    }
};


export const fetchCommentById = async (req, res) => {
    try {
        
        const { postId, commentId } = req.body;
        
        // Find the post by ID and populate the comments from the user collection
        const post = await Post.findById(postId).populate('comments.username', 'firstName lastName username').exec();
        
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        // Iterate through the comments to find the one with the specified commentId
        const foundComment = post.comments.find(comment => comment._id.toString() === commentId);

        if (!foundComment) {
            return res.status(404).json({ message: 'Comment not found.' });
        }

        res.status(200).json({ comment: foundComment });
    } catch (error) {
        console.error('Error finding the comment:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const deleteReply = async (req, res) => {
    try {
        const postId = req.body.postId;
        const commentId = req.body.commentId;
        const replyId = req.body.replyId;

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            { $pull: { "comments.$[c].replies": { _id: replyId } } },
            { arrayFilters: [{ "c._id": commentId }], new: true }
        ).select('-password');

        if (!updatedPost) {
            return res.status(400).json({ error: "Error updating replies" });
        }

        res.status(200).json({ message: "Reply deleted successfully", post: updatedPost });
    } catch (err) {
        console.error("Error in deleteReply function:", err);
        res.status(500).json({ error: err.message });
    }
};


