import express from "express";

import { searchIngredients} from "../controllers/suggesticController.js";
import { searchRecipes} from "../controllers/suggesticController.js";
import { searchAllRecipes} from "../controllers/suggesticController.js";

const router = express.Router();

router.post("/search-ingredients", searchIngredients);

router.post("/search-recipes", searchRecipes);

router.post("/search-all-recipes", searchAllRecipes);

export default router;
