import express from 'express';
import { createPost, getUserPosts, deletePost } from '../controllers/postController.js';

const router = express.Router();

router.post('/create', createPost);
router.get('/:userId', getUserPosts);
router.delete('/:postId', deletePost);

export default router;
