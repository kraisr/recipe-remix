import express from 'express';
import {  
  savePost, 
  addRatingToPost, 
  fetchPostById, 
  fetchPostsByUser, 
  fetchUserRating 
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', savePost);

router.post('/add-rating', addRatingToPost);

router.get('/fetch-user-posts', fetchPostsByUser);

router.get('/:postId', fetchPostById);

router.post('/fetch-user-rating', fetchUserRating);

export default router;
