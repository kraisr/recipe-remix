import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const getUser = async (req, res) => {
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

// Function to update user information
export const updateUser = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const updatedUserData = req.body;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updatedUserData,
            { new: true }
        ).select('-password');

        if (!updatedUser) {
            return res.status(400).json({ error: "User does not exist" });
        }

        res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });

        } catch (error) {
            res.status(500).json({ error: error.message });
        }
  }