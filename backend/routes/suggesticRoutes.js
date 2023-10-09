import express from "express";

import { searchIngredients, addIngredientToPantry, getPantryIngredients} from "../controllers/suggesticController.js";

const router = express.Router();

router.post("/search-ingredients", searchIngredients);
router.post("/add-ingredient", addIngredientToPantry); // New route
router.get('/api/get-pantry', getPantryIngredients);


export default router;
