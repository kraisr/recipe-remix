import express from "express";
import { getUser, updateUser, updatePreferences } from "../controllers/user.js";
import { requestResetPassword, resetPassword } from"../controllers/resetPassword.js"
import { sendEmail } from "../controllers/send-email.js";


const router = express.Router();

/* GET USER DATA */
router.get("/user", getUser);
router.post("/user", updateUser);

/* FORGOT PASSWORD */
router.post("/requestResetPassword", requestResetPassword);
router.post("/resetPassword", resetPassword);

/* CONTACT FORM */
router.post("/send-email", sendEmail);
router.post("/update-preferences", updatePreferences);

export default router;