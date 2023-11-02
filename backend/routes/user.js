import express from "express";
import {addIngredient, getFromPantry, deleteIngredient, deleteRecipe, retreiveDietaryTags} from "../controllers/user.js";
import { getUser, updateUser, updatePreferences, mode, reminder, reminderSetting, deleteAccount } from "../controllers/user.js";
import { requestResetPassword, resetPassword } from"../controllers/resetPassword.js";
import { createShoppingList, deleteShoppingList, editShoppingList, getShoppingLists} from "../controllers/user.js";
import { addToShoppingList, deleteFromShoppingList, editInShoppingList} from "../controllers/user.js";
import { sendEmail, updateReminder } from "../controllers/sendEmail.js";import {sendCode} from "../controllers/code.js"
import { saveRecipes, getRecipes} from "../controllers/user.js";
import { createFolder, getFolders, addRecipeToFolder, deleteFolder, removeRecipeFromFolder } from "../controllers/user.js"

const router = express.Router();

/* GET USER DATA */
router.get("/user", getUser);
router.post("/user", updateUser);

/* FORGOT PASSWORD */
router.post("/requestResetPassword", requestResetPassword);
router.post("/resetPassword", resetPassword);

/* CONTACT FORM */
router.post("/send-email", sendEmail);

/* UPDATE REMINDER */
router.post("/update-reminder", updateReminder);

/* UPDATE PREFERENCES */
router.post("/update-preferences", updatePreferences);

/* UPDATE SHOPPINGLIST */
router.post("/createShoppingList", createShoppingList);
router.post("/deleteShoppingList", deleteShoppingList);
router.get("/getShoppingLists", getShoppingLists);
router.post("/editShoppingList", editShoppingList);

router.post("/addToShoppingList", addToShoppingList);
router.post("/deleteFromShoppingList", deleteFromShoppingList);
router.post("/editInShoppingList", editInShoppingList);

/* Set routes to redirect to the correct controller in /controllers/auth.js */
router.post("/mode", mode);
router.post("/reminder", reminder);
router.post("/reminderSetting", reminderSetting);


/* PANTRY ROUTES */
router.post("/add-pantry", addIngredient);
router.get("/get-pantry", getFromPantry);
router.post("/delete-pantry", deleteIngredient);

/* RECIPE ROUTES */
router.post("/save-recipes", saveRecipes);
router.get("/get-recipes", getRecipes);
router.post("/delete-recipe", deleteRecipe);

/* DELETE ACCOUNT */
router.post("/delete-account", deleteAccount);

/* 2FA CODE */
router.post("/code", sendCode);

router.post("/retreive-dietary-tags", retreiveDietaryTags);

router.post("/create-folder", createFolder);
router.get("/get-folders", getFolders);
router.post("/add-recipe-to-folder", addRecipeToFolder);
router.post("/delete-folder", deleteFolder);
router.post("/remove-recipe-from-folder", removeRecipeFromFolder);
export default router;