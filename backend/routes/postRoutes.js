import express from 'express';
import { createPost, getUserPosts, deletePost } from '../controllers/postController.js';

const router = express.Router();

router.post('/post', createPost);



export default router;
