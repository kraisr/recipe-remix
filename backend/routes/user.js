import express from "express";
import {addIngredient, getFromPantry, deleteIngredient} from "../controllers/user.js";
import { getUser, updateUser, updatePreferences, mode, reminder, reminderSetting } from "../controllers/user.js";
import { requestResetPassword, resetPassword } from"../controllers/resetPassword.js";
import { sendEmail, updateReminder } from "../controllers/sendEmail.js";import {sendCode} from "../controllers/code.js"

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

/* Set routes to redirect to the correct controller in /controllers/auth.js */
router.post("/mode", mode);
router.post("/reminder", reminder);
router.post("/reminderSetting", reminderSetting);


/* PANTRY ROUTES */
router.post("/add-pantry", addIngredient);
router.get("/get-pantry", getFromPantry);
router.post("/delete-pantry", deleteIngredient);



/* 2FA CODE */
router.post("/code", sendCode);

export default router;