import express from 'express';
import {  
  savePost, 
  addRatingToPost, 
  fetchPostById, 
  fetchPostsByUser, 
  fetchUserRating, 
  deletePostsByUser
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', savePost);

router.post('/add-rating', addRatingToPost);

router.get('/fetch-user-posts', fetchPostsByUser);

router.post('/delete-user-posts', deletePostsByUser);

router.get('/:postId', fetchPostById);

router.post('/fetch-user-rating', fetchUserRating);

export default router;
