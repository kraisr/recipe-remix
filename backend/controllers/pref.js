import User from "../models/User.js";

export const preference = async (req, res) => {
  try {
    const { email, preferenceName, updatedValue } = req.body;

    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

      // Update the specific preference name with the updated value
      user.preferences[preferenceName] = updatedValue;

      // Save the updated user object
      const updatedUser = await user.save();

      console.log(`Updated ${preferenceName} preference to ${updatedValue} successfully`);

      return res.status(200).json(updatedUser);
    
  } catch (error) {
    console.error("Error updating preference:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
