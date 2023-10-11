import express from "express";
import {getUser, updateUser} from "../controllers/user.js";
import {requestResetPassword, resetPassword} from"../controllers/resetPassword.js"
import {sendCode} from "../controllers/code.js"

const router = express.Router();

/* GET USER DATA */
router.get("/user", getUser);
router.post("/user", updateUser);

/* FORGOT PASSWORD */
router.post("/requestResetPassword", requestResetPassword);
router.post("/resetPassword", resetPassword);

/* 2FA CODE */
router.post("/code", sendCode);

export default router;