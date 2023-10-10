import User from "../models/User.js";

export const mode = async (req, res) => {
  try {
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

      console.log(`Updated mode to ${mode} successfully`);
      //console.log(`Updated ${preferenceName} preference to ${updatedValue} successfully`);

      return res.status(200).json(updatedUser);
    
  } catch (error) {
    console.error("Error updating preference:", error);
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

      // Save the updated user object
      const updatedUser = await user.save();

      console.log(`Updated reminder to ${reminder} successfully`);
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

    // Find the user by email
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the everydayAt and everydayAtTime fields
    user.reminderSetting.email = preferenceEmail;
    user.reminderSetting.everydayAt.bool = everydayAt;
    user.reminderSetting.everyHour.bool = everyHour;
    user.reminderSetting.everydayAt.time = everydayAtTime;
    user.reminderSetting.everyHour.time = everyHourTime;

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




