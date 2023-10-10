import express from "express";
import { mode , reminder , reminderSetting } from "../controllers/set.js";


const router = express.Router();

/* Set routes to redirect to the correct controller in /controllers/auth.js */
router.post("/mode", mode);
router.post("/reminder", reminder);
router.post("/reminderSetting", reminderSetting);


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
