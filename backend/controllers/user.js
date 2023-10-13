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

        res.status(200).json({ message: "Ingredient added successfully" });
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

export const deleteIngredient = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.id;

        const ingredient = req.body.ingredientName;

        const updatedPantry = await User.findByIdAndUpdate(
            userId,
            { $pull: { pantry: { ingredientName: ingredient } } },
            { new: true }
        ).select('-password');

        if (!updatedPantry) {
            return res.status(400).json({ error: "Error updating pantry or ingredient not found" });
        }

        res.status(200).json({ message: "Ingredient deleted successfully" });
    } catch (err) {
        console.error("Error in deleteIngredient function:", err);
        res.status(500).json({ error: err.message });
    }
};


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

export const mode = async (req, res) => {
    try {
        console.log(req.body);
        const { email, mode } = req.body;

        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
        return res.status(404).json({ error: "User not found" });
        }

        // Update the specific preference name with the updated value
        user.mode = mode;

        // Save the updated user object
        const updatedUser = await user.save();

        // console.log(`Updated mode to ${mode} successfully`);
        //console.log(`Updated ${preferenceName} preference to ${updatedValue} successfully`);

        return res.status(200).json(updatedUser);
            
    } catch (error) {
    // console.error("Error updating preference:", error);
    return res.status(500).json({ error: "Internal server error" });
    }
  };
  
  export const reminder = async (req, res) => {
    try {
      const { email, reminder } = req.body;
  
      // Find the user by email
      const user = await User.findOne({ email: email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
        // Update the specific preference name with the updated value
        user.reminder = reminder;
  
        if (!reminder) {
            user.reminderSetting.everydayAt.bool = false;
            console.log(`Updated user.reminderSetting.everydayAt.bool`);
        }

        // Save the updated user object
        const updatedUser = await user.save();
  
        // console.log(`Updated reminder to ${reminder} successfully`);
        //console.log(`Updated ${preferenceName} preference to ${updatedValue} successfully`);
  
        return res.status(200).json(updatedUser);
      
    } catch (error) {
      console.error("Error updating preference:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
  
export const reminderSetting = async (req, res) => {
    try {
        const { email, preferenceEmail, everydayAt, everyHour, everydayAtTime, everyHourTime } = req.body;
        console.log("email is ", email);
        console.log("preferenceEmail is ", preferenceEmail);
        console.log("data.reminderSetting.everydayAt is ", everydayAt);
        console.log("data.reminderSetting.everyHour is ", everyHour);
        console.log("data.reminderSetting.everydayAt.time is ", everydayAtTime);
        console.log("data.reminderSetting.everyHour.time is ", everyHourTime);
        // Find the user by email
        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update the everydayAt and everydayAtTime fields
        user.reminderSetting.email = preferenceEmail;
        user.reminderSetting.everydayAt.bool = everydayAt;
        //user.reminderSetting.everyHour.bool = everyHour;
        user.reminderSetting.everydayAt.time = everydayAtTime;
        //user.reminderSetting.everyHour.time = everyHourTime;

        // Save the updated user object
        const updatedUser = await user.save();

        console.log(`Updated preferenceEmail to ${preferenceEmail}`);
        console.log(`Updated everydayAt to ${everydayAt} and everydayAtTime to ${everydayAtTime} successfully`);
        console.log(`Updated everyHour to ${everyHour} and everydayAtTime to ${everyHourTime} successfully`);

        return res.status(200).json(updatedUser);
        
    } catch (error) {
        console.error("Error updating reminderSetting:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
}  

export const deleteAccount = async (req, res) => {
    try {
        const { email } = req.body;
        console.log("email is ", email);

        // Find and delete user
        // const result = await User.deleteOne({ email });
        const result = await User.deleteOne("x");       // [MODIFY] For presentation purposes

        // Check if deletion was successful
        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'User account deleted successfully.' });
        } else {
            res.status(400).json({ error: 'No account found with the provided email address.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'User information retrieval failed' });
    }
}