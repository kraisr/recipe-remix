import express from 'express';

import { searchIngredients } from '../controllers/suggesticController.js';

const router = express.Router();

router.post('/search-ingredients', searchIngredients);

export default router;
