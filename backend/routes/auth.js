import express from "express";
import { login, register } from "../controllers/auth.js";


const router = express.Router();

/* Set routes to redirect to the correct controller in /controllers/auth.js */
router.post("/login", login);
router.post("/register", register);

export default router;



// router.get("/google",
//   passport.authenticate("google", { scope: ["profile"] })
// );

// router.get("/google/callback",
//   passport.authenticate("google", { failureRedirect: "/" }),
//   (req, res) => res.redirect("/profile")
// );

// router.get("/facebook",
//   passport.authenticate("facebook")
// );

// router.get("/facebook/callback",
//   passport.authenticate("facebook", { failureRedirect: "/" }),
//   (req, res) => res.redirect("/profile")
// );

// module.exports = router;
