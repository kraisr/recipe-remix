import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const user = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId).select('-password');

        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

export const addIngredient = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const ingredient = req.body.ingredientName;

        const updatedPantry = await User.findOneAndUpdate(
            { _id: userId, "pantry.ingredientName": { $ne: ingredient } },
            { $addToSet: { pantry: { ingredientName: ingredient } } },
            { new: true }
        ).select('-password');

        console.log(updatedPantry);

        if (!updatedPantry) {
            return res.status(400).json({ error: "Error updating pantry or ingredient already exists" });
        }

        res.status(200).json(updatedPantry);
    } catch (err) {
        console.error("Error in addIngredient function:", err);
        res.status(500).json({ error: err.message });
    }
};




export const getFromPantry = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({ error: "User does not exist" });
        }

        res.status(200).json(user.pantry);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
