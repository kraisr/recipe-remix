import express from 'express';
import {  
  savePost, 
  addRatingToPost, 
  fetchPostById, 
  fetchPostsByUser, 
  fetchUserRating, 
  deletePostsByUser,
  fetchAllPosts,
  bookmarkPost,
  removeBookmark,
  isBookmarked,
  addCommentToPost,
  fetchAllComments,
  deleteComment,
} from '../controllers/postController.js';

const router = express.Router();

router.post('/create-post', savePost);

router.post('/add-rating', addRatingToPost);

router.get('/fetch-all-posts', fetchAllPosts);

router.get('/fetch-user-posts', fetchPostsByUser);

router.post('/delete-user-posts', deletePostsByUser);

router.get('/:postId', fetchPostById);

router.post('/fetch-user-rating', fetchUserRating);

router.post('/bookmark-post', bookmarkPost);

router.post('/remove-bookmark', removeBookmark);

router.post('/is-bookmarked', isBookmarked);

router.post('/add-comment', addCommentToPost);

router.get('/fetch-all-comments', fetchAllComments);

router.post('/delete-comment', deleteComment);

export default router;
