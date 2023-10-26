import Post from '../models/Post.js';

export const createPost = async (req, res) => {
    try {
        const { selectedRecipe, caption } = req.body;
        const newPost = new Post({
            user: req.user.id, // Assuming you have user info in req object from some authentication middleware
            selectedRecipe,
            caption
        });
        
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(500).json({ error: "Failed to create post." });
    }
};
