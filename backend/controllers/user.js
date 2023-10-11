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

        const { 
            firstName,
            username,
            bio,
            link,
            image, 
        } = req.body;
    
        const updatedUserData = {
            firstName,
            username,
            bio,
            link
        };

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { 
                firstName: firstName,
                username: username,
                bio: bio,
                link: link,
                image: image,
              },
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

export const updatePreferences = async (req, res) => {
    try {
        // const token = req.headers.authorization.split(" ")[1];
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const userId = decoded.id;

        const { 
            email,
            preferences
        } = req.body;

        const updatedUser = await User.findOne({ email });
        console.log(updatedUser);
        if (!updatedUser) {
            return res.status(400).json({ error: "User does not exist" });
        }

        updatedUser.preferences = preferences;
        await updatedUser.save();

        res.status(200).json({ message: "Preferences updated successfully", user: updatedUser });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}